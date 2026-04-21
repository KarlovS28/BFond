import React, { useState, useEffect } from "react";
import { 
  useAdminGetSettings, 
  useAdminUpdateSettings,
  getAdminGetSettingsQueryKey,
  getGetPublicSettingsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SettingsInput } from "@workspace/api-client-react";
import { Trash2, Plus } from "lucide-react";

export function AdminSettingsTab() {
  const { data: settings, isLoading } = useAdminGetSettings();
  const updateSettings = useAdminUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<SettingsInput | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings as SettingsInput);
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    updateSettings.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminGetSettingsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPublicSettingsQueryKey() });
          toast({ title: "Успешно", description: "Настройки сохранены" });
        },
        onError: () => {
          toast({ title: "Ошибка", description: "Не удалось сохранить настройки", variant: "destructive" });
        }
      }
    );
  };

  const addDocument = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      documents: [...(formData.documents || []), { title: "", url: "" }]
    });
  };

  const removeDocument = (index: number) => {
    if (!formData) return;
    const newDocs = [...(formData.documents || [])];
    newDocs.splice(index, 1);
    setFormData({ ...formData, documents: newDocs });
  };

  const updateDocument = (index: number, field: "title" | "url", value: string) => {
    if (!formData) return;
    const newDocs = [...(formData.documents || [])];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setFormData({ ...formData, documents: newDocs });
  };

  if (isLoading || !formData) return <div>Загрузка...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-medium">Настройки сайта</h2>
        <Button type="submit" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium text-lg">Организация</h3>
            <div className="space-y-2">
              <Label>Название фонда</Label>
              <Input value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Слоган</Label>
              <Input value={formData.slogan} onChange={e => setFormData({...formData, slogan: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Миссия (О фонде)</Label>
              <Textarea className="min-h-[100px]" value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Юридический адрес</Label>
              <Input value={formData.legalAddress} onChange={e => setFormData({...formData, legalAddress: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium text-lg">Логотип</h3>
            <div className="space-y-2">
              <Label>URL логотипа</Label>
              <Input value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Размер логотипа (высота в px)</Label>
              <Input type="number" min="20" max="200" value={formData.logoSize} onChange={e => setFormData({...formData, logoSize: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium text-lg">Платежи</h3>
            <div className="space-y-2">
              <Label>Ссылка на оплату (CloudPayments, ЮKassa и т.д.)</Label>
              <Input value={formData.donationLink} onChange={e => setFormData({...formData, donationLink: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>URL картинки QR-кода</Label>
              <Input value={formData.paymentQrUrl} onChange={e => setFormData({...formData, paymentQrUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Реквизиты</Label>
              <Textarea className="min-h-[150px] font-mono text-sm" value={formData.requisites} onChange={e => setFormData({...formData, requisites: e.target.value})} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium text-lg">Социальные сети (Ссылки)</h3>
            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input value={formData.socials.telegram || ""} onChange={e => setFormData({...formData, socials: {...formData.socials, telegram: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>ВКонтакте</Label>
              <Input value={formData.socials.vk || ""} onChange={e => setFormData({...formData, socials: {...formData.socials, vk: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input value={formData.socials.whatsapp || ""} onChange={e => setFormData({...formData, socials: {...formData.socials, whatsapp: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input value={formData.socials.instagram || ""} onChange={e => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <Label>MAX</Label>
              <Input value={formData.socials.max || ""} onChange={e => setFormData({...formData, socials: {...formData.socials, max: e.target.value}})} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Учредительные документы</h3>
          <Button type="button" variant="outline" size="sm" onClick={addDocument} className="gap-2">
            <Plus size={14} /> Добавить документ
          </Button>
        </div>
        <div className="space-y-3">
          {formData.documents?.map((doc: { title: string; url: string }, idx: number) => (
            <div key={idx} className="flex gap-4 items-start bg-muted/30 p-3 rounded-lg">
              <div className="flex-1 space-y-2">
                <Input placeholder="Название (например: Устав фонда)" value={doc.title} onChange={e => updateDocument(idx, "title", e.target.value)} required />
              </div>
              <div className="flex-1 space-y-2">
                <Input placeholder="URL документа" value={doc.url} onChange={e => updateDocument(idx, "url", e.target.value)} required />
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-destructive mt-1" onClick={() => removeDocument(idx)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
          {(!formData.documents || formData.documents.length === 0) && (
            <p className="text-muted-foreground text-sm py-4 text-center">Нет прикрепленных документов</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Сохранение..." : "Сохранить настройки"}
        </Button>
      </div>
    </form>
  );
}
