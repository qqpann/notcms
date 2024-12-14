import { Button } from "~/components/ui/button";
import { Link } from "~/src/i18n/routing";
import { routes } from "~/src/routes";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <span>404</span>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button className="mt-4" asChild>
        <Link href={routes.home}>Return Home</Link>
      </Button>
    </div>
  );
}
