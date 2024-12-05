import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table";
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
  const [template, error] = await nc.query.templates.getPage(id);
  if (error) return <div>{error.toString()}</div>;
  if (!template) return notFound();

  const _propertyTable: { label: string; value?: string }[] = [
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
            <p className="self-stretch text-white/70 text-sm font-normal font-['Inter'] tracking-tight">
              {template.properties.description}
            </p>
          </div>
          <Button>See preview</Button>
        </div>

        <div className="flex flex-row gap-8 w-full">
          <MainContent
            className="grow w-full max-w-full"
            content={template.content}
          />

          <div className="w-[470px] min-w-[470px] flex-col justify-start items-start gap-8 inline-flex">
            <div className="w-full flex-col justify-start items-start flex gap-3">
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href={template.properties.deploy_with_vercel!}>
                  Deploy with Vercel
                </Link>
              </Button>
              <Button className="w-full justify-start" size="lg" asChild>
                <Link href={template.properties.notion_template!}>
                  Get Notion Template
                </Link>
              </Button>
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
      <div className="flex-col justify-start items-start gap-12 flex">
        <div className="text-white text-5xl font-['Roobert TRIAL'] tracking-wide">
          More templates
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* <TemplateCard /> */}
          {/* <TemplateCard /> */}
        </div>
      </div>
    </div>
  );
}

const LOREM_IPSUM = `
Fugiat qui nulla eu ut cupidatat velit deserunt. Qui irure velit pariatur consectetur. Magna reprehenderit id proident ex consectetur proident non eu. Aute adipisicing labore quis anim minim reprehenderit adipisicing aliquip ut aliqua cillum. Ipsum proident et minim. Esse esse ullamco in aute nisi nisi sint in cupidatat amet.

Ullamco fugiat reprehenderit ex. Excepteur minim sint do non quis non culpa ipsum in consequat laborum culpa culpa in. Ex aliqua minim enim laborum sint amet dolore nostrud occaecat et et aliquip ullamco aliquip. Aliquip ullamco aute culpa elit occaecat pariatur nostrud velit.

Dolore eu dolore fugiat irure Lorem Lorem occaecat deserunt ad deserunt. Enim aliquip nisi minim id. Irure enim ea enim aliquip aliquip et occaecat veniam aliquip culpa mollit. Consectetur dolore nisi esse dolor do sint deserunt veniam irure reprehenderit proident. Est proident deserunt laborum qui quis laborum proident qui sint laboris in. Nulla deserunt nostrud deserunt id duis Lorem enim deserunt commodo amet anim elit nisi quis. Duis eiusmod voluptate laborum. Id culpa duis anim tempor do quis sit pariatur id labore minim sunt magna tempor exercitation.

Sunt excepteur incididunt eiusmod sunt exercitation deserunt duis mollit voluptate proident. Laborum est est anim cupidatat. Laboris ut veniam exercitation. Laboris irure ipsum voluptate dolor anim commodo amet irure voluptate consequat amet. Enim cupidatat et est ex aute adipisicing anim occaecat fugiat amet deserunt eu velit labore amet.

Incididunt non officia deserunt consectetur non anim aliqua eu ut. Occaecat eiusmod reprehenderit pariatur nostrud exercitation aliquip cupidatat voluptate Lorem commodo labore aliqua ut elit. Magna irure amet qui duis ullamco incididunt adipisicing cillum esse do consequat. Voluptate velit quis mollit sunt reprehenderit deserunt est est.

Ipsum ea et cillum ea id dolor deserunt dolore commodo dolore ad et et dolore. Id excepteur occaecat cillum ea velit nulla commodo qui id eu ullamco voluptate ea ipsum non. Proident occaecat officia pariatur sint sit dolor ex labore officia nisi ipsum elit ullamco. Reprehenderit cillum laborum sunt cupidatat culpa aute laboris consequat ipsum esse pariatur nulla deserunt laborum exercitation. Quis sint incididunt aliquip. Commodo est laboris id dolore eu non tempor est laborum reprehenderit deserunt officia.

Eiusmod qui Lorem aliqua. Dolor nulla est et excepteur est. Ex voluptate amet ex et enim enim quis nisi Lorem ad. Magna nulla commodo ipsum. Mollit cillum do aliquip excepteur tempor Lorem amet. Et quis non sint ex.

Adipisicing laboris voluptate commodo do veniam elit. Tempor consectetur pariatur eiusmod ea ut incididunt sit laborum quis aliquip consectetur fugiat Lorem eu. Eiusmod qui aliqua pariatur labore cillum sunt sunt aliqua ex. Laboris tempor consequat deserunt irure ex. Tempor aute officia aliquip minim.

Occaecat nostrud fugiat fugiat occaecat tempor officia do deserunt ex sint. Reprehenderit ipsum nostrud laboris aute anim magna aliquip elit quis non. Veniam laborum exercitation nostrud quis ipsum. Elit quis velit et aute mollit ea et id Lorem. Est non dolor nulla minim aliquip culpa dolore duis nulla exercitation id. Dolore pariatur elit qui aliqua eu voluptate commodo aliquip anim. Occaecat ut incididunt do deserunt esse ad ut est elit consectetur est non tempor ut occaecat. Consectetur dolor deserunt in anim excepteur adipisicing tempor amet laboris cillum qui ut dolore.

Elit tempor ipsum enim amet nostrud in do adipisicing occaecat excepteur cillum occaecat est. Minim aliquip nisi incididunt commodo ut ea magna mollit proident eu minim incididunt proident. Qui anim velit id quis eu laborum ad dolore. Sint elit eu velit ullamco cupidatat pariatur.

Veniam ea sint et sint elit qui officia laboris duis non do. Ad et nulla quis nulla nostrud ad est ipsum incididunt Lorem aliquip do. Dolor eu eu velit dolore est id cillum qui amet proident tempor ex. Exercitation adipisicing occaecat incididunt fugiat nostrud deserunt laborum nostrud sunt fugiat anim qui. Veniam ea aute voluptate esse. Culpa ea consequat Lorem nostrud. Aliquip velit sint veniam magna Lorem proident officia proident nisi ipsum sit duis.

Elit reprehenderit dolor excepteur in laborum incididunt exercitation quis magna. Ad ullamco quis ipsum incididunt do esse. Cupidatat aliqua culpa mollit velit sit aliqua mollit laboris. Et occaecat tempor sunt irure sunt duis aliqua non dolor sunt cillum excepteur proident. Consectetur ex velit duis voluptate quis veniam. Veniam in sit deserunt adipisicing culpa mollit amet nulla ea veniam dolor adipisicing laboris ad. Amet tempor esse enim occaecat et.

Veniam do officia do consectetur excepteur tempor. Deserunt velit magna amet quis consectetur sint aute est sint cillum laborum veniam irure excepteur dolore. Labore nostrud culpa nostrud elit laboris laboris ipsum ullamco. Mollit incididunt ea laboris tempor nisi occaecat aliqua culpa ullamco. Elit amet cupidatat occaecat voluptate mollit do culpa duis aute sit exercitation incididunt mollit do. Adipisicing Lorem enim culpa ipsum.

Commodo duis sit duis laboris. Proident dolore excepteur proident consequat est pariatur ex anim ut mollit adipisicing deserunt commodo cillum proident. Sit voluptate aute irure aute esse ex commodo aliqua aliquip. Dolor id et veniam proident enim labore irure deserunt. Veniam qui eu officia elit ipsum deserunt exercitation sunt eu fugiat cillum voluptate. Excepteur non ullamco in proident tempor incididunt ipsum do nostrud labore laboris.

Labore sunt enim occaecat nostrud magna adipisicing aliqua sunt eu. Veniam consectetur aliqua quis dolor laboris adipisicing in amet aliquip sunt eu. Veniam duis cupidatat qui ut sit laboris ex reprehenderit elit proident irure ad. Qui nisi velit mollit cillum nisi adipisicing esse minim nulla. Proident eiusmod minim non. Ipsum aliqua mollit exercitation nostrud mollit est dolor id eu amet. Magna laborum labore nostrud laborum reprehenderit consectetur qui occaecat incididunt.

Voluptate voluptate commodo amet veniam consectetur et. Velit dolore laborum ea qui consequat laboris proident ipsum voluptate excepteur dolore sunt laboris. Excepteur nisi consectetur non proident sit culpa exercitation est veniam. Tempor sit aute tempor ipsum commodo mollit officia. Fugiat reprehenderit ullamco non magna. Eu adipisicing in ullamco officia eiusmod proident sit ullamco pariatur Lorem excepteur ullamco do ullamco tempor.

Commodo excepteur dolor sint consequat ullamco id nisi proident. Ex incididunt commodo culpa fugiat consequat non do Lorem elit consectetur labore. Ea consequat laborum nulla. Adipisicing minim quis pariatur minim ad elit nostrud aliqua eu aliqua cillum ullamco elit Lorem sit. Tempor esse qui ex consectetur dolor deserunt voluptate excepteur incididunt ex adipisicing amet cupidatat nulla. Occaecat enim laborum magna consequat voluptate proident incididunt elit non elit mollit ad.

Reprehenderit ad in ex veniam nisi voluptate fugiat tempor duis eiusmod mollit aliqua enim. Excepteur Lorem exercitation ad reprehenderit occaecat mollit occaecat proident Lorem qui occaecat in. Ad mollit culpa nostrud amet tempor ex. Amet nostrud nostrud consequat laboris minim voluptate. Ea consectetur irure irure ad elit deserunt elit eu ea. Cillum culpa ipsum sunt.

Quis aute laboris voluptate magna sunt magna amet pariatur ullamco aute laboris veniam. Reprehenderit consequat ut ullamco incididunt ad et excepteur reprehenderit anim aute id velit. Velit exercitation labore proident sit duis. Cupidatat eiusmod exercitation officia commodo consectetur mollit labore elit.

Eiusmod duis aliqua qui amet amet exercitation velit ad deserunt eu. Est sint et nisi. Et deserunt laboris aliquip. Duis ad Lorem ipsum. Ut quis officia sunt incididunt cupidatat eu deserunt.

`;
