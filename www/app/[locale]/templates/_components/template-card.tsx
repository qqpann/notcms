import Image from "next/image";
import { Button, CandyButton } from "~/components/ui/button";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Link } from "~/src/i18n/routing";
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
        src={
          template.properties.thumbnails?.[0] ??
          template.properties.images?.[0] ??
          "/img/404.png"
        }
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
        <Link href={`/templates/${template.id}`}>
          <CandyButton className="w-full">Get started</CandyButton>
        </Link>
        <Button asChild>
          <Link
            href={template.properties.preview!}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview
          </Link>
        </Button>
      </div>
    </Card>
  );
}
