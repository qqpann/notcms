import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Page() {
  return (
    <div className="mx-auto px-32 py-16 flex flex-col justify-start items-center gap-16">
      <div className="self-stretch text-center text-white text-5xl font-['Roobert TRIAL']">
        Find what you need
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TemplateCard />
      </div>
    </div>
  );
}

function TemplateCard() {
  return (
    <Card className="p-4 pb-5">
      <img
        className="h-[400px] rounded-xl border border-black/10 mb-5"
        src="https://via.placeholder.com/349x400"
      />

      <CardTitle className="mb-4 text-xl leading-none">Website blog</CardTitle>
      <CardDescription className="mb-6 text-xs leading-none">
        Set up your own blog using this template.
      </CardDescription>

      <div className="grid grid-cols-2 gap-[10px]">
        <Button>Get started</Button>
        <Button>Preview</Button>
      </div>
    </Card>
  );
}
