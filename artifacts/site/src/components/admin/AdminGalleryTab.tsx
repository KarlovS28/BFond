import React, { useMemo, useState } from "react";
import { useAdminListChildren } from "@workspace/api-client-react";
import {
  GalleryItem,
  GalleryItemInput,
  useAdminGalleryItems,
  useCreateGalleryItem,
  useDeleteGalleryItem,
  useUpdateGalleryItem,
} from "@/lib/gallery";
import { publicUrlForObject } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadField } from "./FileUploadField";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emptyForm: GalleryItemInput = {
  title: "",
  description: "",
  photoUrl: "",
  childId: null,
};

export function AdminGalleryTab() {
  const { data: items, isLoading } = useAdminGalleryItems();
  const { data: children } = useAdminListChildren();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const deleteItem = useDeleteGalleryItem();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<GalleryItemInput>(emptyForm);

  const childOptions = useMemo(() => children ?? [], [children]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      photoUrl: item.photoUrl,
      childId: item.childId,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, data: formData });
      } else {
        await createItem.mutateAsync(formData);
      }

      setDialogOpen(false);
      toast({
        title: "Успешно",
        description: editingItem ? "Карточка обновлена" : "Карточка добавлена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить карточку",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;

    deleteItem.mutate(deletingId, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ title: "Успешно", description: "Карточка удалена" });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: error instanceof Error ? error.message : "Не удалось удалить карточку",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-serif font-medium">Жизнь наших подопечных</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16} /> Добавить карточку</Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Если здесь появляется `404`, просто перезапустите сервер и убедитесь, что выполнили `pnpm --filter @workspace/db run push`.
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead>Раздел</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <img
                    src={publicUrlForObject(item.photoUrl) || "/child-placeholder.png"}
                    alt={item.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.childName || "Наши мероприятия"}</TableCell>
                <TableCell className="max-w-md line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil size={16} /></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      setDeletingId(item.id);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!items || items.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Пока нет карточек галереи
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Редактировать карточку" : "Новая карточка"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Раздел</Label>
                <Select
                  value={formData.childId === null ? "general" : String(formData.childId)}
                  onValueChange={(value) => setFormData({ ...formData, childId: value === "general" ? null : Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите раздел" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Наши мероприятия</SelectItem>
                    {childOptions.map((child) => (
                      <SelectItem key={child.id} value={String(child.id)}>
                        {child.name} {child.surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Фотография</Label>
              <FileUploadField
                value={formData.photoUrl}
                onChange={(path) => setFormData({ ...formData, photoUrl: path })}
                accept="image/*"
                preview="image"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                required
                className="min-h-[140px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full" disabled={createItem.isPending || updateItem.isPending}>
              Сохранить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить карточку?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо.
            </AlertDialogDescription>
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
