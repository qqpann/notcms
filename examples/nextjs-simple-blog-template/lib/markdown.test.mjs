import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown } from "./markdown.ts";

function hrefs(html) {
  return [...html.matchAll(/(?:href|src)="([^"]*)"/g)].map((match) => match[1]);
}

test("renders raw HTML as text", () => {
  assert.ok(!renderMarkdown("<script>alert(1)</script>").includes("<script"));
  assert.ok(
    !renderMarkdown("hi <img src=x onerror=alert(1)> there").includes("<img")
  );
});

test("drops links and images with unsafe schemes", () => {
  for (const input of [
    "[x](javascript:alert(1))",
    "[x](JAVASCRIPT:alert(1))",
    "![x](data:text/html,<script>alert(1)</script>)",
  ]) {
    assert.deepEqual(hrefs(renderMarkdown(input)), [], input);
  }
});

test("keeps character references in URLs literal", () => {
  // The HTML parser would decode `&#58;` to `:` inside an attribute.
  for (const input of [
    "[x](javascript&#58;alert(1))",
    "[x](java&#x73;cript:alert(1))",
    "![x](javascript&#58;alert(1))",
  ]) {
    for (const href of hrefs(renderMarkdown(input))) {
      assert.ok(!/&#/.test(href), `${input} -> ${href}`);
    }
  }
});

test("keeps safe links, images, and code", () => {
  assert.deepEqual(
    hrefs(
      renderMarkdown(
        "[a](/posts/1#x) [b](mailto:a@b.c) [c](https://a.com/?a=1&b=2)"
      )
    ),
    ["/posts/1#x", "mailto:a@b.c", "https://a.com/?a=1&amp;b=2"]
  );
  assert.match(
    renderMarkdown("```\n<b>code</b>\n```"),
    /&lt;b&gt;code&lt;\/b&gt;/
  );
});
