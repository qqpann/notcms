import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: `
          relative 
          bg-silver
          rounded-full
          text-base leading-4 py-1 pl-2 gap-3
          shadow-[0_0_16px_rgba(255,255,255,0.1),0px_-80px_96px_#FFFFFF14_inset,0px_3px_6px_#00000033]
          text-white
          hover:bg-white/[0.05]`,
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-7 px-[14px] py-[9.5px] text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "default",
        size: "default",
        className: "border-silver",
      },
    ],
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface CandyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}
export const CandyButton = React.forwardRef<
  HTMLButtonElement,
  CandyButtonProps
>(({ className, children, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(
        "relative h-9 text-base font-medium text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full py-3 px-6",
        className
      )}
      style={{
        boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
        background:
          "linear-gradient(116.55deg, #FF8763 18.62%, #FE0291 96.99%)",
      }}
      {...props}
    >
      <span
        className="absolute z-10 left-0 top-0 h-9 w-full rounded-full opacity-20 mix-blend-plus-lighter"
        style={{
          border: "0.75px solid rgba(255, 255, 255, 0.32)",
          background:
            "radial-gradient(115.6% 115.9% at -1.81% 0%, rgba(255, 183, 99, 0.01) 0%, rgba(255, 81, 196, 0.01) 100%)",
          boxShadow: `
                0px 0.5px 0.5px 0px rgba(255,255,255,0.96) inset,
                0px 1.5px 1.5px 0px rgba(255,255,255,0.64) inset,
                0px 3px 3px 0px rgba(255,255,255,0.48) inset,
                0px 6px 6px 0px rgba(255,255,255,0.24) inset`,
        }}
      />
      <span
        className="absolute inset-0 left-0 top-0 h-9 w-full rounded-full mix-blend-plus-lighter"
        style={{
          padding: "0.5px", // ボーダーの幅
          background:
            "linear-gradient(270deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 100%)",
          WebkitMask:
            "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          // zIndex: "-1",
        }}
      />
      <img
        src="/img/candy-glow-left.png"
        className="absolute left-0 top-0 h-9 z-0 mix-blend-plus-lighter"
      />
      <img
        src="/img/candy-glow-right.png"
        className="absolute right-0 top-0 h-9 z-0 mix-blend-plus-lighter"
      />
      <span
        className="mix-blend-plus-darker"
        style={{
          textShadow: "0 2px 2px rgba(0,0,0,0.24), 0 8px 8px rgba(0,0,0,0.08)",
        }}
      >
        {children}
      </span>
    </button>
  );
});

export { Button, buttonVariants };
