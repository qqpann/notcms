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

export function KillerFeatures() {
  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>Designed for speed</SectionPreTitle>
        <SectionTitle>Killer features for everyone</SectionTitle>
      </SectionHeader>
      <div className="w-full grid grid-cols-1 gap-[20px] md:grid-cols-7">
        <ArticleSnapshots />
        <ViaCDN />
        <DiffView />
        <SafelyTyped />
      </div>
    </Section>
  );
}

function ArticleSnapshots() {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Article snapshots</CardTitle>
        <CardDescription>
          Capture a moment while Notion continues to be edited. While you keep
          writing freely, keep your production not messed up
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-1-snapshots.png"
        width={434}
        height={257}
        alt="article snapshots"
        className="mx-auto"
      />
    </Card>
  );
}
function ViaCDN() {
  return (
    <Card className="col-span-1 md:col-span-3 flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Faster load times via CDN
        </CardTitle>
        <CardDescription>
          Get the best performance by serving your images via CDN.
          {/* We support all the popular image formats and sizes */}
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-2-cdn.png"
        width={458}
        height={288}
        alt="via CDN"
        className="w-full"
      />
    </Card>
  );
}
function DiffView() {
  return (
    <Card className="col-span-1 md:col-span-3 md:col-start-2">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          A Diff View to see your changes
        </CardTitle>
        <CardDescription>
          Compare two versions of your content side-by-side. Easily spot the
          differences and make the right decision.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-3-diff-view.png"
        width={458}
        height={288}
        alt="diff view"
        className="ml-auto"
      />
    </Card>
  );
}
function SafelyTyped() {
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-medium">
          Data is safely Typed
        </CardTitle>
        <CardDescription>
          We use TypeScript to ensure the best developer experience and
          performance. No more runtime errors.
        </CardDescription>
      </CardHeader>
      <Image
        src="/img/home/lp-6-killer-feature-4-typed.png"
        width={458}
        height={288}
        alt="safely typed"
        className="ml-auto"
      />
    </Card>
  );
}
