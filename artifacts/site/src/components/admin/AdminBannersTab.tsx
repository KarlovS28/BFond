import React, { useState } from "react";
import {
  Banner,
  BannerInput,
  useAdminBanners,
  useCreateBanner,
  useDeleteBanner,
  useUpdateBanner,
} from "@/lib/banners";
import { publicUrlForObject } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploadField } from "./FileUploadField";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";

const emptyForm: BannerInput = {
  title: "",
  description: "",
  imageUrl: "",
  linkUrl: "",
  isEnabled: true,
};

export function AdminBannersTab() {
  const { data: banners, isLoading } = useAdminBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BannerInput>(emptyForm);

  const openCreate = () => {
    setEditingBanner(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      isEnabled: banner.isEnabled,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        await updateBanner.mutateAsync({ id: editingBanner.id, data: formData });
      } else {
        await createBanner.mutateAsync(formData);
      }

      setDialogOpen(false);
      toast({
        title: "Успешно",
        description: editingBanner ? "Баннер обновлён" : "Баннер добавлен",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить баннер",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;

    deleteBanner.mutate(deletingId, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ title: "Успешно", description: "Баннер удалён" });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить баннер",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-medium">Банеры</h2>
        <Button onClick={openCreate} className="gap-2" disabled={(banners?.length ?? 0) >= 10}>
          <Plus size={16} /> Добавить баннер
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Баннер</TableHead>
              <TableHead>Текст</TableHead>
              <TableHead>Ссылка</TableHead>
              <TableHead>Вкл / Выкл</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners?.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img
                    src={publicUrlForObject(banner.imageUrl) || "/child-placeholder.png"}
                    alt={banner.title}
                    className="h-16 w-28 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="font-medium">{banner.title}</div>
                  <div className="line-clamp-2 text-sm text-muted-foreground">{banner.description}</div>
                </TableCell>
                <TableCell className="max-w-xs break-all text-sm text-muted-foreground">
                  {banner.linkUrl || "—"}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={banner.isEnabled}
                    onCheckedChange={(checked) =>
                      updateBanner.mutate({
                        id: banner.id,
                        data: {
                          title: banner.title,
                          description: banner.description,
                          imageUrl: banner.imageUrl,
                          linkUrl: banner.linkUrl,
                          isEnabled: checked,
                        },
                      })
                    }
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}><Pencil size={16} /></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      setDeletingId(banner.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!banners || banners.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Пока нет баннеров
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Редактировать баннер" : "Новый баннер"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок</Label>
              <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea required className="min-h-[120px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Прямоугольный баннер</Label>
              <FileUploadField
                value={formData.imageUrl}
                onChange={(path) => setFormData({ ...formData, imageUrl: path })}
                accept="image/*"
                preview="image"
                required
                hint="Лучше использовать широкое горизонтальное изображение"
              />
            </div>
            <div className="space-y-2">
              <Label>Ссылка при клике</Label>
              <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} placeholder="/#children или https://..." />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={formData.isEnabled} onCheckedChange={(checked) => setFormData({ ...formData, isEnabled: checked })} />
              <Label>Включить баннер</Label>
            </div>
            <Button type="submit" className="w-full" disabled={createBanner.isPending || updateBanner.isPending}>
              Сохранить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить баннер?</AlertDialogTitle>
            <AlertDialogDescription>Это действие необратимо.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
