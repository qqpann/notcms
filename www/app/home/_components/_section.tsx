import * as React from "react";
import { cn } from "~/lib/utils";

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "container flex flex-col items-center max-w-[1440px] mx-auto px-10 pt-8 md:px-32 md:pt-24 pb-0 relative",
      className
    )}
    {...props}
  />
));
Section.displayName = "Section";

const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-center space-y-8 mb-16", className)}
    {...props}
  />
));
SectionHeader.displayName = "SectionHeader";

const SectionPreTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "uppercase h-7 p-3 bg-gradient-to-b from-neutral-800 to-[#181819] rounded-[52px] shadow border border-white border-opacity-10 justify-center items-center gap-2 inline-flex text-center text-white text-xs font-normal font-['DM Mono'] leading-snug",
      className
    )}
    {...props}
  />
));
SectionPreTitle.displayName = "SectionPreTitle";

const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-3xl font-semibold font-Roobert sm:text-5xl text-white",
      className
    )}
    {...props}
  />
));
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("opacity-80", className)} {...props} />
));
SectionDescription.displayName = "SectionDescription";

export {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
  SectionDescription,
};
