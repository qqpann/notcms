import { Zap } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { cn } from "~/lib/utils";

export function WhyBetterSection() {
  return (
    <section className="container max-w-[1440px] px-32 mx-auto flex flex-col items-center gap-24 pt-24 pb-0 relative">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="h-7 p-3 bg-gradient-to-b from-neutral-800 to-[#181819] rounded-[52px] shadow border border-white border-opacity-10 justify-center items-center gap-2 inline-flex">
              <div className="text-center text-white text-xs font-normal font-['DM Mono'] leading-snug">
                WHY NOTCMS IS BETTER{" "}
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              Why NotCMS is better
            </h2>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-[20px] md:grid-cols-46 mt-12">
          {/* Writing Card */}
          <WritingCard />
          {/* <div className="relative overflow-hidden rounded-[20px] border border-white border-opacity-10 bg-zinc-950 p-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                <span className="text-rose-500">Writing is effortless.</span>{" "}
                With Notion's user-friendly editor.
              </h3>
              <p className="text-zinc-400">
                Most CMS' have editors with high learning curves. NotCMS uses
                the user-friendly Notion editor to write.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  width={400}
                  height={200}
                  alt="Notion-like editor interface"
                  className="rounded-md"
                />
              </div>
            </div>
          </div> */}

          {/* Development Card */}
          <DevelopmentCard />

          {/* Scale Card */}
          <ScaleCard />

          {/* Collaboration Card */}
          <CollaborationCard />
        </div>
      </div>
    </section>
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
