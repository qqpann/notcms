import { existsSync } from "node:fs";
import path from "node:path";
import { confirm, input } from "@inquirer/prompts";
import boxen from "boxen";
import chalk from "chalk";
import dedent from "dedent";
import { dumpConfig } from "./features/config.js";
import type { DependencySetupResult } from "./features/dependency.js";
import type { PullSchemaOptions, PullSchemaResult } from "./features/pull.js";
import type { Config, Credentials } from "./types.js";

type LoginResult = {
  credentials: Credentials;
  savedPath: string;
};

/**
 * Initialize NotCMS from project config through the first schema pull.
 */
export async function init() {
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
    printNextProjectGuidance();
  }

  // NOTE: login depends on process.env, so it must be imported after the CLI
  // preAction hook has loaded the configured env files.
  const { getCredentialsFromEnv } = await import("./features/login.js");
  let credentials = getCredentialsFromEnv();
  if (!credentials) {
    const shouldLogin = await confirm({
      message:
        "No NotCMS credentials found. Log in via browser to set them up now?",
      default: true,
    });
    if (shouldLogin) {
      const result = await authenticate();
      credentials = result.credentials;
      printLoginSuccess(result, false);
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

  if (credentials) {
    const { ensureNotcmsDependency } = await import("./features/dependency.js");
    const dependencySetup = await ensureNotcmsDependency();
    await runPull({ credentials });
    if (dependencySetup.status === "manual") {
      printManualDependencyGuidance(dependencySetup);
    }
  }
}

/**
 * Log in to NotCMS via browser and save the returned credentials.
 */
export async function login(options: { write?: string } = {}) {
  const result = await authenticate(options.write);
  printLoginSuccess(result, true);
}

/**
 * Pull the current workspace schema, optionally checking without writing.
 */
export async function pull(options: { check?: boolean } = {}) {
  await runPull({ check: options.check });
}

function isNextProject() {
  const ext = [".js", ".ts", ".mjs", ".cjs"];
  return ext.some((extension) =>
    existsSync(path.resolve(process.cwd(), `next.config${extension}`))
  );
}

function printNextProjectGuidance() {
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

async function authenticate(write?: string): Promise<LoginResult> {
  // NOTE: login depends on process.env, so it must be imported after the CLI
  // preAction hook has loaded the configured env files.
  const { loginViaBrowser, saveCredentials } = await import(
    "./features/login.js"
  );
  const credentials = await loginViaBrowser();
  const savedPath = await saveCredentials(credentials, write);

  return { credentials, savedPath };
}

function printLoginSuccess(result: LoginResult, showPullHint: boolean) {
  const message = showPullHint
    ? dedent`
      Logged in to NotCMS.

      ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} are saved to ${chalk.blue(result.savedPath)}.

      Next, pull your schema:

        ${chalk.blue("$ npx notcms pull")}
    `
    : dedent`
      Logged in to NotCMS.

      ${chalk.yellow("NOTCMS_SECRET_KEY")} and ${chalk.yellow("NOTCMS_WORKSPACE_ID")} are saved to ${chalk.blue(result.savedPath)}.
    `;
  console.log(
    boxen(message, {
      padding: 1,
      title: "[ Success ]",
      borderColor: "green",
      borderStyle: "round",
    })
  );
}

function printManualDependencyGuidance(
  result: Extract<DependencySetupResult, { status: "manual" }>
) {
  if (!("command" in result)) {
    console.log(
      boxen(
        dedent`
          The schema was generated, but NotCMS could not safely choose a package manager.

          ${result.error}

          Fix the package manager configuration, then install ${chalk.yellow("notcms")} as a direct project dependency.
        `,
        {
          padding: 1,
          title: "[ Action required ]",
          borderColor: "yellow",
          borderStyle: "round",
        }
      )
    );
    return;
  }

  const reason =
    result.reason === "failed"
      ? dedent`
          Automatic installation failed:
          ${result.error ?? "Unknown package manager error"}
        `
      : result.reason === "declined"
        ? "Automatic installation was declined."
        : "Automatic installation was skipped in this non-interactive session.";
  const dependencyState =
    result.verificationRequired === "target-pnp"
      ? `The schema was generated, but this Yarn PnP project's ${chalk.yellow("notcms")} resolution has not been verified.`
      : `The schema was generated, but the project still needs the ${chalk.yellow("notcms")} package before it can run the first query.`;
  console.log(
    boxen(
      dedent`
        ${dependencyState}

        ${reason}

        Install it manually with:

          ${chalk.blue(`$ ${result.command}`)}
      `,
      {
        padding: 1,
        title: "[ Action required ]",
        borderColor: "yellow",
        borderStyle: "round",
      }
    )
  );
}

async function runPull(options: PullSchemaOptions = {}) {
  // NOTE: pullSchema depends on process.env for both the API host and optional
  // credentials, so it must be imported after the preAction hook has run.
  const { pullSchema } = await import("./features/pull.js");
  const result = await pullSchema(options);
  printPullResult(result);
}

function printPullResult(result: PullSchemaResult) {
  if (result.status === "stale") {
    const reason = result.reason === "missing" ? "missing" : "out of date";
    console.log(
      boxen(
        dedent`
          Schema at ${chalk.blue(result.schemaPath)} is ${reason}.

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

  if (result.status === "up-to-date") {
    console.log(
      boxen(dedent`Schema at ${chalk.blue(result.schemaPath)} is up to date.`, {
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
      Schema pulled successfully and saved to ${chalk.blue(result.schemaPath)}.
      `,
      {
        padding: 1,
        title: "[ Success ]",
        borderColor: "green",
        borderStyle: "round",
      }
    )
  );

  printFirstQuery(result);
}

function printFirstQuery(
  result: Extract<PullSchemaResult, { status: "written" }>
) {
  if (result.firstDatabaseName === null) {
    console.log(
      boxen(
        dedent`
          No databases are available in this workspace yet.

          Add and sync a database in the dashboard, then run:

            ${chalk.blue("$ npx notcms pull")}
        `,
        {
          padding: 1,
          title: "[ Next step ]",
          borderColor: "blue",
          borderStyle: "round",
        }
      )
    );
    return;
  }

  const databaseName = JSON.stringify(result.firstDatabaseName);
  console.log(
    boxen(
      dedent`
        Try your first query using the ${chalk.blue("nc")} exported from ${chalk.blue(result.schemaPath)}:

          ${chalk.blue(`const [pages, error] = await nc.query[${databaseName}].list();`)}
          ${chalk.blue("if (error) throw error;")}
          ${chalk.blue("console.log(pages);")}
      `,
      {
        padding: 1,
        title: "[ Next step ]",
        borderColor: "blue",
        borderStyle: "round",
      }
    )
  );
}
