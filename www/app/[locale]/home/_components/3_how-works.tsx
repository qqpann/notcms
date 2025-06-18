"use client";
import Image from "next/image";
import * as React from "react";
import sal from "sal.js";

import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { GradientSeparator, Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

const TwoLayersIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9229 7.10168C11.6716 7.46693 11.6716 8.53331 10.9229 8.89856L6.93848 10.8429C6.66183 10.9777 6.33814 10.9778 6.06152 10.8429L2.07715 8.89856C1.32863 8.53326 1.32866 7.46701 2.07715 7.10168L2.28516 7.00012L6.06152 8.8429C6.33814 8.9778 6.66183 8.97772 6.93848 8.8429L10.7158 7.00012L10.9229 7.10168ZM6.06152 2.15735C6.33814 2.02241 6.66183 2.0225 6.93848 2.15735L10.9229 4.10168C11.6716 4.46694 11.6716 5.53331 10.9229 5.89856L6.93848 7.8429C6.66183 7.97773 6.33814 7.97781 6.06152 7.8429L2.07715 5.89856C1.32864 5.53325 1.32865 4.46699 2.07715 4.10168L6.06152 2.15735Z"
      fill="#CCCCCC"
    />
  </svg>
);

export function HowWorks() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    sal();
  }, []);

  return (
    <Section
      data-sal-threshold="0.5"
      style={{
        background: `
          radial-gradient(35% 25.52% at 50% 36.46%, rgba(255, 255, 255, 0.06) 0%, rgba(15, 15, 17, 0) 100%),
          radial-gradient(35% 27.17% at 50% 61.19%, rgba(255, 255, 255, 0.06) 0%, rgba(15, 15, 17, 0) 100%)
        `,
      }}
    >
      <SectionHeader>
        <SectionPreTitle>
          <TwoLayersIcon />
          Architecture
        </SectionPreTitle>
        <SectionTitle>
          Complete customization
          <br />
          across every layer
        </SectionTitle>
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
            <LayerTitle>
              <span className="md:hidden inline-block">1</span>
              <span className="hidden md:inline-block">Your Website</span>
            </LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
          </LayerHeader>
        </Layer>
        {/* 2 */}
        <Layer
          className="z-40"
          style={{ "--sal-delay": "200ms" } as React.CSSProperties}
        >
          <LayerHeader direction="left">
            <LayerTitle>
              <span className="md:hidden inline-block">2</span>
              <span className="hidden md:inline-block">Website codebase</span>
            </LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
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
            <LayerTitle>
              <span className="md:hidden inline-block">3</span>
              <span className="hidden md:inline-block">NotCMS API</span>
            </LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
          </LayerHeader>
        </Layer>
        {/* 4 */}
        <Layer
          className="z-20"
          style={{ "--sal-delay": "400ms" } as React.CSSProperties}
        >
          <LayerHeader direction="left">
            <LayerTitle>
              <span className="md:hidden inline-block">4</span>
              <span className="hidden md:inline-block">NotCMS Dashboard</span>
            </LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
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
            <LayerTitle>
              <span className="md:hidden inline-block">5</span>
              <span className="hidden md:inline-block">
                Notion editor / database
              </span>
            </LayerTitle>
            <Separator className="bg-white opacity-[0.12] my-3" />
          </LayerHeader>
        </Layer>
        <HorizontalLayerDescription />
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
    data-sal-duration="900"
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
        direction === "right"
          ? "pr-2.5 md:pr-16 text-right"
          : "pl-2.5 md:pl-16 left-0",
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
    className={cn(
      "text-base font-Roobert tracking-normal font-semibold md:w-64",
      className
    )}
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

// Horizontal descriptions
const horizontalLayerDescriptions: {
  imageUrl: string;
  title: string;
  description: string;
}[] = [
  {
    imageUrl: "/img/central-icons/compass-square.svg",
    title: "Your website",
    description:
      "Deploy your website to the edge with Vercel, Netlify, or any other static site host.",
  },
  {
    imageUrl: "/img/central-icons/code-brackets.svg",
    title: "Website codebase",
    description:
      "Build your website with your design and your favorite frontend framework, like Next.js or Vue.",
  },
  {
    imageUrl: "/img/central-icons/plugin.svg",
    title: "NotCMS API",
    description:
      "Leverage the power of NotCMS's fast API. Retrieve your content with typed queries.",
  },
  {
    imageUrl: "/img/central-icons/dashboard-low.svg",
    title: "NotCMS Dashboard",
    description:
      "Manage your databases with a powerful and intuitive dashboard, with features like version history.",
  },
  {
    imageUrl: "/img/central-icons/server-2.svg",
    title: "Notion editor / database",
    description:
      "Edit your content in Notion, and sync it to your website with a few click.",
  },
];

function HorizontalLayerDescription({
  children,
  className,
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <ScrollArea className="w-full">
      <div className="self-stretch justify-start items-start inline-flex">
        {horizontalLayerDescriptions.map((item, index) => (
          <>
            {index > 0 && (
              <GradientSeparator orientation="vertical" className="mx-3" />
            )}
            <HorizontalLayerDescriptionItem
              key={index}
              imageUrl={item.imageUrl}
              number={index + 1}
              title={item.title}
              description={item.description}
            />
          </>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

function HorizontalLayerDescriptionItem({
  imageUrl,
  number,
  title,
  description,
}: React.PropsWithChildren<{
  imageUrl: string;
  number: number;
  title: string;
  description: string;
}>) {
  return (
    <div className="w-64 md:w-auto px-5 pt-4 pb-5 flex-col justify-start items-start gap-5 inline-flex">
      <Image
        src={imageUrl}
        alt=""
        className="size-[24px]"
        width={24}
        height={24}
      />
      <div className="self-stretch text-white text-[15px] leading-none font-semibold">
        <span className="text-white font-medium md:hidden">{number}.</span>{" "}
        {title}
      </div>
      <div className="self-stretch opacity-70 text-white text-sm font-normal">
        {description}
      </div>
    </div>
  );
}
