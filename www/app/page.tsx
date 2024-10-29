import { siteConfig } from "~/src/site-config";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-auto">
      <a
        href={siteConfig.waitList}
        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className="mb-3 text-2xl font-semibold">
          Join the waitlist{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
        <p className="m-0 max-w-[30ch] text-sm opacity-50">
          Get early access to NotCMS and help shape the future of the product.
        </p>
      </a>

      <div className="w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex pb-4">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://x.com/qqpann"
          target="_blank"
          rel="noopener noreferrer"
        >
          Coded by qqpann
        </a>
      </div>
    </main>
  );
}
