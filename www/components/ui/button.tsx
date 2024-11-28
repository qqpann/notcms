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
        lg: "h-10 rounded-md px-8",
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

export const CandyButton = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="relative rounded-[40px] bg-gradient-to-r from-[#FF7E58] to-[#FF0093]"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full" />
      <span className="absolute inset-0 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute -left-4 -top-4 w-12 h-12 bg-orange-300 rounded-full blur-md" />
        <span className="absolute -right-4 -bottom-4 w-12 h-12 bg-purple-400 rounded-full blur-md" />
      </span>
      <span
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.5)",
        }}
      />
    </button>
  );
};

export { Button, buttonVariants };
