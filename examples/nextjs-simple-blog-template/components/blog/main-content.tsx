import { renderMarkdown } from "./render-markdown";

export function MainContent({ content }: { content: string }) {
  return (
    <main
      className="prose prose-base dark:prose-invert w-full text-justify prose-headings:text-[#f8f7f7] prose-strong:text-white prose-p:text-zinc-300 prose-a:text-white prose-headings:font-medium prose-headings:text-2xl leading-tight text-zinc-300 text-sm font-normal"
      dangerouslySetInnerHTML={{
        __html: renderMarkdown(content ?? ""),
      }}
    />
  );
}
