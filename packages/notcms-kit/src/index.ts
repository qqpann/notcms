#!/usr/bin/env node
import { spawn } from "node:child_process";

console.warn(
  "\x1b[33m" + // Yellow color
    "┌─────────────────────────────────────────────────────────────┐\n" +
    "│                                                             │\n" +
    "│   ⚠️  DEPRECATION WARNING                                   │\n" +
    "│                                                             │\n" +
    "│   notcms-kit is deprecated and will be removed soon.        │\n" +
    "│   The CLI is now included in the notcms package.            │\n" +
    "│                                                             │\n" +
    "│   Please use:  npx notcms <command>                         │\n" +
    "│   Instead of:  npx notcms-kit <command>                     │\n" +
    "│                                                             │\n" +
    "└─────────────────────────────────────────────────────────────┘" +
    "\x1b[0m\n" // Reset color
);

// Forward to notcms CLI (--yes to auto-install, @latest to ensure newest version)
const args = process.argv.slice(2);
const child = spawn("npx", ["--yes", "notcms@latest", ...args], {
  stdio: "inherit",
  shell: true,
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});
