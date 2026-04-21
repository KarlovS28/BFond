import React from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";

export function Header() {
  const { data: settings } = useGetPublicSettings();

  const logoUrl = settings?.logoUrl || "/generated-logo.png";
  const orgName = settings?.orgName || "Мечты добрых сердец";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img 
            src={logoUrl} 
            alt={orgName} 
            style={{ height: `${settings?.logoSize || 40}px` }}
            className="object-contain"
          />
          <span className="font-serif font-bold text-xl hidden sm:inline-block text-foreground">
            {orgName}
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <button onClick={() => scrollTo("about")} className="hover:text-primary transition-colors">О фонде</button>
          <button onClick={() => scrollTo("children")} className="hover:text-primary transition-colors">Кому помочь</button>
          <button onClick={() => scrollTo("help")} className="hover:text-primary transition-colors">Как помочь</button>
          <button onClick={() => scrollTo("reports")} className="hover:text-primary transition-colors">Отчёты</button>
          <button onClick={() => scrollTo("contacts")} className="hover:text-primary transition-colors">Контакты</button>
        </nav>

        <button 
          onClick={() => scrollTo("children")}
          className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm shadow-sm"
        >
          Пожертвовать
        </button>
      </div>
    </header>
  );
}
