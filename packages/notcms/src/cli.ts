import { promises as fs, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { config } from "@dotenvx/dotenvx";
import { confirm, input } from "@inquirer/prompts";
import boxen from "boxen";
import chalk from "chalk";
import { Command } from "commander";
import dedent from "dedent";
import { dumpConfig, loadConfig } from "./cli/features/config.js";
import {
  diffSchemas,
  formatSchemaChanges,
  readGeneratedSchema,
} from "./cli/features/schema-diff.js";
import type { Config } from "./cli/types.js";

/**
 * Initialize NotCMS
 * - Create notcms.config.json
 * - Log in via browser when credentials are missing
 */
async function init() {
  const config: Config = {
    schema: await input({
      message: "Enter the path to save the schema",
      default: "src/notcms/schema.ts",
    }),
  };
  await dumpConfig("notcms.config.json", config);

  console.log(
    boxen(
      dedent`
      NotCMS Config is initialized and saved to ${chalk.blue("notcms.config.json")}.
      `,
      {
        padding: 1,
        title: "[ Success ]",
        borderColor: "green",
        borderStyle: "round",
      }
    )
  );

  // NOTE: login depends on the process.env, so it must be imported here
  const { getCredentialsFromEnv } = await import("./cli/features/login.js");
  if (!getCredentialsFromEnv()) {
    const shouldLogin = await confirm({
      message:
        "No NotCMS credentials found. Log in via browser to set them up now?",
      default: true,
    });
    if (shouldLogin) {
      await login();
    } else {
      console.log(
        boxen(
          dedent`
          You can log in later with:

            ${chalk.blue("$ npx notcms login")}

          Or set ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} in your env file manually.
          `,
          {
            padding: 1,
            title: "[ Info ]",
            borderColor: "blue",
            borderStyle: "round",
          }
        )
      );
    }
  }

  if (isNextProject()) {
    console.log(
      boxen(
        dedent`
        Next.js project detected.

        In order to use next/image with NotCMS,
        add the following to your next.config.(js|ts):

        ${boxen(
          dedent`
          module.exports = {
            images: {
              remotePatterns: [
                {
                  protocol: 'https',
                  hostname: 'api.notcms.com',
                  port: '',
                  pathname: '/v1/**',
                },
              ],
            },
          }
          `,
          { padding: 1, borderColor: "gray", borderStyle: "round" }
        )}
        `,
        {
          padding: 1,
          title: "[ Info ]",
          borderColor: "blue",
          borderStyle: "round",
        }
      )
    );
  }
}
function isNextProject() {
  // js, ts, mjs, cjs
  const ext = [".js", ".ts", ".mjs", ".cjs"];
  return ext.some((e) =>
    existsSync(path.resolve(process.cwd(), `next.config${e}`))
  );
}

/**
 * Log in to NotCMS via browser
 * - Opens the dashboard to mint a secret key
 * - Saves NOTCMS_SECRET_KEY and NOTCMS_WORKSPACE_ID to an env file
 */
async function login(options: { write?: string } = {}) {
  // NOTE: login depends on the process.env, so it must be imported here
  const { loginViaBrowser, saveCredentials } = await import(
    "./cli/features/login.js"
  );
  const credentials = await loginViaBrowser();
  const savedPath = await saveCredentials(credentials, options.write);

  console.log(
    boxen(
      dedent`
      Logged in to NotCMS.

      ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} are saved to ${chalk.blue(savedPath)}.

      Next, pull your schema:

        ${chalk.blue("$ npx notcms pull")}
      `,
      {
        padding: 1,
        title: "[ Success ]",
        borderColor: "green",
        borderStyle: "round",
      }
    )
  );
}

/**
 * Pull schema from NotCMS
 * - With --check, verify the local schema is up to date without writing (for CI/CD)
 */
async function pull(options: { check?: boolean } = {}) {
  // NOTE: fetchSchema depends on the process.env, so it must be imported here
  const { fetchSchema } = await import("./cli/features/schema.js");
  const config = await loadConfig("notcms.config.json");
  const schemaPath = config.schema;

  const schema = await fetchSchema();

  // NOTE: schema's indent level is different, so cannot use dedent
  const content = `
import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = ${JSON.stringify(schema, null, 2)} satisfies Schema;
export const nc = new Client({ schema });
    `.trim();

  if (options.check) {
    const existing = await fs.readFile(schemaPath, "utf-8").catch(() => null);
    if (existing === content) {
      console.log(
        boxen(dedent`Schema at ${chalk.blue(schemaPath)} is up to date.`, {
          padding: 1,
          title: "[ Success ]",
          borderColor: "green",
          borderStyle: "round",
        })
      );
      return;
    }
    console.log(
      boxen(
        dedent`
        Schema at ${chalk.blue(schemaPath)} is ${existing === null ? "missing" : "out of date"}.

        Run the following to update it:

          ${chalk.blue("$ npx notcms pull")}
        `,
        {
          padding: 1,
          title: "[ Check Failed ]",
          borderColor: "red",
          borderStyle: "round",
        }
      )
    );
    process.exitCode = 1;
    return;
  }

  // schemaPath: 'src/notcms/schema.ts'
  // make directory if it doesn't exist
  const previousSchema = await readGeneratedSchema(schemaPath);
  await fs.mkdir(schemaPath.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  await fs.writeFile(schemaPath, content);

  console.log(
    formatSchemaChanges(
      previousSchema === null ? null : diffSchemas(previousSchema, schema)
    )
  );

  console.log(
    boxen(
      dedent`
      Schema pulled successfully and saved to ${chalk.blue(schemaPath)}.
      `,
      {
        padding: 1,
        title: "[ Success ]",
        borderColor: "green",
        borderStyle: "round",
      }
    )
  );
}

function getCliVersion(): string {
  try {
    // dist/cli.cjs is published next to package.json
    const packageJson = JSON.parse(
      readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
    ) as { version?: unknown };
    if (typeof packageJson.version === "string") {
      return packageJson.version;
    }
  } catch {
    // Fall through to the placeholder version
  }
  return "0.0.0";
}

async function main() {
  const program = new Command("notcms");
  program.version(getCliVersion(), "-v, --version");
  program.showHelpAfterError();
  program.configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });

  const DEFAULT_ENV_PATH = [".env", ".env.local", ".dev.vars"];
  program.option(
    "-e, --env <PATH>",
    "Specify env file",
    (o) => o.split(","),
    DEFAULT_ENV_PATH
  );

  // Load env before any command action
  program.hook("preAction", (thisCommand) => {
    const options = thisCommand.opts<{ env: string[] }>();
    config({
      path: options.env,
      logLevel: "error",
    });
  });

  program.command("init").description("Initialize NotCMS").action(init);
  program
    .command("login")
    .description("Log in to NotCMS via browser and save credentials")
    .option(
      "-w, --write <PATH>",
      "Env file to save credentials to",
      ".env.local"
    )
    .action(login);
  program
    .command("pull")
    .description("Pull schema from NotCMS")
    .option(
      "--check",
      "Check if the local schema is up to date without writing (for CI/CD)"
    )
    .action(pull);

  await program.parseAsync(process.argv);
}

main().catch(async (err: Error) => {
  console.log(
    boxen(err.message, {
      padding: 1,
      title: `[ ${err.name ?? "Error"} ]`,
      borderColor: "red",
      borderStyle: "double",
    })
  );
  process.exitCode = 1;
});
