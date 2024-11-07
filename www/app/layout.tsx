import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "~/components/footer";
import { Header } from "~/components/header";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/src/site-config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      <body className={cn(inter.className, "min-h-screen bg-black text-white")}>
        <Header />
        {children}
        <Footer />
      </body>
      <GoogleAnalytics gaId={siteConfig.gaId} />
    </html>
  );
}
