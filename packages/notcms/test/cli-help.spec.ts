import type { Command } from "commander";
import { createProgram } from "../src/cli/program.js";

function renderHelp(command: Command) {
  let output = "";
  command.configureOutput({
    writeOut: (text) => {
      output += text;
    },
  });
  command.outputHelp();
  // Commander wraps lines to the terminal width, so compare normalized text.
  return output.replace(/\s+/g, " ");
}

function findCommand(program: Command, name: string) {
  const command = program.commands.find((entry) => entry.name() === name);
  if (!command) throw new Error(`Missing command: ${name}`);
  return command;
}

describe("CLI help", () => {
  it("names the env files, the credential variables, and the docs", () => {
    const help = renderHelp(createProgram("1.2.3"));

    expect(help).toContain(
      "Set up NotCMS in a project and generate a typed client for your Notion databases"
    );
    expect(help).toContain(
      "-e, --env <PATH> Comma-separated environment file paths (default: .env,.env.local,.dev.vars)"
    );
    expect(help).toContain(
      "Commands read NOTCMS_SECRET_KEY and NOTCMS_WORKSPACE_ID from the environment or the env files."
    );
    expect(help).toContain(
      "Docs: https://docs.notcms.com/en/cli-commands/init"
    );
  });

  it("describes each step that init runs", () => {
    const help = renderHelp(findCommand(createProgram("1.2.3"), "init"));

    expect(help).toContain(
      "Create notcms.config.json, log in if needed, and pull the schema for the first time"
    );
  });

  it.each(["init", "login", "pull"])(
    "lists the global --env option in the %s help",
    (name) => {
      const help = renderHelp(findCommand(createProgram("1.2.3"), name));

      expect(help).toContain("Global Options:");
      expect(help).toContain(
        "-e, --env <PATH> Comma-separated environment file paths"
      );
    }
  );

  it("keeps the default env files as a list marked as the default", () => {
    const program = createProgram("1.2.3");

    expect(program.opts().env).toEqual([".env", ".env.local", ".dev.vars"]);
    // The preAction hook ignores missing default files only for this source.
    expect(program.getOptionValueSource("env")).toBe("default");
  });
});
