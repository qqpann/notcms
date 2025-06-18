import { Slot } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { type VariantProps, cva } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import * as React from "react";
import { siGithub } from "simple-icons";

import { CodeBlock } from "~/components/code-block";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/src/site-config";
import {
  Section,
  SectionDescription,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

const LightningIcon = () => (
  <svg
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.53222 1.09766C4.24814 1.09766 3.98844 1.25816 3.8614 1.51225L1.6114 6.01226C1.36206 6.51091 1.72468 7.09766 2.28222 7.09766H3.81491L2.81154 10.1914C2.57555 10.919 3.45253 11.4916 4.02378 10.9828L10.845 4.90773C11.3597 4.4493 11.0354 3.59766 10.3461 3.59766H8.3858L9.2043 2.23353C9.5042 1.73364 9.14415 1.09766 8.56115 1.09766H4.53222Z"
      fill="#CCCCCC"
    />
  </svg>
);

const codeExamples: {
  id: string;
  language: string;
  code: string;
}[] = [
  {
    id: "nextjs",
    language: "Next.js",
    code: `// app/blog/page.tsx
import { Client } from 'notcms';
import { schema } from '../../notcms/schema';

const nc = new Client({ schema });

export default async function Blog() {
  const [pages] = await nc.query.blog.list();
  const [page] = await nc.query.blog.get('<page_id>');

  return (
    <div>
      <h1>Blog</h1>
      <h2>{page.title}</h2>
      <p>{page.content}</p>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },
  {
    id: "remix",
    language: "Remix",
    code: `// routes/blog.jsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Client } from 'notcms';
import { schema } from '../notcms/schema';

export const loader = async () => {
  const nc = new Client({ schema });

  const [pages] = await nc.query.blog.list();
  const [page] = await nc.query.blog.get('<page_id>');

  return json({ pages, page });
};

export default function Blog() {
  const { pages, page } = useLoaderData();

  return (
    <div>
      <h1>Blog</h1>
      <h2>{page.title}</h2>
      <p>{page.content}</p>
      <ul>
        {pages.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
  },
];

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-[30px] items-center justify-center rounded-lg",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      `inline-flex items-center justify-center whitespace-nowrap
       rounded-[14px] px-4 py-1 text-sm font-medium ring-offset-background
       transition-all
       text-white/50
       hover:text-white
       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
       disabled:pointer-events-none disabled:opacity-30 
       data-[state=active]:bg-silver data-[state=active]:text-white data-[state=active]:shadow`,
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export function MakeWith() {
  return (
    <Section className="w-full py-12 md:py-24 lg:py-32">
      {/* <div className="container max-w-6xl px-4 md:px-6"> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-2">
            <SectionPreTitle>
              <LightningIcon />
              Development ready
            </SectionPreTitle>
            <SectionTitle>
              Make with your
              <br />
              framework in mind.
            </SectionTitle>
            <SectionDescription>
              NotCMS comes with a TypeScript SDK. Your databases comes to your
              hands with a few typed properties.
            </SectionDescription>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  style={{ width: 20, height: 20, marginLeft: -8 }}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d={siGithub.path}
                    fillRule="evenodd"
                  />
                </svg>
                View repository
                <ArrowRightIcon
                  style={{ width: 20, height: 20, marginRight: -4 }}
                />
              </a>
            </Button>
            {/* <Button className="inline-flex items-center gap-2">
              View docs
              <ArrowRightIcon
                style={{ width: 20, height: 20, marginRight: -4 }}
              />
            </Button> */}
          </div>
        </div>
        <Card
          // TODO: reverse rounded tabs & px-1
          className="w-full border-silver overflow-hidden rounded-[20px] px-1.5 py-1.5"
          style={{
            boxShadow: "inset 0 -32px 80px 0 rgba(255, 255, 255, 0.08)",
          }}
        >
          <Tabs defaultValue={codeExamples[0].id} className="w-full">
            <TabsList className="mb-4">
              {codeExamples.map((example) => (
                <TabsTrigger key={example.id} value={example.id}>
                  {example.language}
                </TabsTrigger>
              ))}
            </TabsList>
            {codeExamples.map((example) => (
              <TabsContent
                key={example.id}
                value={example.id}
                className="px-5 overflow-auto max-h-[300px]"
              >
                <ScrollArea>
                  <CodeBlock language="typescript" content={example.code} />
                  <ScrollBar orientation="horizontal" className="opacity-10" />
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
      {/* </div> */}
    </Section>
  );
}
