import { Marked, Renderer } from "marked";
import sanitizeHtml from "sanitize-html";

const classes = {
  p: "font-light text-zinc-300 leading-[25px]",
  a: "text-white underline",
  strong: "font-semibold text-white",
  heading:
    "[font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-[#f8f7f7] leading-8 mb-[1.5rem]",
  img: "relative max-w-[601px] h-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]",
  pre: "bg-[#1e1e1e] rounded-[10px] p-[1rem] overflow-x-auto",
  code: "text-[#f8f7f7] bg-[#1e1e1e] rounded-[10px] p-[0.25rem]",
};

const markdown = new Marked({
  pedantic: false,
  gfm: true,
  breaks: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const anchor = `notcms-heading-${text.toLowerCase().replace(/[^\w]+/g, "-")}`;
      return `<h${depth}><a name="${anchor}" href="#${anchor}"><span class="header-link"></span></a>${text}</h${depth}>`;
    },
    code(token) {
      // Keep Marked's escaping. The temporary marker only selects trusted CSS;
      // it is removed by the sanitizer's attribute allowlist.
      return Renderer.prototype.code
        .call(this, token)
        .replace("<code", '<code data-notcms-block-code=""');
    },
  },
});

const styledTags = {
  p: classes.p,
  strong: classes.strong,
  img: classes.img,
  pre: classes.pre,
  ...Object.fromEntries(
    ["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => [tag, classes.heading])
  ),
};

/** Convert Markdown, then sanitize the final HTML before it reaches React. */
export function renderMarkdown(content: string): string {
  return sanitizeHtml(markdown.parse(content, { async: false }), {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "del",
      "input",
      "details",
      "summary",
    ],
    allowedAttributes: {
      "*": ["class"],
      a: ["href", "title", "name"],
      img: ["src", "alt", "title"],
      ol: ["start"],
      th: ["align"],
      td: ["align"],
      input: ["type", "disabled", "checked"],
    },
    allowedClasses: {
      "*": [],
      ...Object.fromEntries(
        Object.entries(styledTags).map(([tag, value]) => [
          tag,
          value.split(" "),
        ])
      ),
      a: [...classes.a.split(" "), "anchor"],
      code: classes.code.split(" "),
      span: ["header-link"],
    },
    transformTags: {
      ...Object.fromEntries(
        Object.entries(styledTags).map(([tag, value]) => [
          tag,
          sanitizeHtml.simpleTransform(tag, { class: value }),
        ])
      ),
      a(tagName, attribs) {
        const anchor = /^notcms-heading-[\w-]+$/.test(attribs.name ?? "");
        if (!anchor) delete attribs.name;
        return {
          tagName,
          attribs: { ...attribs, class: anchor ? "anchor" : classes.a },
        };
      },
      code(tagName, attribs) {
        return {
          tagName,
          attribs: {
            ...attribs,
            class: Object.hasOwn(attribs, "data-notcms-block-code")
              ? "text-[#f8f7f7]"
              : classes.code,
          },
        };
      },
      input(tagName, attribs) {
        return {
          tagName,
          attribs: { ...attribs, type: "checkbox", disabled: "" },
        };
      },
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    // Embedded applications and active namespaces are outside this renderer's contract.
    nonTextTags: [
      "style",
      "script",
      "textarea",
      "option",
      "xmp",
      "iframe",
      "object",
      "embed",
      "svg",
      "math",
    ],
  });
}
