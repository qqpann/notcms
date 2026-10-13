import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

// Load the CLI's .env.local before importing the generated client.
// Deployment environment values take precedence over local files.
const local = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  "NOTCMS_"
);
for (const [key, value] of Object.entries(local)) {
  process.env[key] ??= value;
}
export default defineConfig({});
