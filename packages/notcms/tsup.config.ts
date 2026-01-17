import { defineConfig } from "tsup";

export default defineConfig([
  // SDK: 依存関係なし、ESM + CJS
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    outDir: "dist",
    target: "node18",
  },
  // CLI: 全依存関係をバンドル（CJS形式、一部の依存関係がCJSのため）
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    outExtension: () => ({ js: ".cjs" }),
    banner: { js: "#!/usr/bin/env node" },
    noExternal: [/.*/], // 全てバンドル
    outDir: "dist",
    target: "node18",
  },
]);
