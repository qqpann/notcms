import { siteConfig } from "~/src/site-config";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between h-auto">
      <div className="w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex pb-4">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href={siteConfig.author.x}
          target="_blank"
          rel="noopener noreferrer"
        >
          Coded by {siteConfig.author.name} (@{siteConfig.author.handle})
        </a>
      </div>
    </footer>
  );
}
