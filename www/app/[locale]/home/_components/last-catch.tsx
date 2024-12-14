import { CandyButton } from "~/components/ui/button";
import { Section, SectionTitle } from "./_section";

export function LastCatch() {
  return (
    <Section className="md:pt-[300px] pb-[200px]">
      <SectionTitle className="sm:text-3xl mb-8">
        Ready to build your blog with NotCMS?
      </SectionTitle>
      <CandyButton>Get started</CandyButton>
    </Section>
  );
}
