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
    return process.env[key];
  }

  // Deno
  if (
    typeof globalThis === "object" &&
    "Deno" in globalThis &&
    typeof (globalThis as any).Deno?.env?.get === "function"
  ) {
    try {
      return (globalThis as any).Deno.env.get(key);
    } catch {
      return undefined;
    }
  }

  // Bun
  if (
    typeof globalThis === "object" &&
    "Bun" in globalThis &&
    typeof (globalThis as any).Bun?.env === "object"
  ) {
    return (globalThis as any).Bun.env[key];
  }

  // Vite / Astro
  try {
    if (
      // @ts-ignore
      typeof import.meta !== "undefined" &&
      // @ts-ignore
      import.meta.env &&
      // @ts-ignore
      key in import.meta.env
    ) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch {
    // ignore
  }

  return undefined;
}
