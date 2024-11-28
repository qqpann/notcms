import Image from "next/image";
import * as React from "react";

import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function KillerFeatures() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Designed for speed</SectionPreTitle>
        <SectionTitle>Killer features for everyone</SectionTitle>
      </SectionHeader>
      <div className="w-full grid grid-cols-1 gap-[20px] md:grid-cols-7">
        <ArticleSnapshots />
        <ViaCDN />
        <DiffView />
        <SafelyTyped />
      </div>
    </Section>
  );
}

function ArticleSnapshots() {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Article snapshots</CardTitle>
        <CardDescription>
          Capture a moment while Notion continues to be edited. While you keep
          writing freely, keep your production not messed up
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-1-snapshots.png"
        width={434}
        height={257}
        alt="article snapshots"
        className="mx-auto"
      />
    </Card>
  );
}
function ViaCDN() {
  return (
    <Card className="col-span-1 md:col-span-3 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Faster load times via CDN</CardTitle>
        <CardDescription>
          Get the best performance by serving your images via CDN.
          {/* We support all the popular image formats and sizes */}
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-2-cdn.png"
        width={458}
        height={288}
        alt="via CDN"
        className="w-full"
      />
    </Card>
  );
}
function DiffView() {
  return (
    <Card className="col-span-1 md:col-span-3 md:col-start-2">
      <CardHeader>
        <CardTitle>A Diff View to see your changes</CardTitle>
        <CardDescription>
          Compare two versions of your content side-by-side. Easily spot the
          differences and make the right decision.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-3-diff-view.png"
        width={458}
        height={288}
        alt="diff view"
        className="ml-auto"
      />
    </Card>
  );
}
function SafelyTyped() {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Data is safely Typed</CardTitle>
        <CardDescription>
          We use TypeScript to ensure the best developer experience and
          performance. No more runtime errors.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-4-typed.png"
        width={458}
        height={288}
        alt="safely typed"
        className="ml-auto"
      />
    </Card>
  );
}

// ==============================
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[20px] border border-white border-opacity-10 bg-zinc-950",
      className
    )}
    style={{
      boxShadow: "inset 0 -80px 96px 0 rgba(255, 255, 255, 0.08)",
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pt-7 px-6 pb-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-white text-2xl leading-normal font-semibold tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-white/70 text-base font-normal font-['Inter'] leading-normal",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
