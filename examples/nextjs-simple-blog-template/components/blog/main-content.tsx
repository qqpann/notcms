import { type Renderer, marked } from "marked";

const renderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<p class="font-light text-zinc-300 leading-[25px] mb-4">${text}</p>`;
  },
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<a href="${href}" title="${
      title ?? text
    }" class="text-white underline hover:opacity-80">${text}</a>`;
  },
  strong({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<strong class="font-semibold text-white">${text}</strong>`;
  },
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
    return `<h${depth} class="[font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-[#f8f7f7] text-xl md:text-2xl leading-relaxed mb-6">
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  },
  image({ href, title, text }) {
    return `<div class="w-full my-6">
              <img 
                src="${href}" 
                alt="${text}" 
                title="${title}" 
                class="w-full max-w-[601px] h-auto mx-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]"
              >
            </div>`;
  },
  code({ text, lang, escaped }) {
    return `<pre class="w-full my-4 bg-[#1e1e1e] rounded-[10px] p-4 overflow-x-auto">
              <code class="text-[#f8f7f7] text-sm">${text}</code>
            </pre>`;
  },
  codespan({ text }) {
    return `<code class="text-[#f8f7f7] bg-[#1e1e1e] rounded-[6px] px-2 py-1 text-sm">${text}</code>`;
  },
} as Renderer;

marked.use({ renderer: renderer, pedantic: false, gfm: true, breaks: true });

export function MainContent({ content }: { content: string }) {
  return (
    <main
      className="w-full max-w-[600px] mx-auto prose prose-base dark:prose-invert
        prose-headings:text-[#f8f7f7] 
        prose-strong:text-white 
        prose-p:text-zinc-300 
        prose-a:text-white 
        prose-headings:font-medium 
        prose-headings:text-xl
        md:prose-headings:text-2xl
        prose-p:text-sm
        md:prose-p:text-base
        prose-p:leading-relaxed
        prose-img:w-full
        prose-img:max-w-[601px]
        prose-img:mx-auto
        prose-pre:w-full
        prose-pre:overflow-x-auto
        prose-code:text-sm"
      dangerouslySetInnerHTML={{
        __html: marked(content ?? ""),
      }}
    />
  );
}
