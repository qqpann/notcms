import { readFileSync } from "node:fs";
import path from "node:path";
import boxen from "boxen";
import { createProgram } from "./cli/program.js";

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
  await createProgram(getCliVersion()).parseAsync(process.argv);
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
