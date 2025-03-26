import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { config } from "@dotenvx/dotenvx";
import { input } from "@inquirer/prompts";
import boxen from "boxen";
import chalk from "chalk";
import { Command } from "commander";
import dedent from "dedent";
import { dumpConfig, loadConfig } from "./features/config.js";
import type { Config } from "./types.js";

/**
 * Initialize NotCMS
 * - Create notcms.config.json
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
 * Pull schema from NotCMS
 */
async function pull() {
  // NOTE: fetchSchema depends on the process.env, so it must be imported here
  const { fetchSchema } = await import("./features/schema.js");
  const config = await loadConfig("notcms.config.json");
  const schemaPath = config.schema;
  // schemaPath: 'src/notcms/schema.ts'
  // make directory if it doesn't exist
  await fs.mkdir(schemaPath.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });

  const schema = await fetchSchema();

  await fs.writeFile(
    schemaPath,
    // NOTE: schema's indent level is different, so cannot use dedent
    `
import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = ${JSON.stringify(schema, null, 2)} satisfies Schema;
export const nc = new Client({ schema });
    `.trim()
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

async function main() {
  const program = new Command("notcms-kit");
  // TODO: show version from package.json
  program.version("0.0.1", "-v, --version");
  // FIXME: help for commands doesn't show up when hitting -h
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
  program.parseAsync();
  const options = program.opts<{ env: string[] }>();
  const path = options.env;
  config({
    path: path,
    logLevel: "error",
  });

  program.command("init").description("Initialize NotCMS").action(init);
  program.command("pull").description("Pull schema from NotCMS").action(pull);

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
});
