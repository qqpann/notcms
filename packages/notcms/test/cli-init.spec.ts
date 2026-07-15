import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const promptMocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  input: vi.fn(),
}));
const loginMocks = vi.hoisted(() => ({
  getCredentialsFromEnv: vi.fn(),
  loginViaBrowser: vi.fn(),
  saveCredentials: vi.fn(),
}));
const pullMocks = vi.hoisted(() => ({
  pullSchema: vi.fn(),
}));

vi.mock("@inquirer/prompts", () => promptMocks);
vi.mock("../src/cli/features/login.js", () => loginMocks);
vi.mock("../src/cli/features/pull.js", () => pullMocks);

import { init } from "../src/cli/commands";

describe("init command", () => {
  let dir: string;
  let cwdSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(tmpdir(), "notcms-init-"));
    cwdSpy = vi.spyOn(process, "cwd").mockReturnValue(dir);
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    promptMocks.input.mockResolvedValue("src/notcms/schema.ts");
  });

  afterEach(async () => {
    cwdSpy.mockRestore();
    logSpy.mockRestore();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("automatically pulls with existing credentials and prints a safe query", async () => {
    const credentials = {
      secretKey: "ncsec_existing",
      workspaceId: "ws_existing",
    };
    loginMocks.getCredentialsFromEnv.mockReturnValue(credentials);
    pullMocks.pullSchema.mockResolvedValue({
      status: "written",
      schemaPath: "src/notcms/schema.ts",
      firstDatabaseName: "Blog posts",
    });

    await init();

    expect(promptMocks.confirm).not.toHaveBeenCalled();
    expect(loginMocks.loginViaBrowser).not.toHaveBeenCalled();
    expect(pullMocks.pullSchema).toHaveBeenCalledWith({ credentials });
    expect(output()).toContain('nc.query["Blog posts"].list()');
  });

  it("passes browser login credentials directly to pull and supports an empty database name", async () => {
    vi.stubEnv("NOTCMS_SECRET_KEY", undefined);
    vi.stubEnv("NOTCMS_WORKSPACE_ID", undefined);
    const credentials = {
      secretKey: "ncsec_browser",
      workspaceId: "ws_browser",
    };
    loginMocks.getCredentialsFromEnv.mockReturnValue(null);
    promptMocks.confirm.mockResolvedValue(true);
    loginMocks.loginViaBrowser.mockResolvedValue(credentials);
    loginMocks.saveCredentials.mockResolvedValue(path.join(dir, ".env.local"));
    pullMocks.pullSchema.mockResolvedValue({
      status: "written",
      schemaPath: "src/notcms/schema.ts",
      firstDatabaseName: "",
    });

    await init();

    expect(loginMocks.saveCredentials).toHaveBeenCalledWith(
      credentials,
      undefined
    );
    expect(pullMocks.pullSchema).toHaveBeenCalledWith({ credentials });
    expect(output()).toContain('nc.query[""].list()');
    expect(output()).not.toContain("No databases are available");
    expect(output()).not.toContain("Next, pull your schema");
  });

  it("does not log in or pull when browser login is declined", async () => {
    loginMocks.getCredentialsFromEnv.mockReturnValue(null);
    promptMocks.confirm.mockResolvedValue(false);

    await init();

    expect(loginMocks.loginViaBrowser).not.toHaveBeenCalled();
    expect(pullMocks.pullSchema).not.toHaveBeenCalled();
    expect(output()).toContain("npx notcms login");
    await expect(
      fs.readFile(path.join(dir, "notcms.config.json"), "utf-8")
    ).resolves.toContain('"schema": "src/notcms/schema.ts"');
  });

  it("prints setup guidance only when the schema has no database keys", async () => {
    loginMocks.getCredentialsFromEnv.mockReturnValue({
      secretKey: "ncsec_existing",
      workspaceId: "ws_existing",
    });
    pullMocks.pullSchema.mockResolvedValue({
      status: "written",
      schemaPath: "src/notcms/schema.ts",
      firstDatabaseName: null,
    });

    await init();

    expect(output()).toContain("No databases are available");
    expect(output()).not.toContain("nc.query[");
  });

  it.each([
    { firstDatabaseName: "Blog", finalGuidance: 'nc.query["Blog"].list()' },
    {
      firstDatabaseName: null,
      finalGuidance: "No databases are available",
    },
  ])(
    "prints $finalGuidance last in a Next.js project",
    async ({ firstDatabaseName, finalGuidance }) => {
      await fs.writeFile(
        path.join(dir, "next.config.ts"),
        "export default {};"
      );
      loginMocks.getCredentialsFromEnv.mockReturnValue({
        secretKey: "ncsec_existing",
        workspaceId: "ws_existing",
      });
      pullMocks.pullSchema.mockResolvedValue({
        status: "written",
        schemaPath: "src/notcms/schema.ts",
        firstDatabaseName,
      });

      await init();

      expect(output()).toContain("Next.js project detected");
      const lastLog = logSpy.mock.calls[logSpy.mock.calls.length - 1]?.[0];
      expect(String(lastLog)).toContain(finalGuidance);
    }
  );

  function output(): string {
    return logSpy.mock.calls.map(([value]) => String(value)).join("\n");
  }
});
