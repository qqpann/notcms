import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const repository = fileURLToPath(new URL("../", import.meta.url));
const coreGuides = [
  "introduction",
  "quickstart",
  "usage/initializing-client",
  "usage/list",
  "usage/get",
  "examples/nextjs",
];

async function filesUnder(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await filesUnder(path.join(directory, entry.name), name)));
    } else {
      files.push(name);
    }
  }
  return files;
}

export function extractSnippets(source, file) {
  return [
    ...source.matchAll(
      /\{\/\* docs-check \*\/\}\s*```(?:ts|typescript)\s*\n([\s\S]*?)\n```/g
    ),
  ].map((match) => ({
    file,
    line: source.slice(0, match.index).split("\n").length + 2,
    code: match[1],
  }));
}

export async function auditDocs(directory) {
  const files = new Set(await filesUnder(directory));
  const pages = [...files].filter((file) => file.endsWith(".mdx"));
  const errors = [];
  const snippets = [];
  const config = JSON.parse(
    await readFile(path.join(directory, "docs.json"), "utf8")
  );
  const languages = config.navigation.languages;
  function checkLink(url, from) {
    const resolved = new URL(
      url,
      `https://docs.notcms.com/${from.replace(/\.mdx$/, "")}`
    );
    if (resolved.hostname === "notcms.com") {
      errors.push(`${from}: use https://www.notcms.com instead of ${url}`);
      return;
    }
    if (resolved.origin !== "https://docs.notcms.com" || url.startsWith("#"))
      return;
    const target = decodeURIComponent(resolved.pathname).replace(
      /^\/+|\/+$/g,
      ""
    );
    if (
      ![target, `${target}.mdx`, `${target}/index.mdx`].some((candidate) =>
        files.has(candidate)
      )
    ) {
      errors.push(`${from}: missing link target ${url}`);
    }
  }
  function checkConfigLinks(value, location = "docs.json") {
    if (typeof value === "string") {
      if (/^https?:\/\//.test(value) || value.startsWith("/")) {
        checkLink(value, location);
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) =>
        checkConfigLinks(item, `${location}[${index}]`)
      );
    } else if (value && typeof value === "object") {
      for (const [key, item] of Object.entries(value)) {
        checkConfigLinks(item, `${location}.${key}`);
      }
    }
  }
  checkConfigLinks(config);
  for (const language of languages) {
    // Navigation groups may be nested; only page strings represent local routes.
    function checkNavigation(value) {
      if (typeof value === "string") checkLink(`/${value}`, "docs.json");
      else if (Array.isArray(value)) value.forEach(checkNavigation);
      else if (value && typeof value === "object") {
        if (value.pages) checkNavigation(value.pages);
        if (value.groups) checkNavigation(value.groups);
      }
    }
    checkNavigation(language.groups);
    for (const guide of coreGuides) {
      const name = `${language.language}/${guide}.mdx`;
      if (!files.has(name)) errors.push(`Missing core guide: ${name}`);
    }
  }
  for (const file of pages) {
    const source = await readFile(path.join(directory, file), "utf8");
    const checked = extractSnippets(source, file);
    snippets.push(...checked);
    const guide = file
      .split("/")
      .slice(1)
      .join("/")
      .replace(/\.mdx$/, "");
    if (coreGuides.includes(guide) && checked.length === 0) {
      errors.push(
        `${file}: mark at least one primary TypeScript example with {/* docs-check */}`
      );
    }
    const prose = source.replace(/```[^\n]*\n[\s\S]*?```/g, "");
    const links = [
      ...prose.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g),
      ...prose.matchAll(/(?:href|src)=["']([^"']+)["']/g),
    ];
    for (const [, url] of links) checkLink(url, file);
    const suffix = file.split("/").slice(1).join("/");
    for (const language of languages) {
      if (!files.has(`${language.language}/${suffix}`)) {
        errors.push(`${file}: missing ${language.language} counterpart`);
      }
    }
  }
  return { errors, snippets, pageCount: pages.length };
}

export async function typecheckSnippets(snippets, root = repository) {
  const sdkRequire = createRequire(
    path.join(root, "packages/notcms/package.json")
  );
  const ts = sdkRequire("typescript");
  const temporary = await mkdtemp(path.join(tmpdir(), "notcms-docs-"));
  try {
    await mkdir(path.join(temporary, "notcms"));
    await writeFile(
      path.join(temporary, "notcms/schema.ts"),
      await readFile(path.join(root, "scripts/docs-schema.ts"), "utf8")
    );
    const sources = new Map();
    for (const [index, snippet] of snippets.entries()) {
      const filename = path.join(temporary, `example-${index}.ts`);
      // Each published example is an independent module, never executed.
      await writeFile(filename, `${snippet.code}\nexport {};\n`);
      sources.set(filename, snippet);
    }
    const program = ts.createProgram([...sources.keys()], {
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      types: ["node"],
      typeRoots: [
        path.dirname(
          path.dirname(sdkRequire.resolve("@types/node/package.json"))
        ),
      ],
      paths: { notcms: [path.join(root, "packages/notcms/src/index.ts")] },
    });
    return ts.getPreEmitDiagnostics(program).map((diagnostic) => {
      const source = sources.get(diagnostic.file?.fileName);
      const line =
        diagnostic.file && diagnostic.start !== undefined
          ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start).line
          : 0;
      const location = source
        ? `${source.file}:${source.line + line}`
        : (diagnostic.file?.fileName ?? "TypeScript");
      return `${location}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
    });
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const result = await auditDocs(path.join(repository, "docs"));
    const errors = [
      ...result.errors,
      ...(await typecheckSnippets(result.snippets)),
    ];
    if (errors.length) {
      console.error(errors.join("\n"));
      process.exitCode = 1;
    } else {
      console.log(
        `Checked links and language parity for ${result.pageCount} pages; typechecked ${result.snippets.length} published examples.`
      );
    }
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
