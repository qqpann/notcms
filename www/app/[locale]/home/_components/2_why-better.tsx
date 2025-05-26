import Image from "next/image";
import * as React from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

const SparkleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12.9367 3.64886L12.0003 1.15198L11.064 3.64886C9.66542 7.37843 7.3788 9.66506 3.64922 11.0636L1.15234 12L3.64922 12.9363C7.3788 14.3349 9.66542 16.6215 11.064 20.3511L12.0003 22.848L12.9367 20.3511C14.3353 16.6215 16.6219 14.3349 20.3515 12.9363L22.8483 12L20.3515 11.0636C16.6219 9.66506 14.3353 7.37843 12.9367 3.64886Z"
      fill="currentColor"
    />
  </svg>
);

export function WhyBetter() {
  return (
    <Section className="md:pt-0">
      <SectionHeader>
        <SectionPreTitle>
          <SparkleIcon />
          Why NotCMS?
        </SectionPreTitle>
        <SectionTitle>A superior headless CMS</SectionTitle>
      </SectionHeader>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-[20px] lg:grid-cols-46">
        <WritingCard />
        <DevelopmentCard />
        <ScaleCard />
        <CollaborationCard />
      </div>
    </Section>
  );
}

function HighlightSpan({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: `
          linear-gradient(112.64deg, #FF8763 6.05%, #FE0291 50.08%),
          linear-gradient(215.66deg, rgba(255, 255, 255, 0) 30.91%, rgba(255, 255, 255, 0.8) 38.97%, rgba(255, 255, 255, 0.8) 41.4%, rgba(255, 255, 255, 0) 48.71%)
        `,
        backgroundSize: "cover",
        // Follow the order! webkit first!
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
function WritingCard() {
  return (
    <Card className="col-span-1 lg:col-span-23">
      <CardHeader>
        <CardTitle className="font-550 text-2xl">
          <HighlightSpan>Writing is effortless.</HighlightSpan> With Notion's
          user-friendly editor.
        </CardTitle>
        <CardDescription>
          Most CMS' have editors with high learning curves. NotCMS uses the
          user-friendly Notion editor to write.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-1-writing.webp"
        width={400}
        height={200}
        alt="Notion-like editor interface"
        className="mx-auto"
      />
    </Card>
  );
}
function DevelopmentCard() {
  return (
    <Card className="col-span-1 lg:col-span-23">
      <CardHeader>
        <CardTitle className="font-550 text-2xl">
          <HighlightSpan>Faster development.</HighlightSpan> Deploy within
          minutes.
        </CardTitle>
        <CardDescription>
          NotCMS SDK turns what properties you have into TypeScript type, and
          helps you while you code.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-2-development.svg"
        width={482}
        height={157}
        alt="NotCMS SDK in action"
        className="mx-auto"
      />
    </Card>
  );
}
function ScaleCard() {
  return (
    <Card className="col-span-1 lg:col-span-18">
      <CardHeader>
        <CardTitle className="font-550 text-2xl">
          <HighlightSpan>Built for scale.</HighlightSpan> Accelerate your
          audience growth today.
        </CardTitle>
        <CardDescription>
          Drive growth and retention with fast loading times that support your
          site.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-3-scale.webp"
        width={363}
        height={231}
        alt="NotCMS SDK in action"
        className="ml-auto w-full"
      />
    </Card>
  );
}
function CollaborationCard() {
  return (
    <Card className="col-span-1 lg:col-span-28 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="font-550 text-2xl">
          <HighlightSpan>Seamless collaboration.</HighlightSpan> From ideation
          to published in one place.
        </CardTitle>
        <CardDescription>
          Using Notion's multiplayer capabilities and user roles, everyone gets
          to perform their tasks seamlessly in a single environment.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-2-why-better-4-collaborate.webp"
        width={528}
        height={231}
        alt="NotCMS SDK in action"
        className="mx-auto"
      />
    </Card>
  );
}
