import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitHelpRequest } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { FormConsentField } from "@/components/legal/FormConsentField";

export function HelpRequestForm({ fullHeight = true }: { fullHeight?: boolean }) {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [targetSum, setTargetSum] = useState("");
  const [parentContacts, setParentContacts] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  const submit = useSubmitHelpRequest();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { 
        data: { 
          childName, 
          age: parseInt(age, 10), 
          diagnosis, 
          targetSum: parseInt(targetSum, 10), 
          parentContacts,
          consentAccepted,
        } 
      },
      {
        onSuccess: () => {
          toast({ title: "Заявка отправлена", description: "Мы рассмотрим её в течение 3 рабочих дней." });
          setChildName(""); setAge(""); setDiagnosis(""); setTargetSum(""); setParentContacts(""); setConsentAccepted(false);
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Проверьте правильность заполнения полей", variant: "destructive" });
        }
      }
    );
  };

  return (
    <section id="help-request" className={`flex items-center py-6 ${fullHeight ? "min-h-[calc(100dvh-5rem)] md:py-16" : "h-full"}`}>
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Вам нужна помощь?
          </h2>
          <p className="text-lg text-muted-foreground">
            Если ваш ребёнок тяжело болен и вам нужна поддержка, заполните предварительную заявку.
          </p>
        </div>

        <Card className="rounded-3xl border border-white/70 bg-white/72 p-7 shadow-[0_24px_80px_-46px_rgba(120,89,59,0.4)] backdrop-blur-md md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Имя и фамилия ребёнка</Label>
                <Input required value={childName} onChange={e => setChildName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Возраст (полных лет)</Label>
                <Input required type="number" min="0" max="18" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Точный диагноз</Label>
                <Input required value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Необходимая сумма (₽)</Label>
                <Input required type="number" min="1" value={targetSum} onChange={e => setTargetSum(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Контакты родителей (ФИО, телефон, email)</Label>
              <Textarea required value={parentContacts} onChange={e => setParentContacts(e.target.value)} className="resize-none" />
            </div>

            <FormConsentField
              checked={consentAccepted}
              onCheckedChange={setConsentAccepted}
              variant="child"
            />

            <Button type="submit" className="w-full md:w-auto md:px-12 rounded-full h-12 text-base" disabled={submit.isPending || !consentAccepted}>
              {submit.isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
