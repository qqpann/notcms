import { readFileSync } from "node:fs";
import path from "node:path";
import { config } from "@dotenvx/dotenvx";
import boxen from "boxen";
import chalk from "chalk";
import { Command } from "commander";
import { init, login, pull } from "./cli/commands.js";

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
    (option) => option.split(","),
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
