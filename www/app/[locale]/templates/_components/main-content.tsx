import { type Renderer, marked } from "marked";
import React from "react";
import { cn } from "~/lib/utils";

const renderer: Partial<Renderer> = {
  paragraph({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<p class="font-light text-zinc-300 leading-[25px]">${text}</p>`;
  },
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<a href="${href}" title="${
      title ?? text
    }" class="text-white underline">${text}</a>`;
  },
  strong({ tokens }) {
    const text = this.parser.parseInline(tokens);
    return `<strong class="font-semibold text-white">${text}</strong>`;
  },
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
    return `<h${depth} class="[font-family:'Selecta_VF_Trial-Medium',Helvetica] font-medium text-[#f8f7f7] leading-8 mb-[1.5rem]">
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${depth}>`;
  },
  image({ href, title, text }) {
    return `<img src="${href}" alt="${text}" title="${title}" class="relative w-full h-auto bg-black rounded-[10px] border-[0.5px] border-solid border-[#ffffff1f] shadow-[0px_2px_2px_-1px_#000000,0px_4px_4px_-2px_#000000]">`;
  },
  code({ text, lang, escaped }) {
    return `<pre class="bg-[#1e1e1e] rounded-[10px] p-[1rem] overflow-x-auto"><code class="text-[#f8f7f7]">${text}</code></pre>`;
  },
  codespan({ text }) {
    return `<code class="text-[#f8f7f7] bg-[#1e1e1e] rounded-[10px] p-[0.25rem]">${text}</code>`;
  },
} as Renderer;
marked.use({ renderer: renderer, pedantic: false, gfm: true, breaks: true });

export const MainContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { content: string }
>(({ className, content, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "prose prose-base dark:prose-invert text-justify prose-headings:text-[#f8f7f7] prose-strong:text-white prose-p:text-zinc-300 prose-a:text-zinc-200 prose-headings:font-medium prose-h1::text-2xl prose-h2:text-lg prose-h3:text-base leading-tight text-zinc-300 text-sm font-normal",
      className
    )}
    {...props}
    dangerouslySetInnerHTML={{
      __html: marked(content ?? ""),
    }}
  />
));
MainContent.displayName = "MainContent";
