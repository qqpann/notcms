import { config } from "@dotenvx/dotenvx";
import chalk from "chalk";
import { Command, Option } from "commander";
import { init, login, pull } from "./commands.js";

const DEFAULT_ENV_FILES = [".env", ".env.local", ".dev.vars"];

const CLI_DOCS_URL = "https://docs.notcms.com/en/cli-commands/init";

/**
 * Build the `notcms` command line program without parsing any arguments.
 */
export function createProgram(version: string): Command {
  const program = new Command("notcms");
  program
    .description(
      "Set up NotCMS in a project and generate a typed client for your Notion databases"
    )
    .version(version, "-v, --version")
    .showHelpAfterError()
    // Subcommands copy these settings when they are created, so configure
    // them before adding the commands. `notcms pull --help` then lists --env.
    .configureHelp({ showGlobalOptions: true })
    .configureOutput({
      outputError: (str, write) => write(chalk.red(str)),
    });

  program.addOption(
    new Option("-e, --env <PATH>", "Comma-separated environment file paths")
      .argParser((option) => option.split(","))
      .default(DEFAULT_ENV_FILES, DEFAULT_ENV_FILES.join(","))
  );
  program.addHelpText(
    "after",
    [
      "",
      "Credentials:",
      "  Commands read NOTCMS_SECRET_KEY and NOTCMS_WORKSPACE_ID from the",
      "  environment or the env files. Set both in CI, containers, and remote",
      "  sessions so that no browser login is needed.",
      "",
      `Docs: ${CLI_DOCS_URL}`,
    ].join("\n")
  );

  // Load env before any command action
  program.hook("preAction", (thisCommand) => {
    const options = thisCommand.opts<{ env: string[] }>();
    // Most projects have only some of the default files, so a missing default
    // file is expected and must not look like an error. A file named with
    // --env is expected to exist, so keep reporting it when it is missing.
    const isDefaultEnv = thisCommand.getOptionValueSource("env") === "default";
    config({
      path: options.env,
      logLevel: "error",
      ...(isDefaultEnv ? { ignore: ["MISSING_ENV_FILE"] } : {}),
    });
  });

  program
    .command("init")
    .description(
      "Create notcms.config.json, log in if needed, and pull the schema for the first time"
    )
    .action(init);
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
    .description(
      "Generate the TypeScript schema from the databases registered in NotCMS"
    )
    .option(
      "--check",
      "Check if the local schema is up to date without writing (for CI/CD)"
    )
    .action(pull);

  return program;
}
