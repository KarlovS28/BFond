import React, { useState } from "react";
import { 
  useAdminListReports, 
  useAdminCreateReport, 
  useAdminDeleteReport,
  getAdminListReportsQueryKey,
  getListReportsQueryKey,
  getListArchiveReportsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";
import { ReportInput, Report } from "@workspace/api-client-react";
import { FileUploadField } from "./FileUploadField";
import { publicUrlForObject } from "@/lib/upload";

export function AdminReportsTab() {
  const { data: reports, isLoading } = useAdminListReports();
  const createReport = useAdminCreateReport();
  const deleteReport = useAdminDeleteReport();
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ReportInput>({
    title: "", fileUrl: ""
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getAdminListReportsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListReportsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListArchiveReportsQueryKey() });
  };

  const openCreate = () => {
    setFormData({ title: "", fileUrl: "" });
    setDialogOpen(true);
  };

  const openDelete = (id: number) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createReport.mutate(
      { data: formData },
      {
        onSuccess: () => {
          invalidate();
          setDialogOpen(false);
          toast({ title: "Успешно", description: "Отчёт добавлен" });
        }
      }
    );
  };

  const handleDelete = () => {
    if (deletingId) {
      deleteReport.mutate(
        { id: deletingId },
        {
          onSuccess: () => {
            invalidate();
            setDeleteOpen(false);
            toast({ title: "Успешно", description: "Отчёт удалён" });
          }
        }
      );
    }
  };

  if (isLoading) return <div>Загрузка...</div>;

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const recentReports = reports?.filter(r => new Date(r.createdAt) >= oneWeekAgo) || [];
  const archiveReports = reports?.filter(r => new Date(r.createdAt) < oneWeekAgo) || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-serif font-medium">Отчёты</h2>
        <Button onClick={openCreate} className="gap-2"><Plus size={16}/> Добавить отчёт</Button>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">За эту неделю</h3>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Дата загрузки</TableHead>
                <TableHead>Файл</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <a href={publicUrlForObject(report.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <Download size={14} /> Скачать
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDelete(report.id)} className="text-destructive"><Trash2 size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {recentReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Нет новых отчётов</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-muted-foreground">Архив</h3>
        <div className="bg-white rounded-xl border border-border overflow-hidden opacity-80">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Дата загрузки</TableHead>
                <TableHead>Файл</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archiveReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell>
                    <a href={publicUrlForObject(report.fileUrl)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <Download size={14} /> Скачать
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDelete(report.id)} className="text-destructive"><Trash2 size={16} /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {archiveReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">Архив пуст</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить отчёт</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Название (например: Отчёт за май 2024)</Label>
              <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Файл отчёта (PDF)</Label>
              <FileUploadField
                value={formData.fileUrl}
                onChange={(p) => setFormData({ ...formData, fileUrl: p })}
                accept="application/pdf,.pdf"
                preview="file"
                required
                hint="Прикрепите PDF-файл отчёта"
              />
            </div>

            <Button type="submit" className="w-full" disabled={createReport.isPending || !formData.fileUrl}>Добавить</Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить отчёт?</AlertDialogTitle>
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
