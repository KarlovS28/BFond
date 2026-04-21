import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitHelpRequest } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function HelpRequestForm() {
  const [childName, setChildName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [targetSum, setTargetSum] = useState("");
  const [parentContacts, setParentContacts] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

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
          photoUrl: photoUrl || undefined
        } 
      },
      {
        onSuccess: () => {
          toast({ title: "Заявка отправлена", description: "Мы рассмотрим её в течение 3 рабочих дней." });
          setChildName(""); setAge(""); setDiagnosis(""); setTargetSum(""); setParentContacts(""); setPhotoUrl("");
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Проверьте правильность заполнения полей", variant: "destructive" });
        }
      }
    );
  };

  return (
    <section id="help-request" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Вам нужна помощь?
          </h2>
          <p className="text-lg text-muted-foreground">
            Если ваш ребёнок тяжело болен и вам нужна поддержка, заполните предварительную заявку.
          </p>
        </div>

        <Card className="p-8 md:p-10 rounded-3xl bg-background/50 border border-border shadow-sm">
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

            <div className="space-y-2">
              <Label>Ссылка на фото (опционально, Яндекс.Диск / Google Drive)</Label>
              <Input value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." />
            </div>

            <Button type="submit" className="w-full md:w-auto md:px-12 rounded-full h-12 text-base" disabled={submit.isPending}>
              {submit.isPending ? "Отправка..." : "Отправить заявку"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
