import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, PackageOpen } from "lucide-react";
import { VolunteerDialog } from "./VolunteerDialog";
import { MaterialHelpDialog } from "./MaterialHelpDialog";

export function HowToHelp({ fullHeight = true }: { fullHeight?: boolean }) {
  const [volOpen, setVolOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);

  const scrollToChildren = () => {
    const el = document.getElementById("children");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="help" className={`flex items-center py-6 ${fullHeight ? "min-h-[calc(100dvh-5rem)] md:py-16" : "h-full"}`}>
      <div className="mx-auto w-full max-w-[980px] px-2 md:max-w-[1160px] lg:max-w-[1320px] xl:max-w-[1480px]">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Как помочь
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Любая ваша помощь бесценна. Выберите удобный для вас способ поддержать подопечных фонда.
          </p>
        </div>

        <div className={`grid gap-6 ${fullHeight ? "md:grid-cols-3" : "lg:grid-cols-3"}`}>
          {/* Card 1 */}
          <div className="flex min-h-[360px] flex-col items-center rounded-3xl border border-white/70 bg-white/72 p-8 text-center shadow-[0_20px_65px_-44px_rgba(120,89,59,0.4)] backdrop-blur-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4">Пожертвовать</h3>
            <p className="text-muted-foreground text-sm mb-8 flex-grow">
              Финансовая поддержка позволяет нам оперативно оплачивать лечение, лекарства и реабилитацию.
            </p>
            <Button className="w-full rounded-full h-12 mt-auto" onClick={scrollToChildren}>
              Выбрать подопечного
            </Button>
          </div>

          {/* Card 2 */}
          <div className="flex min-h-[360px] flex-col items-center rounded-3xl border border-white/70 bg-white/72 p-8 text-center shadow-[0_20px_65px_-44px_rgba(120,89,59,0.4)] backdrop-blur-md">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-secondary-foreground">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4">Стать волонтёром</h3>
            <p className="text-muted-foreground text-sm mb-8 flex-grow">
              Нам всегда нужны люди, готовые помочь: автоволонтёры, фотографы, юристы и просто неравнодушные.
            </p>
            <Button variant="secondary" className="w-full rounded-full h-12 mt-auto" onClick={() => setVolOpen(true)}>
              Заполнить анкету
            </Button>
          </div>

          {/* Card 3 */}
          <div className="flex min-h-[360px] flex-col items-center rounded-3xl border border-white/70 bg-white/72 p-8 text-center shadow-[0_20px_65px_-44px_rgba(120,89,59,0.4)] backdrop-blur-md">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6 text-accent-foreground">
              <PackageOpen size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4">Передать вещи</h3>
            <p className="text-muted-foreground text-sm mb-8 flex-grow">
              Мы принимаем игрушки, специализированное питание, подгузники и средства гигиены для детей.
            </p>
            <Button variant="outline" className="w-full rounded-full h-12 mt-auto" onClick={() => setMatOpen(true)}>
              Предложить помощь
            </Button>
          </div>
        </div>
      </div>
      
      <VolunteerDialog open={volOpen} onOpenChange={setVolOpen} />
      <MaterialHelpDialog open={matOpen} onOpenChange={setMatOpen} />
    </section>
  );
}
