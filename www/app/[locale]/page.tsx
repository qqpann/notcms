import { redirect } from "~/src/i18n/routing";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

export default function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale === "ja" ? "ja" : "en";

  // TODO: Redirect to dashboard if user is logged in
  return redirect({ href: routes.home, locale });
}
