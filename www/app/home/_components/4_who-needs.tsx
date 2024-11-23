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

const userGroups: {
  iconUrl: string;
  title: string;
  description: string;
}[] = [
  // 1st row
  {
    iconUrl: "/img/home/icon-people.svg",
    title: "Developers & engineers",
    description:
      "Write code faster and confidently with a type safe SDK. No more hassle syncing types.",
  },
  {
    iconUrl: "/img/home/icon-people2-group.svg",
    title: "Small teams",
    description:
      "Manage your content and collaborate with your team effortlessly. No more silos.",
  },
  {
    iconUrl: "/img/home/icon-pencil2.svg",
    title: "Content writers",
    description:
      "Write content in a familiar interface and see it go live instantly. No more waiting or back-and-forth.",
  },
  // 2nd row
  {
    iconUrl: "/img/home/icon-people.svg",
    title: "Business managers",
    description:
      "Get a bird's eye view of your content and make data-driven decisions. No more guesswork.",
  },
  {
    iconUrl: "/img/home/icon-people.svg",
    title: "Independent bloggers",
    description:
      "Focus on writing and growing your audience. No more worrying, with the quickstart templates.",
  },
];

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
                src={userGroups[0].iconUrl}
                alt={userGroups[0].title}
                width={16}
                height={16}
              />
            }
            title={userGroups[0].title}
            description={userGroups[0].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src={userGroups[1].iconUrl}
                alt={userGroups[1].title}
                width={16}
                height={16}
              />
            }
            title={userGroups[1].title}
            description={userGroups[1].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src={userGroups[2].iconUrl}
                alt={userGroups[2].title}
                width={16}
                height={16}
              />
            }
            title={userGroups[2].title}
            description={userGroups[2].description}
          />
        </div>

        <GradientSeparator />

        <div className="gap-3 flex items-start relative self-stretch w-full flex-[0_0_auto]">
          <UserGroup
            icon={
              <Image
                src={userGroups[3].iconUrl}
                alt={userGroups[3].title}
                width={16}
                height={16}
              />
            }
            title={userGroups[3].title}
            description={userGroups[3].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />

          <UserGroup
            icon={
              <Image
                src={userGroups[4].iconUrl}
                alt={userGroups[4].title}
                width={16}
                height={16}
              />
            }
            title={userGroups[4].title}
            description={userGroups[4].description}
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
