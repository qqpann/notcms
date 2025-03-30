/**
 * Safely retrieves the value of an environment variable across multiple runtimes:
 * Node.js, Deno, Bun, and Vite (import.meta.env).
 *
 * @param {string} key - The name of the environment variable to retrieve.
 * @returns {string | undefined} The value of the environment variable, or undefined if not found.
 *
 * Supports:
 * - Node.js (`process.env`)
 * - Deno (`globalThis.Deno.env.get`)
 * - Bun (`globalThis.Bun.env`)
 * - Vite/Astro (`import.meta.env`)
 *
 * Note:
 *   While Node.js, Deno, and Bun are JavaScript runtimes (executing code),
 *   Vite/Astro's `import.meta.env` is a build-time variable substitution mechanism.
 *   They are treated together here for convenience, but they operate at different layers of the stack.
 */
export function getEnv(key: string): string | undefined {
  // Node.js
  if (typeof process !== "undefined" && process.env && key in process.env) {
    return process.env?.[key]?.trim() ?? undefined;
  }

  // Deno
  if (
    typeof globalThis === "object" &&
    "Deno" in globalThis &&
    typeof (globalThis as any).Deno?.env?.get === "function" &&
    typeof (globalThis as any).Deno.env.get(key) === "string"
  ) {
    return (globalThis as any).Deno.env.get(key).trim() ?? undefined;
  }

  // Bun
  if (
    typeof globalThis === "object" &&
    "Bun" in globalThis &&
    typeof (globalThis as any).Bun?.env === "object" &&
    typeof (globalThis as any).Bun.env[key] === "string"
  ) {
    return (globalThis as any).Bun.env[key].trim() ?? undefined;
  }

  // Vite / Astro
  if (
    typeof import.meta === "object" &&
    "env" in import.meta &&
    typeof (import.meta as any).env[key] === "string"
  ) {
    return (import.meta as any).env[key];
  }

  return undefined;
}
