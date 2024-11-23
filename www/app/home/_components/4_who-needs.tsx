import * as SeparatorPrimitive from "@radix-ui/react-separator";
import Image from "next/image";
import * as React from "react";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

import { cn } from "~/lib/utils";

export function WhoNeeds() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Applications</SectionPreTitle>
        <SectionTitle>Who Needs NotCMS</SectionTitle>
      </SectionHeader>
      <div className="flex flex-col w-[984px] relative">
        <div className="flex relative self-stretch w-full flex-[0_0_auto]">
          <UserGroup
            icon={
              <Image
                src="/img/home/icon-people.svg"
                alt="Developers & engineers"
                width={16}
                height={16}
              />
            }
            title="Developers & engineers"
            description="Streamline handoffs and code faster with development-ready components"
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src="/img/home/icon-people2-group.svg"
                alt="Small teams"
                width={16}
                height={16}
              />
            }
            title="Small teams"
            description="Streamline handoffs and code faster with development-ready components"
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src="/img/home/icon-pencil2.svg"
                alt="Content writers"
                width={16}
                height={16}
              />
            }
            title="Content writers"
            description="Streamline handoffs and code faster with development-ready components"
          />
        </div>

        <GradientSeparator />

        <div className="gap-3 flex items-start relative self-stretch w-full flex-[0_0_auto]">
          <UserGroup
            icon={
              <Image
                src="/img/home/icon-people.svg"
                alt="Business managers"
                width={16}
                height={16}
              />
            }
            title="Business managers"
            description="Streamline handoffs and code faster with development-ready components"
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src="/img/home/icon-people.svg"
                alt="Independent bloggers"
                width={16}
                height={16}
              />
            }
            title="Independent bloggers"
            description="Streamline handoffs and code faster with development-ready components"
          />
        </div>
      </div>
    </Section>
  );
}

type UserGroupProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
function UserGroup({ icon, title, description }: UserGroupProps) {
  return (
    <div className="flex flex-col items-start gap-5 pt-6 pb-7 px-6 relative flex-1 grow">
      <div className="inline-flex items-center gap-2 p-3 relative flex-[0_0_auto] bg-[#ffffff03] rounded-full overflow-hidden border-[0.5px] border-white border-opacity-10 shadow-[inset_0px_-12px_16px_#ffffff14]">
        {icon}
      </div>

      <div className="flex-col gap-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-xl tracking-[0.20px] leading-5">
          {title}
        </div>

        <p className="relative self-stretch opacity-70 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base tracking-[0.16px] leading-[22px]">
          {description}
        </p>
      </div>
    </div>
  );
}

const GradientSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 from-transparent via-zinc-800 to-transparent",
        orientation === "horizontal"
          ? "bg-gradient-to-r h-[1px] w-full"
          : "bg-gradient-to-b w-[1px] h-auto min-h-full",
        className
      )}
      {...props}
    />
  )
);
GradientSeparator.displayName = SeparatorPrimitive.Root.displayName;
