import Image from "next/image";
import React from "react";
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
        <SectionPreTitle>Composable content architecture</SectionPreTitle>
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
            <LayerDescription>
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
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
            <LayerDescription>
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
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
            <LayerDescription>
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
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
            <LayerDescription>
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
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
            <LayerDescription>
              Powerful and intuitive interfaces that are the fabric of your
              composable content architecture.
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
        "absolute top-[calc(50%-28px)] w-64",
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
    className={cn("text-xl font-semibold mb-2", className)}
    {...props}
  />
));
LayerTitle.displayName = "LayerTitle";

const LayerDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-gray-400", className)} {...props} />
));
LayerDescription.displayName = "LayerDescription";
