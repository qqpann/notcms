import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
import { Link } from "~/src/i18n/routing";
import { nc } from "~/src/notcms/schema";
import { MainContent } from "../_components/main-content";
import { TemplateCard } from "../_components/template-card";

// export const maxDuration = 30;
export const dynamic = "auto";
export const revalidate = 10;

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [template, error] = await nc.query.templates.get(id);
  if (error) return <div>{error.toString()}</div>;
  if (!template) return notFound();

  const _propertyTable: { label: string; value: string | null }[] = [
    { label: "Framework", value: template.properties.framework },
    { label: "Use case", value: template.properties.use_case },
    { label: "CSS", value: template.properties.css },
  ];
  const propertyTable = _propertyTable.filter((x) => x.value!!);

  return (
    <div className="container max-w-[1440px] mx-auto px-32 py-16 space-y-24">
      <div className="self-stretch flex-col justify-start items-start gap-8 flex">
        <div className="self-stretch justify-start items-start gap-8 inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start gap-6 inline-flex">
            <h1 className="text-white text-[32px] font-['Roobert TRIAL'] leading-none">
              {template.title}
            </h1>
            <p className="self-stretch text-white/70 text-sm font-normal tracking-tight">
              {template.properties.description}
            </p>
          </div>
          <Button asChild>
            <Link
              href={template.properties.preview!}
              target="_blank"
              rel="noopener noreferrer"
            >
              See preview
            </Link>
          </Button>
        </div>

        <div className="flex flex-row gap-8 w-full">
          <div className="grow w-full max-w-[calc(1184px-470px-32px)]">
            {template.properties.images && (
              <>
                <div className="flex flex-col gap-5">
                  {template.properties.images.map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={template.title}
                      className="w-full rounded-[16px]"
                    />
                  ))}
                </div>

                <Separator className="my-8 bg-white/20" />
              </>
            )}

            <MainContent
              className="grow w-full max-w-full"
              content={template.content}
            />
          </div>

          <div className="w-[470px] min-w-[470px] flex-col justify-start items-start gap-8 inline-flex">
            <div className="w-full flex-col justify-start items-start flex gap-3">
              {template.properties.deploy_with_vercel && (
                <Button className="w-full justify-start" size="lg" asChild>
                  <Link
                    href={template.properties.deploy_with_vercel!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Deploy with Vercel
                  </Link>
                </Button>
              )}
              {template.properties.notion_template && (
                <Button className="w-full justify-start" size="lg" asChild>
                  <Link
                    href={template.properties.notion_template!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Notion Template
                  </Link>
                </Button>
              )}
            </div>
            <Card
              className="bg-silver self-stretch px-6 py-1 flex-col justify-center items-center gap-4 flex"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.06)",
              }}
            >
              <Table>
                <TableBody>
                  {propertyTable.map((property) => (
                    <TableRow
                      key={property.label}
                      className="border-b-[0.5px] border-white border-opacity-[0.12] last:border-none hover:bg-inherit"
                    >
                      <TableCell className="text-base text-white/70 font-normal h-[52px] p-0">
                        {property.label}
                      </TableCell>
                      <TableCell className="text-right text-base text-white font-normal h-[52px] p-0">
                        {property.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>
      </div>
      {/* <div className="flex-col justify-start items-start gap-12 flex">
        <div className="text-white text-5xl font-['Roobert TRIAL'] tracking-wide">
          More templates
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TemplateCard />
          <TemplateCard />
        </div>
      </div> */}
    </div>
  );
}
