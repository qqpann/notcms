import Image from "next/image";
import * as React from "react";

import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function WhyBetterSection() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>WHY NOTCMS IS BETTER</SectionPreTitle>
        <SectionTitle>Why NotCMS is better</SectionTitle>
      </SectionHeader>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-[20px] md:grid-cols-46">
        <WritingCard />
        <DevelopmentCard />
        <ScaleCard />
        <CollaborationCard />
      </div>
    </Section>
  );
}

function WritingCard() {
  return (
    <Card className="col-span-1 md:col-span-23">
      <CardHeader>
        <CardTitle>
          <span className="text-rose-500">Writing is effortless.</span> With
          Notion's user-friendly editor.
        </CardTitle>
        <CardDescription>
          Most CMS' have editors with high learning curves. NotCMS uses the
          user-friendly Notion editor to write.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-1-writing.webp"
        width={400}
        height={200}
        alt="Notion-like editor interface"
        className="mx-auto"
      />
    </Card>
  );
}
function DevelopmentCard() {
  return (
    <Card className="col-span-1 md:col-span-23">
      <CardHeader>
        <CardTitle>
          <span className="text-rose-500">Faster development.</span> Deploy
          within minutes.
        </CardTitle>
        <CardDescription>
          NotCMS SDK turns what properties you have into TypeScript type, and
          helps you while you code.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-2-development.webp"
        width={400}
        height={200}
        alt="NotCMS SDK in action"
        className="mr-auto"
      />
    </Card>
  );
}
function ScaleCard() {
  return (
    <Card className="col-span-1 md:col-span-18">
      <CardHeader>
        <CardTitle>
          <span className="text-rose-500">Built for scale.</span> Accelerate
          your audience growth today.
        </CardTitle>
        <CardDescription>
          Drive growth and retention with fast loading times that support your
          site.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-3-scale.webp"
        width={363}
        height={231}
        alt="NotCMS SDK in action"
        className="ml-auto"
      />
    </Card>
  );
}
function CollaborationCard() {
  return (
    <Card className="col-span-1 md:col-span-28 flex flex-col justify-between">
      <CardHeader>
        <CardTitle>
          <span className="text-rose-500">Seamless collaboration.</span> From
          ideation to published in one place.
        </CardTitle>
        <CardDescription>
          Using Notion's multiplayer capabilities and user roles, everyone gets
          to perform their tasks seamlessly in a single environment.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-4-collaborate.webp"
        width={528}
        height={231}
        alt="NotCMS SDK in action"
        className="mx-auto"
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