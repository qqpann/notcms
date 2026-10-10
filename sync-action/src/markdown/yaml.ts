import { parseDocument, stringify } from "yaml";

function isMapping(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Parse only YAML frontmatter; never evaluate executable frontmatter engines. */
export function parseMarkdown(input: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const text = input.replace(/^\uFEFF/, "");
  if (!/^---(?:\r?\n|$)/.test(text)) return { data: {}, content: text };
  const opening = text.indexOf("\n");
  if (opening === -1) throw new Error("Unclosed YAML frontmatter");
  const remaining = text.slice(opening + 1);
  const closing = /^(?:---|\.\.\.)(?:\r?\n|$)/m.exec(remaining);
  if (!closing) throw new Error("Unclosed YAML frontmatter");
  const document = parseDocument(remaining.slice(0, closing.index), {
    version: "1.1",
  });
  if (document.errors.length) throw new Error("Invalid YAML frontmatter");
  const data: unknown = document.toJS({ maxAliasCount: 100 });
  if (data !== null && !isMapping(data)) {
    throw new Error("YAML frontmatter must be a mapping");
  }
  return {
    data: data ?? {},
    content: remaining.slice(closing.index + closing[0].length),
  };
}

export function stringifyMarkdown(
  content: string,
  data: Record<string, unknown>
): string {
  return `---\n${stringify(data, { version: "1.1", directives: false })}---\n${content}`;
}
