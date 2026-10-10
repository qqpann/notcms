import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { type Server, createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
        const repeated = await runProcess(
          process.execPath,
          [cliPath, "pull"],
          options
        );
        expect(repeated.code, `${repeated.stdout}\n${repeated.stderr}`).toBe(0);
        expect(repeated.stdout).toContain("No schema changes detected.");
        const checked = await runProcess(
          process.execPath,
          [cliPath, "pull", "--check"],
          options
        );
        expect(checked.code, `${checked.stdout}\n${checked.stderr}`).toBe(0);
        expect(checked.stdout).toContain("is up to date.");
        expect(checked.stdout).not.toContain("Schema changes:");
      } finally {
        await closeServer(server.server);
        await rm(project, { recursive: true, force: true });
      }
    }
  );
});

async function startSchemaServer(): Promise<{ server: Server; url: string }> {
  const server = createServer((request, response) => {
    if (
      request.url === "/v1/ws/ws_test/schema" &&
      request.headers.authorization === "Bearer sk_test"
    ) {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(
        JSON.stringify({
          schema: {
            blog: { id: "db_1", properties: { title: "title" } },
          },
        })
      );
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
