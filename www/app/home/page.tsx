import Image from "next/image";
import { Hero } from "./_components/1_hero";
import { WhyNotCMSIsBetter } from "./_components/2_why-nc-is-better";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyNotCMSIsBetter />
    </>
  );
}
