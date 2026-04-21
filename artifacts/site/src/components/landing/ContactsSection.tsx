import React, { useState } from "react";
import { useGetPublicSettings, useSubmitContact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaTelegram, FaVk, FaWhatsapp, FaInstagram } from "react-icons/fa6";

export function ContactsSection() {
  const { data: settings } = useGetPublicSettings();
  const submit = useSubmitContact();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { data: { name, email, message } },
      {
        onSuccess: () => {
          toast({ title: "Сообщение отправлено", description: "Мы ответим вам в ближайшее время." });
          setName(""); setEmail(""); setMessage("");
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось отправить сообщение", variant: "destructive" });
        }
      }
    );
  };

  if (!settings) return null;

  return (
    <section id="contacts" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Контакты
          </h2>
          <p className="text-lg text-muted-foreground">
            Свяжитесь с нами, если у вас есть вопросы или предложения.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Телефон</p>
                  <a href={`tel:${settings.phone}`} className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${settings.email}`} className="text-xl font-medium text-foreground hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Адрес</p>
                  <p className="text-lg font-medium text-foreground">
                    {settings.legalAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-sm text-muted-foreground mb-4">Мы в социальных сетях:</p>
              <div className="flex flex-wrap gap-3">
                {settings.socials?.vk && (
                  <a href={settings.socials.vk} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all">
                    <FaVk size={22} />
                  </a>
                )}
                {settings.socials?.telegram && (
                  <a href={settings.socials.telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all">
                    <FaTelegram size={22} />
                  </a>
                )}
                {settings.socials?.whatsapp && (
                  <a href={settings.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all">
                    <FaWhatsapp size={22} />
                  </a>
                )}
                {settings.socials?.instagram && (
                  <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all">
                    <FaInstagram size={22} />
                  </a>
                )}
                {settings.socials?.max && (
                  <a href={settings.socials.max} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all font-bold text-xs">
                    MAX
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 p-8 rounded-3xl">
            <h3 className="text-2xl font-serif font-bold mb-6">Напишите нам</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Ваше имя</Label>
                <Input required value={name} onChange={e => setName(e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Сообщение</Label>
                <Textarea required value={message} onChange={e => setMessage(e.target.value)} className="bg-white resize-none h-32" />
              </div>
              <Button type="submit" className="w-full rounded-full mt-2" disabled={submit.isPending}>
                {submit.isPending ? "Отправка..." : "Отправить"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
