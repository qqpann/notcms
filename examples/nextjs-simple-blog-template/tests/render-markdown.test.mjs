import assert from "node:assert/strict";
import { test } from "node:test";
import { renderMarkdown } from "../components/blog/render-markdown.ts";

test("keeps ordinary Markdown, static HTML, and escaped code", () => {
  const html = renderMarkdown(
    `# Heading\n\nA **bold** and *emphasized* paragraph with [docs](https://docs.notcms.com "Docs").\n\n- [x] Done\n- [ ] Next\n\n| Left | Right |\n| :--- | ---: |\n| one | two |\n\n<details><summary>More</summary><kbd>Enter</kbd></details>\n\n![Photo](/photo.png "Picture")\n\n\`<img src=x onerror=alert(1)>\`\n\n\`\`\`html\n<div>hello & goodbye</div>\n\`\`\``
  );
  for (const fragment of [
    "<h1",
    "<strong",
    "<em>",
    'href="https://docs.notcms.com"',
    'name="notcms-heading-heading"',
    "<table>",
    'align="right"',
    "<details>",
    "<kbd>Enter</kbd>",
    'src="/photo.png"',
    "&lt;div&gt;hello &amp; goodbye&lt;/div&gt;",
    "&lt;img src=x onerror=alert(1)&gt;",
  ]) {
    assert.ok(html.includes(fragment), fragment);
  }
  assert.match(html, /<input[^>]*checked[^>]*disabled/);
  assert.doesNotMatch(html, /data-notcms-block-code/);
});

for (const source of [
  '<script>alert(1)</script><p onclick="alert(2)">Text</p>',
  '<img src="x" onerror="alert(1)" style="background:url(javascript:alert(1))">',
  '<svg><a xlink:href="javascript:alert(1)"><text>SVG</text></a></svg>',
  '<math><annotation-xml encoding="text/html"><img src=x onerror=alert(1)></annotation-xml></math>',
  '<iframe srcdoc="<script>alert(1)</script>"></iframe><object data="data:text/html,payload"></object><embed src="javascript:alert(1)">',
  '<form action="javascript:alert(1)"><input type="image" src=x onerror=alert(1) autofocus><button formaction="javascript:alert(1)">Submit</button></form>',
  '<a href="https://example.com" target="_blank" ping="https://tracker.invalid" id="location" name="location">Link</a>',
  '<div class="fixed inset-0" style="position:fixed">Text</div>',
  '<noscript><p title="</noscript><img src=x onerror=alert(1)>">Text</p></noscript>',
]) {
  test(`removes active HTML: ${source}`, () => {
    const html = renderMarkdown(source);
    assert.doesNotMatch(
      html,
      /<(?:script|style|svg|math|iframe|object|embed|form|button)\b/i
    );
    assert.doesNotMatch(
      html,
      /\s(?:on\w+|style|srcdoc|autofocus|formaction|ping|target|id)\s*=/i
    );
    assert.doesNotMatch(html, /name="location"|class="fixed/);
  });
}

for (const url of [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "jav&#x61;script:alert(1)",
  "java&#x09;script:alert(1)",
  "java\nscript:alert(1)",
  "vbscript:msgbox(1)",
  "data:image/svg+xml,payload",
  "data:text/html,payload",
  "file:///etc/passwd",
  "//example.com/image.png",
  "\\\\example.com/image.png",
]) {
  test(`removes unsafe URL: ${url}`, () => {
    const html = renderMarkdown(
      `<a href="${url}">Link</a><img src="${url}" alt="Photo">`
    );
    assert.doesNotMatch(html, /\s(?:href|src)=/i);
    assert.ok(html.includes("Link"));
  });
}

test("preserves relative links, fragments, mailto links and HTTPS images", () => {
  const html = renderMarkdown(
    "[relative](/blog/post) [fragment](#section) [email](mailto:hello@example.com) ![image](https://example.com/image.png)"
  );
  for (const url of [
    "/blog/post",
    "#section",
    "mailto:hello@example.com",
    "https://example.com/image.png",
  ])
    assert.ok(html.includes(url));
  assert.doesNotMatch(
    renderMarkdown('<img src="mailto:hello@example.com">'),
    /\ssrc=/
  );
});

for (const [source, attribute] of [
  ['[click](https://example.com "&#34; onclick=&#34;alert(1)")', "onclick"],
  [
    '![alt](https://example.com/image.png "&#34; onerror=&#34;alert(1)")',
    "onerror",
  ],
]) {
  test(`keeps injected attribute text inside an escaped title: ${attribute}`, () => {
    const html = renderMarkdown(source);
    assert.ok(html.includes(`title="&quot; ${attribute}=&quot;alert(1)"`));
    assert.ok(!html.includes(`" ${attribute}="`));
  });
}
