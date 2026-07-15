import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import dedent from "dedent";
import type { Credentials } from "../types.js";
import { getApiHost } from "../variables.js";

const CLI_DEVICE_CLIENT_ID = "notcms-cli";
const CLI_DEVICE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";
const DEFAULT_POLL_INTERVAL_SECONDS = 5;
const MAX_POLL_INTERVAL_SECONDS = 30;
const REQUEST_TIMEOUT_MS = 15 * 1000;

type DeviceAuthorization = {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
};

export function getCredentialsFromEnv(): Credentials | null {
  const { NOTCMS_SECRET_KEY, NOTCMS_WORKSPACE_ID } = process.env;
  if (!NOTCMS_SECRET_KEY || !NOTCMS_WORKSPACE_ID) {
    return null;
  }
  return {
    secretKey: NOTCMS_SECRET_KEY,
    workspaceId: NOTCMS_WORKSPACE_ID,
  };
}

/**
 * Log in to NotCMS via browser.
 *
 * Requests a device authorization from the API, opens the dashboard's CLI
 * login page, and polls the API until the user approves the request.
 */
export async function loginViaBrowser(): Promise<Credentials> {
  const authorization = await requestDeviceAuthorization();
  const verificationUrl = parseBrowserUrl(authorization.verificationUri);
  const browserUrl = parseBrowserUrl(authorization.verificationUriComplete);
  if (verificationUrl.origin !== browserUrl.origin) {
    throw new Error("The API returned mismatched browser login URLs.");
  }

  console.log(dedent`
    Opening your browser to log in to NotCMS...

    Confirm this code in the browser:
    ${chalk.bold(authorization.userCode)}

    If the browser does not open, visit:
    ${chalk.blue(verificationUrl.toString())}
  `);
  openBrowser(browserUrl.toString());

  return pollForCredentials(authorization);
}

/**
 * Save credentials to an env file, replacing existing entries in place.
 * Returns the absolute path of the file written.
 */
export async function saveCredentials(
  credentials: Credentials,
  envPath = ".env.local"
): Promise<string> {
  const absolutePath = path.resolve(process.cwd(), envPath);
  let content = "";
  try {
    content = await fs.readFile(absolutePath, "utf-8");
  } catch {
    // The file does not exist yet; it will be created.
  }
  content = upsertEnvLine(content, "NOTCMS_SECRET_KEY", credentials.secretKey);
  content = upsertEnvLine(
    content,
    "NOTCMS_WORKSPACE_ID",
    credentials.workspaceId
  );
  // mode only applies when the file is newly created
  await fs.writeFile(absolutePath, content, { mode: 0o600 });
  await tightenPermissions(absolutePath, envPath);

  await warnIfNotGitignored(envPath);

  return absolutePath;
}

/**
 * The file now contains a secret: make sure it is not readable by group or
 * others. No-op on Windows, which has no POSIX permission bits.
 */
async function tightenPermissions(
  absolutePath: string,
  envPath: string
): Promise<void> {
  if (process.platform === "win32") {
    return;
  }
  const stat = await fs.stat(absolutePath);
  if ((stat.mode & 0o077) === 0) {
    return;
  }
  await fs.chmod(absolutePath, 0o600);
  console.log(
    chalk.gray(
      `Tightened permissions of ${path.basename(envPath)} to owner-only (600).`
    )
  );
}

function upsertEnvLine(content: string, key: string, value: string): string {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }
  const needsNewline = content.length > 0 && !content.endsWith("\n");
  return `${content}${needsNewline ? "\n" : ""}${line}\n`;
}

async function warnIfNotGitignored(envPath: string): Promise<void> {
  const gitignorePath = path.resolve(process.cwd(), ".gitignore");
  let gitignore: string;
  try {
    gitignore = await fs.readFile(gitignorePath, "utf-8");
  } catch {
    // Not a git project (or no .gitignore); nothing to check.
    return;
  }
  const fileName = path.basename(envPath);
  if (!gitignore.includes(".env")) {
    console.log(
      chalk.yellow(
        `Warning: ${fileName} does not appear to be gitignored. ` +
          `Add it to .gitignore to avoid committing your secret key.`
      )
    );
  }
}

function openBrowser(url: string): void {
  const [command, args]: [string, string[]] =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];
  const child = spawn(command, args, { stdio: "ignore", detached: true });
  child.on("error", () => {
    // The login URL is already printed; auto-open is best-effort.
  });
  child.unref();
}

async function requestDeviceAuthorization(): Promise<DeviceAuthorization> {
  let response: Response;
  try {
    response = await fetch(buildApiUrl("cli/device/authorization"), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: CLI_DEVICE_CLIENT_ID }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new Error("Failed to start browser login. Please try again.");
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error("Failed to start browser login. Please try again.");
  }

  if (!response.ok || !isDeviceAuthorizationResponse(data)) {
    throw new Error("Failed to start browser login. Please try again.");
  }

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri,
    verificationUriComplete: data.verification_uri_complete,
    expiresIn: data.expires_in,
    interval: data.interval ?? DEFAULT_POLL_INTERVAL_SECONDS,
  };
}

async function pollForCredentials(
  authorization: DeviceAuthorization
): Promise<Credentials> {
  const deadline = Date.now() + authorization.expiresIn * 1000;
  let intervalSeconds = Math.max(
    1,
    Math.min(authorization.interval, MAX_POLL_INTERVAL_SECONDS)
  );

  while (Date.now() < deadline) {
    await delay(intervalSeconds * 1000);

    let response: Response;
    try {
      response = await fetch(buildApiUrl("cli/device/token"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLI_DEVICE_CLIENT_ID,
          device_code: authorization.deviceCode,
          grant_type: CLI_DEVICE_GRANT_TYPE,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      intervalSeconds = Math.min(
        intervalSeconds * 2,
        MAX_POLL_INTERVAL_SECONDS
      );
      continue;
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      intervalSeconds = Math.min(
        intervalSeconds * 2,
        MAX_POLL_INTERVAL_SECONDS
      );
      continue;
    }
    if (response.ok && isTokenResponse(data)) {
      return {
        secretKey: data.secret_key,
        workspaceId: data.workspace_id,
      };
    }

    const error = getDeviceError(data);
    if (error === "authorization_pending") {
      continue;
    }
    if (error === "slow_down") {
      intervalSeconds = Math.min(
        intervalSeconds + 5,
        MAX_POLL_INTERVAL_SECONDS
      );
      continue;
    }
    if (error === "access_denied") {
      throw new Error("Login was denied.");
    }
    if (error === "expired_token") {
      throw new Error("Login timed out. Run the command again to retry.");
    }
    throw new Error("Browser login failed. Run the command again to retry.");
  }

  throw new Error("Login timed out. Run the command again to retry.");
}

function buildApiUrl(pathname: string): string {
  const url = new URL(getApiHost());
  url.pathname = `${url.pathname.replace(/\/$/, "")}/${pathname}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function parseBrowserUrl(value: string): URL {
  const url = new URL(value);
  const isLoopback =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopback)) {
    throw new Error("The API returned an unsafe browser login URL.");
  }
  return url;
}

function isDeviceAuthorizationResponse(value: unknown): value is {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete: string;
  expires_in: number;
  interval?: number;
} {
  return (
    isRecord(value) &&
    typeof value.device_code === "string" &&
    value.device_code.length >= 32 &&
    value.device_code.length <= 256 &&
    typeof value.user_code === "string" &&
    /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{4}$/.test(
      value.user_code
    ) &&
    typeof value.verification_uri === "string" &&
    typeof value.verification_uri_complete === "string" &&
    typeof value.expires_in === "number" &&
    Number.isFinite(value.expires_in) &&
    value.expires_in > 0 &&
    (value.interval === undefined ||
      (typeof value.interval === "number" &&
        Number.isFinite(value.interval) &&
        value.interval > 0))
  );
}

function isTokenResponse(value: unknown): value is {
  secret_key: string;
  workspace_id: string;
} {
  return (
    isRecord(value) &&
    typeof value.secret_key === "string" &&
    typeof value.workspace_id === "string"
  );
}

function getDeviceError(value: unknown): string | null {
  return isRecord(value) && typeof value.error === "string"
    ? value.error
    : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
