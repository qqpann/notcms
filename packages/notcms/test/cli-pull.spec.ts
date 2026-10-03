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

  it.each(["schema.ts", "src/notcms/schema.ts"])(
    "writes a schema at %s through the packaged CLI",
    async (schemaPath) => {
      const project = await mkdtemp(path.join(tmpdir(), "notcms-cli-pull-"));
      const server = await startSchemaServer();

      try {
        await writeFile(
          path.join(project, "notcms.config.json"),
          JSON.stringify({ schema: schemaPath })
        );

        const result = await runProcess(process.execPath, [cliPath, "pull"], {
          cwd: project,
          env: {
            ...process.env,
            NOTCMS_API_HOST: server.url,
            NOTCMS_SECRET_KEY: "sk_test",
            NOTCMS_WORKSPACE_ID: "ws_test",
          },
        });

        expect(result.code, `${result.stdout}\n${result.stderr}`).toBe(0);
        await expect(
          readFile(path.join(project, schemaPath), "utf-8")
        ).resolves.toContain("export const schema = {");
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

  await new Promise<void>((resolve) => {
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
