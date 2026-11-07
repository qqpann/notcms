import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(
  new URL("../packages/notcms/dist/cli.cjs", import.meta.url)
);

for (const mode of ["default files", "custom files", "existing environment"]) {
  test(`bundled CLI loads ${mode} and pulls a schema`, async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "notcms-bundle-"));
    const requests = [];
    const server = createServer((request, response) => {
      requests.push(request.headers.authorization);
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          schema: {
            Blog: { id: "db_fixture", properties: { Title: "title" } },
          },
        })
      );
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    try {
      const env = { ...process.env };
      for (const key of Object.keys(env)) {
        if (key.startsWith("NOTCMS_") || key.startsWith("DOTENV"))
          delete env[key];
      }
      env.DOTENVX_CONFIG = directory;
      const values = `NOTCMS_API_HOST=http://127.0.0.1:${server.address().port}\nNOTCMS_WORKSPACE_ID=fixture\n`;
      const args = [];
      if (mode === "custom files") {
        await writeFile(path.join(directory, "custom.env"), values);
        await writeFile(
          path.join(directory, "credentials.env"),
          "NOTCMS_SECRET_KEY=fixture\n"
        );
        args.push("--env", "custom.env,credentials.env");
      } else {
        await writeFile(path.join(directory, ".env"), values);
        await writeFile(
          path.join(directory, ".env.local"),
          "NOTCMS_SECRET_KEY=fixture\n"
        );
      }
      if (mode === "existing environment") {
        env.NOTCMS_SECRET_KEY = "inherited";
      }
      async function run(command) {
        return await new Promise((resolve, reject) => {
          const child = spawn(process.execPath, [cli, ...args, ...command], {
            cwd: directory,
            env,
            timeout: 15000,
          });
          let output = "";
          child.stdout.on("data", (data) => {
            output += data;
          });
          child.stderr.on("data", (data) => {
            output += data;
          });
          child.once("error", reject);
          child.once("close", (code) => resolve({ code, output }));
        });
      }
      const pull = await run(["pull"]);
      assert.equal(pull.code, 0, pull.output);
      const schemaPath = path.join(directory, "src/notcms/schema.ts");
      const schema = await readFile(schemaPath, "utf8");
      assert.match(schema, /db_fixture/);
      const check = await run(["pull", "--check"]);
      assert.equal(check.code, 0, check.output);
      assert.equal(await readFile(schemaPath, "utf8"), schema);
      const key = mode === "existing environment" ? "inherited" : "fixture";
      assert.deepEqual(requests, [`Bearer ${key}`, `Bearer ${key}`]);
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await rm(directory, { recursive: true, force: true });
    }
  });
}
