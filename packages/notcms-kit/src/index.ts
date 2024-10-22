import { promises as fs } from "node:fs";
import { input } from "@inquirer/prompts";
import boxen from "boxen";
import chalk from "chalk";
import { Command } from "commander";
import dedent from "dedent";
import { dumpConfig, loadConfig } from "./features/config.js";
import { fetchSchema } from "./features/schema.js";
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
    dedent`
    import { Client } from "notcms";
    import type { Schema } from "notcms";

    export const schema = ${schema} satisfies Schema;
    export const nc = new Client({ schema });
    `
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
  program.command("init").description("Initialize NotCMS").action(init);
  program.command("pull").description("Pull schema from NotCMS").action(pull);
  program.showHelpAfterError();
  program.configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });

  await program.parseAsync(process.argv);
}

main().catch(async (err: Error) => {
  console.log(
    boxen(err.message, {
      padding: 1,
      title: `[ ${chalk.bold(err.name ?? "Error")} ]`,
      borderColor: "red",
      borderStyle: "double",
    })
  );
});
