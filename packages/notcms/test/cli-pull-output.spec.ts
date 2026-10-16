import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { type Server, createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Schema } from "../src/types";
import { unsupportedSchemaResponse } from "./fixtures/unsupported-schema";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const cliPath = path.join(packageRoot, "dist/cli.cjs");

describe("CLI pull output paths", () => {
  beforeAll(async () => {
    const result = await runProcess(
      process.execPath,
      [path.join(packageRoot, "node_modules/tsup/dist/cli-default.js")],
      { cwd: packageRoot }
    );
    expect(result.code, `${result.stdout}\n${result.stderr}`).toBe(0);
  });

  it("escapes control characters and Unicode line separators in unsupported-property warnings", async () => {
    const project = await mkdtemp(path.join(tmpdir(), "notcms-cli-pull-"));
    const server = await startSchemaServer({
      blog: { id: "blog", properties: { title: "title" } },
      "db\u007f\u0085": {
        id: "control",
        properties: { "column\u009b\u2028": "future\u009f\u2029" },
      },
    });

    try {
      await writeFile(
        path.join(project, "notcms.config.json"),
        JSON.stringify({ schema: "schema.ts" })
      );
      const options = {
        cwd: project,
        env: {
          ...process.env,
          NOTCMS_API_HOST: server.url,
          NOTCMS_SECRET_KEY: "sk_test",
          NOTCMS_WORKSPACE_ID: "ws_test",
        },
      };
      for (const args of [["pull"], ["pull", "--check"]]) {
        const result = await runProcess(
          process.execPath,
          [cliPath, ...args],
          options
        );
        expect(result.code, `${result.stdout}\n${result.stderr}`).toBe(0);
        expect(result.stderr).toContain(
          '  "db\\u007f\\u0085"."column\\u009b\\u2028": "future\\u009f\\u2029"'
        );
        expect(result.stderr).not.toMatch(/[\u007f-\u009f\u2028\u2029]/u);
      }
    } finally {
      await closeServer(server.server);
      await rm(project, { recursive: true, force: true });
    }
  });

  it.each([
    ["schema.ts", "process"],
    ["src/notcms/schema.ts", "process"],
    ["schema.ts", "file"],
    ["src/notcms/schema.ts", "file"],
  ])(
    "writes a schema at %s with %s credentials through the packaged CLI",
    async (schemaPath, source) => {
      const project = await mkdtemp(path.join(tmpdir(), "notcms-cli-pull-"));
      const server = await startSchemaServer();

      try {
        await writeFile(
          path.join(project, "notcms.config.json"),
          JSON.stringify({ schema: schemaPath })
        );

        const env = { ...process.env };
        delete env.NOTCMS_API_HOST;
        delete env.NOTCMS_SECRET_KEY;
        delete env.NOTCMS_WORKSPACE_ID;
        const fixtureEnv = {
          NOTCMS_API_HOST: server.url,
          NOTCMS_SECRET_KEY: "sk_test",
          NOTCMS_WORKSPACE_ID: "ws_test",
        };
        if (source === "file") {
          await writeFile(
            path.join(project, ".env.local"),
            Object.entries(fixtureEnv)
              .map(([key, value]) => `${key}=${value}`)
              .join("\n")
          );
        } else {
          Object.assign(env, fixtureEnv);
        }
        const options = { cwd: project, env };
        const result = await runProcess(
          process.execPath,
          [cliPath, "pull"],
          options
        );

        expect(result.code, `${result.stdout}\n${result.stderr}`).toBe(0);
        await expect(
          readFile(path.join(project, schemaPath), "utf-8")
        ).resolves.toContain("export const schema = {");
        expect(result.stdout).toContain('nc.query["blog"].list()');
        for (const [property, type] of Object.entries({
          action: "button",
          location: "place",
          verified: "verification",
          future: "future_widget",
        })) {
          expect(result.stderr).toContain(`"blog"."${property}": "${type}"`);
        }
        expect(result.stderr).toContain(
          "values are typed as unknown; completeness is not guaranteed"
        );
        const repeated = await runProcess(
          process.execPath,
          [cliPath, "pull"],
          options
        );
        expect(repeated.code, `${repeated.stdout}\n${repeated.stderr}`).toBe(0);
        expect(repeated.stdout).toContain("No schema changes detected.");
        const formatted =
          (await readFile(path.join(project, schemaPath), "utf8"))
            .replace(/"/g, "'")
            .replace(/;/g, "") + "\n";
        await writeFile(path.join(project, schemaPath), formatted);
        const checked = await runProcess(
          process.execPath,
          [cliPath, "pull", "--check"],
          options
        );
        expect(checked.code, `${checked.stdout}\n${checked.stderr}`).toBe(0);
        expect(checked.stdout).toContain("is up to date.");
        expect(checked.stderr).toContain('"blog"."future": "future_widget"');
        expect(checked.stdout).not.toContain("Schema changes:");
        expect(await readFile(path.join(project, schemaPath), "utf8")).toBe(
          formatted
        );
        const stale = formatted.replace("nids_blog", "db_old");
        await writeFile(path.join(project, schemaPath), stale);
        const drift = await runProcess(
          process.execPath,
          [cliPath, "pull", "--check"],
          options
        );
        expect(drift.code).toBe(1);
        expect(drift.stdout).toContain('Changed database ID: "blog"');
        expect(drift.stdout).toContain("npx notcms pull");
        expect(drift.stdout).toContain("commit the updated schema");
        expect(await readFile(path.join(project, schemaPath), "utf8")).toBe(
          stale
        );
      } finally {
        await closeServer(server.server);
        await rm(project, { recursive: true, force: true });
      }
    }
  );
});

async function startSchemaServer(
  schema: Schema = unsupportedSchemaResponse.schema
): Promise<{ server: Server; url: string }> {
  const server = createServer((request, response) => {
    if (
      request.url === "/v1/ws/ws_test/schema?include=options" &&
      request.headers.authorization === "Bearer sk_test"
    ) {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ schema }));
      return;
    }

    response.writeHead(404);
    response.end();
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  if (address === null || typeof address === "string") {
    throw new Error("Expected the schema fixture server to have a TCP address");
  }
  return { server, url: `http://127.0.0.1:${address.port}/v1` };
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

function runProcess(
  command: string,
  args: readonly string[],
  options: { cwd: string; env?: NodeJS.ProcessEnv }
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ["ignore", "pipe", "pipe"],
      signal: AbortSignal.timeout(15000),
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.once("error", reject);
    child.once("close", (code, signal) => {
      resolve({ code, signal, stdout, stderr });
    });
  });
}

type ProcessResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};
