"use client";
import { useLayoutEffect, useState } from "react";

import { Fragment } from "react";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";

import type { Nodes } from "hast";

// TODO?: consider cloudflare worker?
// https://shiki.matsu.io/guide/install#cloudflare-workers

export async function highlight(code: string) {
  const out = await codeToHast(code, {
    lang: "ts",
    theme: "github-dark",
    transformers: [],
  });

  return toJsxRuntime(out as Nodes, {
    Fragment,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    jsx: jsx as any,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    jsxs: jsxs as any,
  });
}

// https://shiki.matsu.io/packages/next#react-client-component
export function CodeBlock({ code }: { code: string }) {
  const [nodes, setNodes] = useState<JSX.Element>();

  useLayoutEffect(() => {
    void highlight(code).then(setNodes).catch(console.error);
  }, []);

  return nodes ?? <p>Loading...</p>;
}
