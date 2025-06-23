import * as React from "react";
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

interface PricingCardProps {
  title: string;
  price?: string;
  priceUnit?: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  isEnterprise?: boolean;
  description?: string;
}

const PricingCard = ({
  title,
  price,
  priceUnit,
  features,
  buttonText,
  isPopular = false,
  isEnterprise = false,
  description,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "bg-zinc-900 rounded-3xl border border-white/50 flex flex-col h-full",
        isEnterprise && "rounded-[20px]"
      )}
    >
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
            <button
              className={cn(
                "h-9 w-full rounded-full border border-white/50 flex items-center justify-center relative",
                isPopular
                  ? "bg-gradient-to-r from-[#ff8763] to-[#fe0291] text-white shadow-sm"
                  : "bg-white/1 text-white shadow-inner"
              )}
              style={
                !isPopular
                  ? {
                      background:
                        "linear-gradient(178.071deg, rgba(255, 255, 255, 0.12) 11.048%, rgba(255, 255, 255, 0.03) 68.85%, rgba(255, 255, 255, 0) 91.328%)",
                      boxShadow:
                        "0px -80px 96px 0px inset rgba(255,255,255,0.08)",
                    }
                  : undefined
              }
            >
              <span className="font-medium text-[16px] tracking-[-0.16px]">
                {buttonText}
              </span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/8 rounded-bl-3 rounded-br-3 rounded-tl-[10px] rounded-tr-[10px] border border-white/50 flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-row gap-3 items-center">
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
  );
};

const EnterprisePlan = () => {
  return (
    <div
      className="bg-zinc-900 rounded-3xl border border-white/50 relative overflow-hidden"
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
                    Enterprise
                  </div>
                  <div className="font-normal opacity-70 text-[16px] tracking-[-0.16px] leading-[22px]">
                    Dedicated support, full migrations and custom integrations,
                    custom usage needs, and more.
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <button
                    className="h-9 rounded-full border border-white/50 flex items-center justify-center px-[18px] bg-white/1 text-white"
                    style={{
                      background:
                        "linear-gradient(175.755deg, rgba(255, 255, 255, 0.12) 11.048%, rgba(255, 255, 255, 0.03) 68.85%, rgba(255, 255, 255, 0) 91.328%)",
                      boxShadow:
                        "0px -80px 96px 0px inset rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="font-medium text-[16px]">Contact us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-end justify-center h-full">
              <div className="flex flex-col gap-4 items-end justify-center w-full">
                <div className="w-full">
                  <div className="flex flex-col gap-4 items-center">
                    {[
                      "Free to Hobby Usage",
                      "Feature name here",
                      "Feature name here",
                      "Feature name here",
                    ].map((feature, index) => (
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
    </div>
  );
};

export function Pricing() {
  const hobbyFeatures = [
    "Free to Hobby Usage",
    "Feature name here",
    "Feature name here",
    "Feature name here",
  ];

  const basicFeatures = [
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
  ];

  const proFeatures = [
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
    "Feature name here",
  ];

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
            <PricingCard
              title="Hobby"
              features={hobbyFeatures}
              buttonText="Start for free"
            />
            <PricingCard
              title="Basic"
              price="$5"
              priceUnit="/user"
              features={basicFeatures}
              buttonText="Get started"
              isPopular={true}
            />
            <PricingCard
              title="Pro"
              price="$9"
              priceUnit="/user"
              features={proFeatures}
              buttonText="Get started"
            />
          </div>

          {/* Enterprise plan */}
          <EnterprisePlan />
        </div>
      </div>
    </Section>
  );
}
