import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { cn } from "~/lib/utils";
import { roobert } from "~/src/fonts/Roobert";
import { siteConfig } from "~/src/site-config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
  metadataBase: new URL(siteConfig.baseUrl),
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          roobert.variable,
          "min-h-screen bg-black text-white font-['Inter','Inter-Light',Helvetica]"
        )}
      >
        <Header />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId={siteConfig.gaId} />
    </html>
  );
}
