import React, { useState } from "react";
import { 
  useAdminListChildren, 
  useAdminCreateChild, 
  useAdminUpdateChild, 
  useAdminDeleteChild,
  getAdminListChildrenQueryKey,
  getListChildrenQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatRub } from "@/lib/format";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ChildInput, Child } from "@workspace/api-client-react";
import { FileUploadField } from "./FileUploadField";
import { Label as LabelComp } from "@/components/ui/label";

export function AdminChildrenTab() {
  const { data: children, isLoading } = useAdminListChildren();
  const createChild = useAdminCreateChild();
  const updateChild = useAdminUpdateChild();
  const deleteChild = useAdminDeleteChild();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ChildInput>({
    name: "", surname: "", age: 0, diagnosis: "", story: "", photoUrl: "", targetSum: 0, collectedSum: 0, isActive: true, isUrgent: false
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getAdminListChildrenQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListChildrenQueryKey() });
  };

  const openCreate = () => {
    setEditingChild(null);
    setFormData({ name: "", surname: "", age: 0, diagnosis: "", story: "", photoUrl: "", targetSum: 0, collectedSum: 0, isActive: true, isUrgent: false });
    setDialogOpen(true);
  };

  const openEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({ ...child });
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingChild) {
      updateChild.mutate(
        { id: editingChild.id, data: formData },
        {
          onSuccess: () => {
            invalidate();
            setDialogOpen(false);
            toast({ title: "Успешно", description: "Данные обновлены" });
          }
        }
      );
    } else {
      createChild.mutate(
        { data: formData },
        {
          onSuccess: () => {
            invalidate();
            setDialogOpen(false);
            toast({ title: "Успешно", description: "Ребёнок добавлен" });
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteChild.mutate(
        { id: deletingId },
        {
          onSuccess: () => {
            invalidate();
            setDeleteOpen(false);
            toast({ title: "Успешно", description: "Запись удалена" });
          }
        }
      );
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-medium">Управление подопечными</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16}/> Добавить ребёнка</Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Имя</TableHead>
              <TableHead>Возраст / Диагноз</TableHead>
              <TableHead>Сбор</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {children?.map((child) => (
              <TableRow key={child.id}>
                <TableCell className="font-medium">{child.name} {child.surname}</TableCell>
                <TableCell>{child.age} лет, {child.diagnosis}</TableCell>
                <TableCell>
                  <div className="text-sm">Собрано: {formatRub(child.collectedSum)}</div>
                  <div className="text-xs text-muted-foreground">Цель: {formatRub(child.targetSum)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {child.isActive ? <span className="text-green-600 text-xs font-medium">Активен</span> : <span className="text-muted-foreground text-xs">Завершен</span>}
                    {child.isUrgent && <span className="text-destructive text-xs font-bold">Срочно</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(child)}><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openDelete(child.id)} className="text-destructive"><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingChild ? "Редактировать запись" : "Добавить ребёнка"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Имя</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Фамилия</Label>
                <Input required value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Возраст</Label>
                <Input required type="number" min="0" value={formData.age} onChange={e => setFormData({...formData, age: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Диагноз</Label>
                <Input required value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Целевая сумма (₽)</Label>
                <Input required type="number" min="1" value={formData.targetSum} onChange={e => setFormData({...formData, targetSum: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Собрано (₽)</Label>
                <Input required type="number" min="0" value={formData.collectedSum} onChange={e => setFormData({...formData, collectedSum: Number(e.target.value)})} />
              </div>
            </div>
            
            <div className="space-y-2">
              <LabelComp>Фото ребёнка</LabelComp>
              <FileUploadField
                value={formData.photoUrl}
                onChange={(p) => setFormData({ ...formData, photoUrl: p })}
                accept="image/*"
                preview="image"
                hint="Загрузите фотографию (JPG, PNG)"
              />
            </div>

            <div className="space-y-2">
              <Label>История</Label>
              <Textarea required className="min-h-[150px]" value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} />
            </div>

            <div className="flex gap-6 pt-2 border-t border-border">
              <div className="flex items-center space-x-2">
                <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} />
                <Label htmlFor="isActive">Сбор активен</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isUrgent" checked={formData.isUrgent} onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked})} />
                <Label htmlFor="isUrgent" className="text-destructive font-medium">Срочный сбор</Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createChild.isPending || updateChild.isPending}>Сохранить</Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо. Вы уверены, что хотите удалить карточку подопечного?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
