import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { routes } from "~/src/routes";

type Plan = {
  title: string;
  price: number;
  actionTitle?: string;
  features: string[];
};
const plans: Plan[] = [
  {
    title: "Hobby",
    price: 0,
    features: ["Unprofitable projects"],
  },
  {
    title: "Pro",
    price: 9,
    actionTitle: "Coming soon",
    features: ["Profitable projects"],
  },
  {
    title: "Enterprise",
    price: 39,
    actionTitle: "Coming soon",
    features: ["Profitable projects & Companies"],
  },
];

export default function PricingPage() {
  return (
    <main className="container max-w-[1440px] px-32 mx-auto py-8">
      <div className="flex flex-col w-full mb-8 items-start gap-5 flex-[0_0_auto]">
        <h2 className="self-stretch mt-[-1.00px] font-Roobert [font-family:'Roobert','Selecta_VF_Trial-Regular',Helvetica] font-normal text-white text-5xl tracking-[0.48px] leading-[normal]">
          Choose the right plan for yourself
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-[200px]">
        <PlanCard plan={plans[0]} />
        <PlanCard plan={plans[1]} />
        <PlanCard plan={plans[2]} />
      </div>
    </main>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Card className="p-2 rounded-3xl flex-col items-start gap-4 inline-flex">
      <div className="self-stretch flex-col justify-start items-center gap-4 p-4 flex">
        <div className="self-stretch text-white text-xl font-normal leading-none tracking-tight">
          {plan.title}
        </div>
        <div className="self-stretch">
          <span className="text-white text-[32px] font-medium leading-none tracking-tight mr-1">
            ${plan.price}
          </span>
          <span className="text-white text-xl font-normal leading-none tracking-tight">
            /month
          </span>
        </div>
        <Button className="w-full">
          <a href={routes.dashboard}>{plan.actionTitle || "Get started"}</a>
        </Button>
      </div>

      <Card className="self-stretch px-4 pt-5 pb-4 rounded-t-[10px] rounded-b-2xl shadow-inner border-silver flex-col justify-start items-start gap-4 flex">
        {plan.features.map((feature) => (
          <div
            key={feature}
            className="self-stretch text-white/70 text-base font-normal leading-none tracking-tight"
          >
            {feature}
          </div>
        ))}
      </Card>
    </Card>
  );
}
