import { redirect } from "next/navigation";
import { routes } from "~/src/routes";
import { siteConfig } from "~/src/site-config";

export default function Home() {
  // TODO: Redirect to dashboard if user is logged in
  return redirect(routes.home);
}
