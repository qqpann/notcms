import { nc } from "~/src/notcms/schema";
import { TemplateCard } from "./_components/template-card";

// export const maxDuration = 30;
export const dynamic = "force-dynamic";
export const revalidate = 10;

export default async function Page() {
  let [templates] = await nc.query.templates.listPages();
  templates = templates ?? [];
  templates = templates.filter((template) => template.properties.published);

  return (
    <div className="mx-auto px-32 py-16 flex flex-col justify-start items-center gap-16">
      <div className="self-stretch text-center text-white text-5xl font-['Roobert TRIAL']">
        Find what you need
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
