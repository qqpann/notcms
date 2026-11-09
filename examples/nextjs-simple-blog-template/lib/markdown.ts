import { Marked, type RendererObject } from "marked";

/**
 * Notion content is not trusted HTML: anyone who can edit the source page
 * controls it. This renderer treats raw HTML as text, escapes code, and only
 * keeps link and image URLs with a safe scheme, so the output can be passed to
 * `dangerouslySetInnerHTML` without running scripts or event handlers.
 */

const SAFE_URL_SCHEMES = new Set(["http", "https", "mailto"]);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns an attribute-safe URL, or null when the URL uses a scheme other than
 * http, https, or mailto (for example `javascript:` or `data:`). Relative URLs
 * and fragments are kept.
 */
export function safeUrl(href: string): string | null {
  // Browsers ignore ASCII whitespace and control characters inside a scheme,
  // so `java\tscript:` must be treated as `javascript:`.
  const normalized = href.replace(/[\u0000- \u007f]/g, "");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(normalized)?.[1];
  if (scheme !== undefined && !SAFE_URL_SCHEMES.has(scheme.toLowerCase())) {
    return null;
  }
  try {
    // encodeURI percent-encodes quotes, angle brackets, and spaces, but keeps
    // `&`, `#`, and `;`. Escape for the attribute as well, so a character
    // reference such as `javascript&#58;` stays literal text instead of being
    // decoded by the HTML parser into a scheme that skipped the check above.
    return escapeHtml(encodeURI(href.trim()).replace(/%25/g, "%"));
  } catch {
    return null;
  }
}

const renderer: RendererObject = {
  html({ text }) {
    return escapeHtml(text);
  },
  paragraph({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<p class="font-light text-zinc-300 leading-[25px]">${text}</p>`;
  },
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const url = safeUrl(href);
    if (url === null) return text;
    // marked has already escaped `title`.
    const titleAttribute = title ? ` title="${title}"` : "";
    return `<a href="${url}"${titleAttribute} class="text-white underline">${text}</a>`;
  },
  strong({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<strong class="font-semibold text-white">${text}</strong>`;
  },
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const anchor = text.toLowerCase().replace(/[^\w]+/g, "-");
    return `<h${depth} class="[font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-[#f8f7f7] leading-8 mb-[1.5rem]">
              <a name="${anchor}" class="anchor" href="#${anchor}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  },
  image({ href, title, text }) {
    const url = safeUrl(href);
    // marked has already escaped `text` (alt) and `title`.
    if (url === null) return text;
    const titleAttribute = title ? ` title="${title}"` : "";
    return `<img src="${url}" alt="${text}"${titleAttribute} class="relative max-w-[601px] h-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]">`;
  },
  code({ text, escaped }) {
    const code = escaped ? text : escapeHtml(text);
    return `<pre class="bg-[#1e1e1e] rounded-[10px] p-[1rem] overflow-x-auto"><code class="text-[#f8f7f7]">${code}</code></pre>`;
  },
  codespan({ text }) {
    // marked escapes inline code text while tokenizing.
    return `<code class="text-[#f8f7f7] bg-[#1e1e1e] rounded-[10px] p-[0.25rem]">${text}</code>`;
  },
};

const markdown = new Marked({
  renderer,
  pedantic: false,
  gfm: true,
  breaks: true,
  async: false,
});

export function renderMarkdown(content: string): string {
  return markdown.parse(content, { async: false });
}
