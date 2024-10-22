import { promises as fs } from "fs";
import { input } from "@inquirer/prompts";
import { Command } from "commander";
import { dumpConfig, loadConfig } from "./features/config";
import { fetchSchema } from "./features/schema";
import type { Config } from "./types";

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
  console.log("notcms.config.json created");
}

/**
 * Pull schema from NotCMS
 */
async function pull() {
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
    `
import { Client } from "notcms";
import type { Schema } from "notcms";

export const schema = ${schema} satisfies Schema;

export const nc = new Client({ schema });
`
  );
  console.log(`${schemaPath} updated`);
}

async function main() {
  const program = new Command("notcms-kit");
  program.command("init").description("Initialize NotCMS").action(init);
  program.command("pull").description("Pull schema from NotCMS").action(pull);
  program.showHelpAfterError();
  program.configureOutput({
    // TODO: Add colors
    // https://github.com/tj/commander.js/?tab=readme-ov-file#override-exit-and-output-handling
  });

  await program.parseAsync(process.argv);
}

main().catch(async (err) => {
  console.error(err);
  // const { default: boxen } = await import("boxen");
  // const { default: chalk } = await import("chalk");
  // console.log(boxen(chalk.red(err.message), { padding: 1 }));
  // throw err;
});
