import React, { useState } from "react";
import { 
  useAdminListStories, 
  useAdminCreateStory, 
  useAdminUpdateStory, 
  useAdminDeleteStory,
  getAdminListStoriesQueryKey,
  getListStoriesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StoryInput, Story } from "@workspace/api-client-react";
import { FileUploadField } from "./FileUploadField";
import { publicUrlForObject } from "@/lib/upload";

export function AdminStoriesTab() {
  const { data: stories, isLoading } = useAdminListStories();
  const createStory = useAdminCreateStory();
  const updateStory = useAdminUpdateStory();
  const deleteStory = useAdminDeleteStory();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<StoryInput>({
    title: "", description: "", photoUrl: ""
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getAdminListStoriesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListStoriesQueryKey() });
  };

  const openCreate = () => {
    setEditingStory(null);
    setFormData({ title: "", description: "", photoUrl: "" });
    setDialogOpen(true);
  };

  const openEdit = (story: Story) => {
    setEditingStory(story);
    setFormData({ title: story.title, description: story.description, photoUrl: story.photoUrl });
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStory) {
      updateStory.mutate(
        { id: editingStory.id, data: formData },
        {
          onSuccess: () => {
            invalidate();
            setDialogOpen(false);
            toast({ title: "Успешно", description: "История обновлена" });
          }
        }
      );
    } else {
      createStory.mutate(
        { data: formData },
        {
          onSuccess: () => {
            invalidate();
            setDialogOpen(false);
            toast({ title: "Успешно", description: "История добавлена" });
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteStory.mutate(
        { id: deletingId },
        {
          onSuccess: () => {
            invalidate();
            setDeleteOpen(false);
            toast({ title: "Успешно", description: "История удалена" });
          }
        }
      );
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-medium">Истории спасённых</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16}/> Добавить историю</Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Заголовок</TableHead>
              <TableHead className="w-1/2">Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories?.map((story) => (
              <TableRow key={story.id}>
                <TableCell>
                  <img src={publicUrlForObject(story.photoUrl) || "/child-placeholder.png"} alt={story.title} className="w-12 h-12 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{story.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm line-clamp-2">{story.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(story)}><Pencil size={16} /></Button>
                  <Button variant="ghost" size="icon" onClick={() => openDelete(story.id)} className="text-destructive"><Trash2 size={16} /></Button>
                </TableCell>
              </TableRow>
            ))}
            {(!stories || stories.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Нет историй</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingStory ? "Редактировать историю" : "Добавить историю"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Заголовок (Имя)</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Фото</Label>
              <FileUploadField
                value={formData.photoUrl}
                onChange={(p) => setFormData({ ...formData, photoUrl: p })}
                accept="image/*"
                preview="image"
              />
            </div>

            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea required className="min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <Button type="submit" className="w-full" disabled={createStory.isPending || updateStory.isPending}>Сохранить</Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить историю?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие необратимо.
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
