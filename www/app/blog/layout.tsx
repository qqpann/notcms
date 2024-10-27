import { Header } from "~/components/Header";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container max-w-[1440px] px-32 mx-auto py-8">
        {children}
      </div>
    </div>
  );
}
