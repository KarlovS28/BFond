import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Child } from "@workspace/api-client-react";
import { formatRub, formatPercent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTrackDonationClick, useGetPublicSettings } from "@workspace/api-client-react";
import { ExternalLink } from "lucide-react";
import { UrgentMarquee } from "./UrgentMarquee";
import { publicUrlForObject } from "@/lib/upload";

interface ChildDialogProps {
  child: Child | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChildDialog({ child, open, onOpenChange }: ChildDialogProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMenuOpen, setPaymentMenuOpen] = useState(false);
  const trackDonation = useTrackDonationClick();
  const { data: settings } = useGetPublicSettings();

  if (!child) return null;

  const handleOpenPaymentMenu = () => {
    const finalAmount = amount || (customAmount ? parseInt(customAmount, 10) : null);
    trackDonation.mutate({
      data: {
        childId: child.id,
        amount: finalAmount,
      },
    });
    setPaymentMenuOpen(true);
  };

  const percent = formatPercent(child.collectedSum, child.targetSum);
  const remaining = child.targetSum - child.collectedSum;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setPaymentMenuOpen(false);
      }}
    >
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card rounded-3xl border-0 shadow-xl max-h-[90vh] overflow-y-auto">
        {child.isUrgent && <UrgentMarquee />}

        <div className="grid md:grid-cols-5 h-full">
          <div className="relative h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),_rgba(247,238,229,0.94)_55%,_rgba(239,224,207,0.9)_100%)] md:col-span-2 md:h-auto">
            <img
              src={publicUrlForObject(child.photoUrl) || "/child-placeholder.png"}
              alt={`${child.name} ${child.surname}`}
              className="h-full w-full object-contain p-4 md:p-6"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/25 md:hidden"></div>
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

              {!paymentMenuOpen ? (
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
                    onClick={handleOpenPaymentMenu}
                  >
                    Перейти к пожертвованию
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  <h4 className="text-base font-serif font-bold text-center">Способы оплаты</h4>

                  {settings?.paymentQrUrl && (
                    <div className="flex flex-col items-center bg-white rounded-2xl p-5 border border-border">
                      <p className="text-sm font-medium mb-3 text-center">Отсканируйте QR-код</p>
                      <img
                        src={publicUrlForObject(settings.paymentQrUrl)}
                        alt="QR код для оплаты"
                        className="w-44 h-44 rounded-xl object-contain"
                      />
                    </div>
                  )}

                  {settings?.requisites && (
                    <div className="bg-white rounded-2xl p-5 border border-border">
                      <p className="text-sm font-medium mb-3">Реквизиты для перевода</p>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words font-mono">
                        {settings.requisites}
                      </pre>
                    </div>
                  )}

                  {settings?.donationLink && (
                    <Button
                      className="w-full rounded-full h-12 gap-2"
                      onClick={() => window.open(settings.donationLink, "_blank")}
                    >
                      Пожертвовать
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full rounded-full"
                    onClick={() => setPaymentMenuOpen(false)}
                  >
                    Назад
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
