import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "~/src/site-config";

import "./globals.css";
import { Header } from "~/components/Header";
import { cn } from "~/lib/utils";

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
      </body>
    </html>
  );
}
