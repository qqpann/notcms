import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import * as React from "react";
import { siGithub } from "simple-icons";

import { CodeBlock } from "~/components/code-block";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionDescription,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

const CODE = `pnpm add notcms

import { Client } from 'notcms';
import { schema } from '../notcms/schema';
const nc = new Client({ schema });

const [pages] = await nc.query.blog.listPages();
const [page] = await nc.query.blog.getPage('<page_id>');
`;

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
        silver: `
          relative 
          bg-silver border-silver
          rounded-full
          text-base leading-4 py-1 pl-2 gap-3
          shadow-[0_0_16px_rgba(255,255,255,0.1),0px_-80px_96px_#FFFFFF14_inset,0px_3px_6px_#00000033]
          text-white
          hover:bg-white/[0.05]`,
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
      {/* <div className="container max-w-6xl px-4 md:px-6"> */}
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
            <Button variant="silver">
              <svg
                style={{ width: 20, height: 20, marginLeft: -8 }}
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d={siGithub.path}
                  fillRule="evenodd"
                />
              </svg>
              View repository
            </Button>
            <Button variant="silver" className="inline-flex items-center gap-2">
              View docs
              <ArrowRightIcon
                style={{ width: 20, height: 20, marginRight: -4 }}
              />
            </Button>
          </div>
        </div>
        <div className="w-full overflow-hidden rounded-[20px] bg-zinc-900 p-1">
          <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-zinc-50">
            <CodeBlock code={CODE} />
          </pre>
        </div>
      </div>
      {/* </div> */}
    </Section>
  );
}
