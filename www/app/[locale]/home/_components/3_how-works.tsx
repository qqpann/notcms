"use client";
import Image from "next/image";
import * as React from "react";
import sal from "sal.js";

import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function HowWorks() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    sal();
  }, []);

  return (
    <Section data-sal-threshold="0.5">
      <SectionHeader>
        <SectionPreTitle>Architecture</SectionPreTitle>
        <SectionTitle>How NotCMS works</SectionTitle>
      </SectionHeader>
      <div className="flex flex-col items-center w-full">
        {/* 1 */}
        <Layer
          className="z-50"
          style={{ "--sal-delay": "100ms" } as React.CSSProperties}
        >
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
        <Layer
          className="z-40"
          style={{ "--sal-delay": "200ms" } as React.CSSProperties}
        >
          <LayerHeader direction="left">
            <LayerTitle>Website codebase</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Build your website with your design and your favorite frontend
              framework, like Next.js or Vue.
            </LayerDescription>
          </LayerHeader>
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-2-codebase.png"
              width={256}
              height={148}
              alt="API"
            />
          </LayerImage>
        </Layer>
        <span ref={ref} />
        {/* 3 */}
        <Layer
          className="z-30"
          style={{ "--sal-delay": "300ms" } as React.CSSProperties}
        >
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
        <Layer
          className="z-20"
          style={{ "--sal-delay": "400ms" } as React.CSSProperties}
        >
          <LayerHeader direction="left">
            <LayerTitle>NotCMS Dashboard</LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
            <LayerDescription>
              Manage your databases with a powerful and intuitive dashboard,
              with features like version history.
            </LayerDescription>
          </LayerHeader>
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-4-dashboard.png"
              width={256}
              height={148}
              alt="NotCMS Dashboard"
            />
          </LayerImage>
        </Layer>
        {/* 5 */}
        <Layer
          className="z-10 mb-0"
          style={{ "--sal-delay": "500ms" } as React.CSSProperties}
        >
          <LayerImage>
            <Image
              src="/img/home/lp-3-how-works-5-editor.png"
              width={256}
              height={148}
              alt="Notion editor / database"
            />
          </LayerImage>
          <LayerHeader direction="right">
            <LayerTitle>Notion editor / database</LayerTitle>
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
      "grid grid-cols-[1fr_auto_1fr] gap-1 w-full -mb-[45px]",
      className
    )}
    data-sal="slide-up"
    data-sal-duration="600"
    data-sal-easing="ease-in-quint"
    data-sal-threshold="1"
    style={{ "--sal-transform": "translateY(200%)" } as React.CSSProperties}
    {...props}
  />
));
Layer.displayName = "Layer";

const LayerImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("col-start-2", className)} {...props} />
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
        "mt-[40px] flex flex-col",
        direction === "right" ? "col-start-3" : "col-start-1",
        direction === "right" ? "pr-8 text-right" : "pl-8 left-0",
        direction === "right" ? "items-end" : "items-start",
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
  <span
    ref={ref}
    className={cn("text-xl font-semibold md:w-64", className)}
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
    className={cn("text-sm text-white text-opacity-70 md:w-64", className)}
    {...props}
  />
));
LayerDescription.displayName = "LayerDescription";
