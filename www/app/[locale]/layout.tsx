import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { cn } from "~/lib/utils";
import { roobert } from "~/src/fonts/Roobert";
import { routing } from "~/src/i18n/routing";
import { siteConfig } from "~/src/site-config";

import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
  metadataBase: new URL(siteConfig.baseUrl),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={cn(
          inter.className,
          roobert.variable,
          "min-h-screen bg-black text-white font-['Inter','Inter-Light',Helvetica]"
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId={siteConfig.gaId} />
    </html>
  );
}
