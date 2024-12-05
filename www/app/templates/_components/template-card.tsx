import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { nc } from "~/src/notcms/schema";
import { routes } from "~/src/routes";

type Template = (typeof nc.query.templates.$inferPages)[number];

type TemplateCardProps = {
  template: Template;
};
export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="p-4 pb-5">
      <Image
        className="h-[400px] object-cover rounded-xl border border-black/10 mb-5"
        src={template.properties.images?.[0] ?? "/img/404.png"}
        alt={`Preview of ${template.title}`}
        width={350}
        height={400}
      />

      <CardTitle className="mb-4 text-xl leading-none">
        {template.title}
      </CardTitle>
      <CardDescription className="mb-6 text-xs leading-none">
        {template.properties.description}
      </CardDescription>

      <div className="grid grid-cols-2 gap-[10px]">
        <Button asChild>
          <Link href={`/templates/${template.id}`}>Get started</Link>
        </Button>
        <Button asChild>
          <Link href={template.properties.preview!}>Preview</Link>
        </Button>
      </div>
    </Card>
  );
}
