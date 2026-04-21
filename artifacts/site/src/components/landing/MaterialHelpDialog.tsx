import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSubmitMaterialHelp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface MaterialHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialHelpDialog({ open, onOpenChange }: MaterialHelpDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [items, setItems] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  
  const submit = useSubmitMaterialHelp();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { data: { name, phone, items, preferredDate } },
      {
        onSuccess: () => {
          toast({ title: "Успешно", description: "Спасибо! Мы свяжемся с вами." });
          onOpenChange(false);
          setName(""); setPhone(""); setItems(""); setPreferredDate("");
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
          <DialogTitle className="text-2xl font-serif">Помощь вещами</DialogTitle>
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
            <Label>Что вы хотите передать?</Label>
            <Textarea required value={items} onChange={e => setItems(e.target.value)} className="resize-none" />
          </div>
          <div className="space-y-2">
            <Label>Желаемая дата передачи</Label>
            <Input required type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={submit.isPending}>
            {submit.isPending ? "Отправка..." : "Отправить"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
