import * as SeparatorPrimitive from "@radix-ui/react-separator";
import Image from "next/image";
import * as React from "react";

import { GradientSeparator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

export function WhoNeeds() {
  const userGroups: {
    iconUrl: string;
    title: string;
    description: string;
  }[] = [
    // 1st row
    {
      iconUrl: "/img/home/icon-independent-bloggers.svg",
      title: "Independent bloggers",
      description:
        "Focus on writing and growing your audience. No more worrying, with the quickstart templates.",
    },
    {
      iconUrl: "/img/home/icon-content-writers.svg",
      title: "Content writers",
      description:
        "Write content in a familiar interface and see it go live instantly. No more waiting or back-and-forth.",
    },
    {
      iconUrl: "/img/home/icon-devs-engineers.svg",
      title: "Developers & engineers",
      description:
        "Write code faster and confidently with a type safe SDK. No more hassle syncing types.",
    },
    // 2nd row
    {
      iconUrl: "/img/home/icon-business-managers.svg",
      title: "Business managers",
      description:
        "Get a bird's eye view of your content and make data-driven decisions. No more guesswork.",
    },
    {
      iconUrl: "/img/home/icon-small-teams.svg",
      title: "Small teams",
      description:
        "Manage your content and collaborate with your team effortlessly. No more silos.",
    },
  ];
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Who needs NotCMS</SectionPreTitle>
        <SectionTitle>
          Designed for every
          <br />
          type of collaboration and team
        </SectionTitle>
      </SectionHeader>
      <div className="flex flex-col max-w-[984px] relative">
        <div className="flex flex-col md:flex-row relative self-stretch w-full flex-[0_0_auto]">
          <UserGroup
            icon={
              <Image
                src={userGroups[0].iconUrl}
                alt={userGroups[0].title}
                width={40}
                height={40}
              />
            }
            title={userGroups[0].title}
            description={userGroups[0].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />
          <GradientSeparator className="md:hidden" />

          <UserGroup
            icon={
              <Image
                src={userGroups[1].iconUrl}
                alt={userGroups[1].title}
                width={40}
                height={40}
              />
            }
            title={userGroups[1].title}
            description={userGroups[1].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />
          <GradientSeparator className="md:hidden" />

          <UserGroup
            icon={
              <Image
                src={userGroups[2].iconUrl}
                alt={userGroups[2].title}
                width={40}
                height={40}
              />
            }
            title={userGroups[2].title}
            description={userGroups[2].description}
          />
        </div>

        <GradientSeparator />

        <div className="flex flex-col md:flex-row relative self-stretch w-full flex-[0_0_auto]">
          <UserGroup
            icon={
              <Image
                src={userGroups[3].iconUrl}
                alt={userGroups[3].title}
                width={40}
                height={40}
              />
            }
            title={userGroups[3].title}
            description={userGroups[3].description}
          />

          <GradientSeparator orientation="vertical" className="mx-3" />
          <GradientSeparator className="md:hidden" />

          <UserGroup
            icon={
              <Image
                src={userGroups[4].iconUrl}
                alt={userGroups[4].title}
                width={40}
                height={40}
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
      {icon}

      <div className="flex-col gap-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-xl leading-5">
          {title}
        </div>

        <p className="relative self-stretch opacity-70 [font-family:'Inter-Regular',Helvetica] font-normal text-white text-base leading-[22px]">
          {description}
        </p>
      </div>
    </div>
  );
}
