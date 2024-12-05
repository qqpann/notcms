import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";

export function TemplateCard() {
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
