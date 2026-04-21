import React, { useState } from "react";
import { useGetPublicSettings, useListChildren, useTrackDonationClick } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Heart, Users, PackageOpen } from "lucide-react";
import { VolunteerDialog } from "./VolunteerDialog";
import { MaterialHelpDialog } from "./MaterialHelpDialog";

export function HowToHelp() {
  const { data: settings } = useGetPublicSettings();
  const { data: children } = useListChildren();
  const trackDonation = useTrackDonationClick();
  
  const [volOpen, setVolOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);

  const handleDonate = () => {
    if (children && children.length > 0) {
      trackDonation.mutate({ data: { childId: children[0].id } });
    }
    if (settings?.donationLink) {
      window.open(settings.donationLink, "_blank");
    }
  };

  return (
    <section id="help" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Как помочь
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Любая ваша помощь бесценна. Выберите удобный для вас способ поддержать подопечных фонда.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-4">Пожертвовать</h3>
            <p className="text-muted-foreground text-sm mb-8 flex-grow">
              Финансовая поддержка позволяет нам оперативно оплачивать лечение, лекарства и реабилитацию.
            </p>
            <div className="w-full space-y-4 mt-auto">
              <Button className="w-full rounded-full h-12" onClick={handleDonate}>
                Перейти к пожертвованию
              </Button>
              {settings?.requisites && (
                <Collapsible open={reqOpen} onOpenChange={setReqOpen} className="w-full text-left">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between rounded-xl">
                      <span>Реквизиты фонда</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${reqOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-xl overflow-x-auto">
                      {settings.requisites}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center">
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
          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center">
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
