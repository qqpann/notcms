import * as React from "react";
import { cn } from "~/lib/utils";

const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "container flex flex-col items-center max-w-[1440px] mx-auto px-4 pt-8 md:px-32 md:pt-24 pb-0 relative",
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
      "h-7 p-3 bg-[#1f1f20] rounded-[52px] justify-center items-center gap-2 inline-flex text-center text-white text-xs font-normal leading-snug",
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
      "text-3xl font-semibold font-Roobert tracking-[-0.01em] sm:text-5xl text-white",
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
