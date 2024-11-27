import { siGithub } from "simple-icons";
import { CodeBlock } from "~/components/code-block";
import {
  Section,
  SectionDescription,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        github: `
        rounded-full
        shadow-[0_0_16px_rgba(255,255,255,0.1),0px_-80px_96px_#FFFFFF14_inset,0px_3px_6px_#00000033]
        text-white
        hover:bg-white/[0.05]
      `,
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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

export { Button, buttonVariants };

export function MakeWith() {
  return (
    <Section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950">
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <SectionPreTitle>DEVELOPER FORWARD</SectionPreTitle>
              <SectionTitle>Make with your framework in mind.</SectionTitle>
              <SectionDescription>
                NotCMS comes with a TypeScript SDK. Your databases comes to your
                hands with a few typed properties.
              </SectionDescription>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="github"
                // variant="secondary"
                // className="inline-flex items-center gap-2"
                className="relative text-base leading-4 py-1 pl-2 gap-3"
                style={{
                  background:
                    "radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 72%, rgba(255, 255, 255, 0) 100%)",
                  // border: "1px solid rgba(255, 255, 255, 0.12)",
                  // border: "1px solid transparent",
                  // boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                  // border: "none",
                  // boxShadow:
                  //   "0 0 16px rgba(255, 255, 255, 0.1), 0px -80px 96px #FFFFFF14 inset, 0px 3px 6px #00000033",
                  // // border image
                  // borderWidth: "1px",
                  // borderStyle: "solid",
                  // borderImage:
                  //   "linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0)) 1",
                }}
              >
                <span
                  style={{
                    content: '""',
                    position: "absolute",
                    inset: 0, // 全体をカバー
                    borderRadius: "inherit", // ボタンの形状に合わせる
                    padding: "0.5px", // ボーダーの幅
                    background:
                      "linear-gradient(to bottom, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0))", // グラデーション
                    WebkitMask:
                      "linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)", // ボーダーの中身を切り抜く
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    zIndex: 0, // 背景より下
                  }}
                />
                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d={siGithub.path}
                    fillRule="evenodd"
                  />
                </svg>
                View repository
              </Button>
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2"
              >
                View docs
                <span className="ml-1">→</span>
              </Button>
            </div>
          </div>
          <div className="w-full overflow-hidden rounded-lg bg-zinc-900 p-6 lg:p-8">
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-zinc-50">
              <CodeBlock
                code={`{notcms}    '@notcms/database/'

GET

sql    neon process.env.DATABASE_URL

rows           process.env.DATABASE_URL

Response.json`}
              />
            </pre>
          </div>
        </div>
      </div>
    </Section>
  );
}
