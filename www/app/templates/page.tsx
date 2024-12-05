import { TemplateCard } from "./_components/template-card";

export default function Page() {
  return (
    <div className="mx-auto px-32 py-16 flex flex-col justify-start items-center gap-16">
      <div className="self-stretch text-center text-white text-5xl font-['Roobert TRIAL']">
        Find what you need
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <TemplateCard />
      </div>
    </div>
  );
}
