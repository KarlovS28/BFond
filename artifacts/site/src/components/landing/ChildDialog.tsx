import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Child } from "@workspace/api-client-react";
import { formatRub, formatPercent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrackDonationClick, useGetPublicSettings } from "@workspace/api-client-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { UrgentMarquee } from "./UrgentMarquee";

interface ChildDialogProps {
  child: Child | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChildDialog({ child, open, onOpenChange }: ChildDialogProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const trackDonation = useTrackDonationClick();
  const { data: settings } = useGetPublicSettings();
  const [isRequisitesOpen, setIsRequisitesOpen] = useState(false);

  if (!child) return null;

  const handleDonate = () => {
    const finalAmount = amount || (customAmount ? parseInt(customAmount, 10) : null);
    
    trackDonation.mutate({ 
      data: { 
        childId: child.id, 
        amount: finalAmount 
      } 
    });

    if (settings?.donationLink) {
      window.open(settings.donationLink, "_blank");
    }
  };

  const percent = formatPercent(child.collectedSum, child.targetSum);
  const remaining = child.targetSum - child.collectedSum;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card rounded-3xl border-0 shadow-xl max-h-[90vh] overflow-y-auto">
        {child.isUrgent && <UrgentMarquee />}
        
        <div className="grid md:grid-cols-5 h-full">
          <div className="md:col-span-2 h-64 md:h-auto relative">
            <img 
              src={child.photoUrl || "/child-placeholder.png"} 
              alt={`${child.name} ${child.surname}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
            <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
              <h2 className="text-2xl font-serif font-bold">{child.name} {child.surname}</h2>
              <p className="text-sm opacity-90">{child.age} лет • {child.diagnosis}</p>
            </div>
          </div>
          
          <div className="md:col-span-3 p-6 md:p-10 flex flex-col">
            <div className="hidden md:block mb-6">
              <DialogTitle className="text-3xl font-serif font-bold text-foreground">
                {child.name} {child.surname}
              </DialogTitle>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {child.age} лет • {child.diagnosis}
              </p>
            </div>

            <div className="prose prose-sm md:prose-base prose-slate max-w-none mb-8 text-foreground/80 overflow-y-auto pr-2 custom-scrollbar">
              <p className="whitespace-pre-wrap">{child.story}</p>
            </div>

            <div className="mt-auto space-y-6 bg-muted/30 p-6 rounded-2xl">
              <div>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Собрано: {formatRub(child.collectedSum)}</span>
                  <span>Цель: {formatRub(child.targetSum)}</span>
                </div>
                <Progress value={percent} className="h-3 bg-muted" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{percent}%</span>
                  <span>Осталось собрать: {formatRub(remaining > 0 ? remaining : 0)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-center">Сумма пожертвования:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 300, 500, 1000].map((val) => (
                    <Button
                      key={val}
                      type="button"
                      variant={amount === val ? "default" : "outline"}
                      className={`rounded-full ${amount === val ? 'bg-primary text-primary-foreground' : 'bg-white'}`}
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount("");
                      }}
                    >
                      {val} ₽
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Своя сумма, ₽"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount("");
                  }}
                  className="rounded-full text-center bg-white"
                />
                
                <Button 
                  className="w-full rounded-full h-12 text-base shadow-sm hover:shadow-md transition-all" 
                  onClick={handleDonate}
                >
                  Перейти к оплате
                </Button>
              </div>

              {settings?.paymentQrUrl && (
                <div className="pt-4 border-t border-border flex flex-col items-center justify-center">
                  <p className="text-sm font-medium mb-3 text-center">Или отсканируйте QR для оплаты</p>
                  <img src={settings.paymentQrUrl} alt="QR код для оплаты" className="w-32 h-32 rounded-xl" />
                </div>
              )}

              {settings?.requisites && (
                <Collapsible open={isRequisitesOpen} onOpenChange={setIsRequisitesOpen} className="w-full border-t border-border pt-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full flex justify-between items-center rounded-xl">
                      <span className="text-sm font-medium">Реквизиты для юрлиц</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isRequisitesOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-white p-4 rounded-xl border border-border/50 overflow-x-auto">
                      {settings.requisites}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
