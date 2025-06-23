import * as React from "react";
import { Button, CandyButton } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import {
  Section,
  SectionHeader,
  SectionPreTitle,
  SectionTitle,
} from "./_section";

// Checkmark icon component for feature lists
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 3.5L4.5 8.5L2.5 6.5"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Coin icon for pricing tag
const CoinIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="5" fill="#FFB563" />
    <path
      d="M4.5 4.5L7.5 7.5M7.5 4.5L4.5 7.5"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

interface Plan {
  title: string;
  price?: string;
  priceUnit?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  description?: string;
}

interface PricingCardProps extends Plan {}
const PricingCard = ({
  title,
  price,
  priceUnit,
  features,
  buttonText,
  isPopular = false,
  description,
}: PricingCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      <div className="flex flex-col gap-4 p-2">
        {/* Header Section */}
        <div className="flex flex-col gap-2 items-center">
          <div className="rounded-bl-2 rounded-br-2 rounded-tl-4 rounded-tr-4 w-full">
            <div className="flex flex-col gap-4 p-4 text-white text-left">
              <div className="font-normal opacity-70 text-[15px] tracking-[-0.15px]">
                {title}
              </div>
              <div className="font-medium text-[32px] tracking-[-0.64px] leading-[72px]">
                {price ? (
                  <>
                    <span>{price}</span>
                    {priceUnit && (
                      <span className="font-normal text-[20px] text-white/70 tracking-[-0.2px]">
                        {priceUnit}
                      </span>
                    )}
                  </>
                ) : (
                  "Free"
                )}
              </div>
            </div>
          </div>
          {/* Button Section */}
          <div className="w-full px-4">
            {isPopular ? (
              <CandyButton className="w-full">{buttonText}</CandyButton>
            ) : (
              <Button className="w-full">{buttonText}</Button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white bg-opacity-[0.08] rounded-b-[12px] rounded-t-[10px] border-silver flex-1 px-4 py-5">
          <ul className="flex flex-col gap-4 list-none">
            {features.map((feature, index) => (
              <li key={index} className="flex flex-row gap-3 items-center">
                <span className="shrink-0 w-3 h-3">
                  <CheckIcon />
                </span>
                <span className="font-normal text-white text-[16px] tracking-[-0.16px] leading-4">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

interface EnterprisePlanProps extends Plan {}
const EnterprisePlan = ({
  title,
  features,
  buttonText,
  description,
}: EnterprisePlanProps) => {
  return (
    <Card
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 984 201\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.2\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(3.5908e-14 -10.675 14.101 -1.6891e-8 125 193.21)\\'><stop stop-color=\\'rgba(255,255,255,0.72)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(255,255,255,0)\\' offset=\\'1\\'/></radialGradient></defs></svg>')",
      }}
    >
      <div className="flex flex-row items-center">
        <div className="flex flex-row gap-12 items-center p-8 w-full">
          <div className="w-[476px] shrink-0">
            <div className="flex flex-col gap-8">
              <div className="rounded-bl-2 rounded-br-2 rounded-tl-4 rounded-tr-4 w-full">
                <div className="flex flex-col gap-5 text-white text-left">
                  <div className="font-medium text-[32px] tracking-[-0.64px] leading-[72px]">
                    {title}
                  </div>
                  <div className="font-normal opacity-70 text-[16px] tracking-[-0.16px] leading-[22px]">
                    {description}
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Button>{buttonText}</Button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-end justify-center h-full">
              <div className="flex flex-col gap-4 items-end justify-center w-full">
                <div className="w-full">
                  <div className="flex flex-col gap-4 items-center">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex flex-row gap-3 items-center w-full"
                      >
                        <div className="shrink-0 w-3 h-3">
                          <CheckIcon />
                        </div>
                        <div className="font-normal text-white text-[16px] tracking-[-0.16px] leading-4">
                          {feature}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export function Pricing() {
  const hobbyPlan: Plan = {
    title: "Hobby",
    features: [
      "For non-profitable projects",
      "Up to 2 members",
      "Up to 10 databases",
      "1GB image storage",
    ],
    buttonText: "Start for free",
  };

  const basicPlan: Plan = {
    title: "Basic",
    price: "$9",
    priceUnit: "/workspace",
    features: [
      "Up to 5 members",
      "Up to 20 databases",
      "10GB image storage",
      "Priority support",
    ],
    buttonText: "Get started",
    isPopular: true,
  };

  const proPlan: Plan = {
    title: "Pro",
    price: "$24",
    priceUnit: "/workspace",
    features: [
      "Up to 10 members",
      "Role based access control",
      "Up to 50 databases",
      "50GB image storage + extra $1/10GB",
      "Priority support",
    ],
    buttonText: "Get started",
  };

  const enterprisePlan: Plan = {
    title: "Enterprise",
    price: "$59",
    priceUnit: "/workspace",
    features: [
      "Unlimited members",
      "Advanced role based access control",
      "Optional help on site design",
      "Optional help on site development & deployment",
      "Priority support via Slack connect",
    ],
    buttonText: "Contact us",
    description:
      "Dedicated support, full migrations and custom integrations, custom usage needs, and more.",
  };

  return (
    <Section>
      <SectionHeader>
        <SectionPreTitle>
          <CoinIcon />
          Pricing
        </SectionPreTitle>
        <SectionTitle>Find the right plan for you</SectionTitle>
      </SectionHeader>

      {/* Main pricing cards */}
      <div className="w-full max-w-[984px] mx-auto">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <PricingCard {...hobbyPlan} />
            <PricingCard {...basicPlan} />
            <PricingCard {...proPlan} />
          </div>

          {/* Enterprise plan */}
          <EnterprisePlan {...enterprisePlan} />
        </div>
      </div>
    </Section>
  );
}
