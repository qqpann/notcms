import { describe, expect, it } from "vitest";
import { parseMarkdown, stringifyMarkdown } from "../src/markdown/yaml.js";

describe("safe YAML frontmatter", () => {
  it("keeps prototype-named keys as ordinary own data properties", () => {
    const data = JSON.parse(
      '{"__proto__":{"polluted":true},"constructor":"value"}'
    );
    const parsed = parseMarkdown(stringifyMarkdown("body", data));
    expect(Object.hasOwn(parsed.data, "__proto__")).toBe(true);
    expect(parsed.data.constructor).toBe("value");
    expect(Object.getPrototypeOf(parsed.data)).toBe(Object.prototype);
    expect(parsed.data).toEqual(data);
  });
  it("rejects excessive YAML alias expansion", () => {
    const yaml =
      "a: &a [x,x,x,x,x,x,x,x,x,x]\nb: &b [*a,*a,*a,*a,*a,*a,*a,*a,*a,*a]\nc: [*b,*b,*b,*b,*b,*b,*b,*b,*b,*b]";
    expect(() => parseMarkdown(`---\n${yaml}\n---\nbody`)).toThrow();
  });
  it("round trips multiline, nested and timestamp-like string properties", () => {
    const data = {
      title: "日本語: title",
      body: "line one\nline two\n",
      nested: { values: ["yes", 1, false, null] },
      date: "2026-10-11T00:00:00.000Z",
    };
    expect(parseMarkdown(stringifyMarkdown("# Content\n", data))).toEqual({
      data,
      content: "# Content\n",
    });
  });
  it("accepts existing YAML 1.1 booleans and timestamps", () => {
    const parsed = parseMarkdown(
      "---\r\nflag: yes\r\ndate: 2026-10-11\r\n---\r\nbody\r\n"
    );
    expect(parsed.data.flag).toBe(true);
    expect(parsed.data.date).toBeInstanceOf(Date);
    expect(parsed.content).toBe("body\r\n");
  });
  it("keeps ordinary Markdown unchanged", () =>
    expect(parseMarkdown("# hi\n---\ntext")).toEqual({
      data: {},
      content: "# hi\n---\ntext",
    }));
  it("supports a BOM and empty frontmatter", () =>
    expect(parseMarkdown("\uFEFF---\n---\nbody")).toEqual({
      data: {},
      content: "body",
    }));
  it.each([
    "---\nkey: [\n---\n",
    "---\nkey: value\n",
    "---\n- array\n---\n",
    "---\n42\n---\n",
  ])("rejects malformed or non-mapping frontmatter %s", (input) =>
    expect(() => parseMarkdown(input)).toThrow()
  );
  it.each(["2026-10-11", "null", "~", "!!set {a, b}", "!!binary SGVsbG8="])(
    "rejects non-mapping YAML values %s",
    (yaml) => {
      expect(() => parseMarkdown(`---\n${yaml}\n---\nbody`)).toThrow(
        "YAML frontmatter must be a mapping"
      );
    }
  );
  it("does not evaluate JavaScript frontmatter", () => {
    const text = "---js\n{ notcms_id: process.exit(1) }\n---\nbody";
    expect(parseMarkdown(text)).toEqual({ data: {}, content: text });
  });
});
