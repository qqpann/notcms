import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Generated schema modules import the package by its public name. Resolve
    // that self-reference to source so clean test runs do not depend on dist/.
    alias: {
      notcms: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["test/**/*.spec.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
