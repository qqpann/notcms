import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { cn } from "~/lib/utils";
import { siteConfig } from "~/src/site-config";

import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
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
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteConfig.gaId}');
        `}
      </Script>
    </html>
  );
}
