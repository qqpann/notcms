import Image from "next/image";
import * as React from "react";

import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function HowWorks() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Architecture</SectionPreTitle>
        <SectionTitle>How NotCMS works</SectionTitle>
      </SectionHeader>
      <div className="flex flex-col items-center w-full">
        {/* 1 */}
        <Layer className="z-50">
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-1-website.png"
              width={256}
              height={148}
              alt="Website"
            />
          </LayerImage>
          <LayerHeader direction="right">
            <LayerTitle>Your website</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Deploy your website to the edge with Vercel, Netlify, or any other
              static site host.
            </LayerDescription>
          </LayerHeader>
        </Layer>
        {/* 2 */}
        <Layer className="z-40">
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-2-codebase.png"
              width={256}
              height={148}
              alt="API"
            />
          </LayerImage>
          <LayerHeader direction="left">
            <LayerTitle>Website codebase</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Build your website with your design and your favorite frontend
              framework, like Next.js or Vue.
            </LayerDescription>
          </LayerHeader>
        </Layer>
        {/* 3 */}
        <Layer className="z-30">
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-3-api.png"
              width={256}
              height={148}
              alt="API"
            />
          </LayerImage>
          <LayerHeader direction="right">
            <LayerTitle>NotCMS API</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Leverage the power of NotCMS's fast API. Retrieve your content
              with typed queries.
            </LayerDescription>
          </LayerHeader>
        </Layer>
        {/* 4 */}
        <Layer className="z-20">
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-4-dashboard.png"
              width={256}
              height={148}
              alt="NotCMS Dashboard"
            />
          </LayerImage>
          <LayerHeader direction="left">
            <LayerTitle>NotCMS Dashboard</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Manage your databases with a powerful and intuitive dashboard,
              with features like version history.
            </LayerDescription>
          </LayerHeader>
        </Layer>
        {/* 5 */}
        <Layer className="z-10 mb-0">
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-5-editor.png"
              width={256}
              height={148}
              alt="Notion editor/database"
            />
          </LayerImage>
          <LayerHeader direction="right">
            <LayerTitle>Notion editor/database</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Edit your content in Notion, and sync it to your website with a
              few click.
            </LayerDescription>
          </LayerHeader>
        </Layer>
      </div>
    </Section>
  );
}

const Layer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex flex-col items-center w-full -mb-[45px]",
      className
    )}
    {...props}
  />
));
Layer.displayName = "Layer";

const LayerImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mx-auto", className)} {...props} />
));
LayerImage.displayName = "LayerImage";

interface LayerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  direction: "left" | "right";
}
const LayerHeader = React.forwardRef<HTMLDivElement, LayerHeaderProps>(
  ({ className, direction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute top-[calc(50%-38px)]",
        direction === "right" ? "pr-8 right-0 text-right" : "pl-8 left-0",
        className
      )}
      {...props}
    />
  )
);
LayerHeader.displayName = "LayerHeader";

const LayerTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold w-64", className)}
    {...props}
  />
));
LayerTitle.displayName = "LayerTitle";

const LayerDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white text-opacity-70 w-64", className)}
    {...props}
  />
));
LayerDescription.displayName = "LayerDescription";
