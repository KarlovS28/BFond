import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubmitVolunteer } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface VolunteerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VolunteerDialog({ open, onOpenChange }: VolunteerDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [helpType, setHelpType] = useState("");
  
  const submit = useSubmitVolunteer();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { data: { name, phone, email, city, helpType } },
      {
        onSuccess: () => {
          toast({ title: "Успешно", description: "Спасибо! Мы свяжемся с вами." });
          onOpenChange(false);
          setName(""); setPhone(""); setEmail(""); setCity(""); setHelpType("");
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось отправить заявку", variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Стать волонтёром</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Ваше имя</Label>
            <Input required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Телефон</Label>
            <Input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Город</Label>
            <Input required value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Чем вы можете помочь?</Label>
            <Textarea required value={helpType} onChange={e => setHelpType(e.target.value)} className="resize-none" />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={submit.isPending}>
            {submit.isPending ? "Отправка..." : "Отправить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
