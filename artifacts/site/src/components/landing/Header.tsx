import React from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";
import { publicUrlForObject } from "@/lib/upload";

export function Header() {
  const { data: settings } = useGetPublicSettings();

  const logoUrl = publicUrlForObject(settings?.logoUrl);
  const orgName = settings?.orgName || "Мечты добрых сердец";
  const scrollRoot = () => document.getElementById("landing-scroll-root");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.68))] backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div
          className="flex cursor-pointer items-center"
          onClick={() => scrollRoot()?.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={orgName}
              style={{ height: `${Math.max(settings?.logoSize || 40, 54)}px` }}
              className="object-contain"
            />
          ) : (
            <span className="font-serif text-2xl font-bold text-primary md:text-3xl">{orgName}</span>
          )}
        </div>
        
        <nav className="hidden items-center gap-7 text-base font-medium text-muted-foreground md:flex">
          <button onClick={() => scrollTo("about")} className="hover:text-primary transition-colors">О фонде</button>
          <button onClick={() => scrollTo("children")} className="hover:text-primary transition-colors">Кому помочь</button>
          <button onClick={() => scrollTo("help")} className="hover:text-primary transition-colors">Как помочь</button>
          <button onClick={() => scrollTo("reports")} className="hover:text-primary transition-colors">Отчёты</button>
          <button onClick={() => scrollTo("contacts")} className="hover:text-primary transition-colors">Контакты</button>
        </nav>

        <button 
          onClick={() => scrollTo("children")}
          className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          Пожертвовать
        </button>
      </div>
    </header>
  );
}
