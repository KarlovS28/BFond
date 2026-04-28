import React, { useState } from "react";
import {
  useAdminListSubmissions,
  useAdminArchiveSubmission,
  getAdminListSubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/format";
import { publicUrlForObject } from "@/lib/upload";
import { Check } from "lucide-react";

type SubmissionType = "volunteers" | "materials" | "helpRequests" | "contacts";

function AcceptButton({ type, id }: { type: SubmissionType; id: number }) {
  const archive = useAdminArchiveSubmission();
  const qc = useQueryClient();
  const { toast } = useToast();
  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-1 h-8"
      disabled={archive.isPending}
      onClick={() => {
        archive.mutate(
          { type, id },
          {
            onSuccess: () => {
              qc.invalidateQueries({ queryKey: getAdminListSubmissionsQueryKey() });
              toast({ title: "Заявка принята", description: "Перенесена в архив" });
            },
            onError: () => toast({ title: "Ошибка", description: "Не удалось принять заявку", variant: "destructive" }),
          },
        );
      }}
    >
      <Check size={14} /> Принять
    </Button>
  );
}

export function AdminSubmissionsTab() {
  const { data: subs, isLoading } = useAdminListSubmissions();
  const [showArchived, setShowArchived] = useState(false);

  if (isLoading) return <div>Загрузка...</div>;
  if (!subs) return null;

  const filterRows = <T extends { archived?: boolean | null }>(rows: T[]) =>
    rows.filter((r) => Boolean(r.archived) === showArchived);

  const volunteers = filterRows(subs.volunteers);
  const materials = filterRows(subs.materials);
  const helpRequests = filterRows(subs.helpRequests);
  const contacts = filterRows(subs.contacts);

  const emptyRow = (cols: number) => (
    <TableRow>
      <TableCell colSpan={cols} className="text-center py-4 text-muted-foreground">
        {showArchived ? "В архиве пусто" : "Нет новых заявок"}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h2 className="text-xl font-serif font-medium">
          {showArchived ? "Архив заявок" : "Входящие заявки"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant={showArchived ? "outline" : "default"}
            size="sm"
            onClick={() => setShowArchived(false)}
          >
            Активные
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(true)}
          >
            Архив
          </Button>
        </div>
      </div>

      <Tabs defaultValue="volunteers" className="w-full">
        <TabsList className="mb-4 flex-wrap h-auto">
          <TabsTrigger value="volunteers">Волонтёры ({volunteers.length})</TabsTrigger>
          <TabsTrigger value="materials">Помощь вещами ({materials.length})</TabsTrigger>
          <TabsTrigger value="helpRequests">Заявки о помощи ({helpRequests.length})</TabsTrigger>
          <TabsTrigger value="contacts">Сообщения ({contacts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="volunteers">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Контакты</TableHead>
                  <TableHead>Город</TableHead>
                  <TableHead>Вид помощи</TableHead>
                  <TableHead className="w-32 text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(v.createdAt)}</TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-xs">
                      <div>{v.phone}</div>
                      <div className="text-muted-foreground">{v.email}</div>
                    </TableCell>
                    <TableCell>{v.city}</TableCell>
                    <TableCell className="max-w-xs">{v.helpType}</TableCell>
                    <TableCell className="text-right">
                      {!showArchived && <AcceptButton type="volunteers" id={v.id} />}
                    </TableCell>
                  </TableRow>
                ))}
                {volunteers.length === 0 && emptyRow(6)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата заявки</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Что передают</TableHead>
                  <TableHead>Дата передачи</TableHead>
                  <TableHead className="w-32 text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(m.createdAt)}</TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell className="max-w-xs">{m.items}</TableCell>
                    <TableCell>{m.preferredDate}</TableCell>
                    <TableCell className="text-right">
                      {!showArchived && <AcceptButton type="materials" id={m.id} />}
                    </TableCell>
                  </TableRow>
                ))}
                {materials.length === 0 && emptyRow(6)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="helpRequests">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Ребёнок</TableHead>
                  <TableHead>Диагноз / Сумма</TableHead>
                  <TableHead>Контакты родителей</TableHead>
                  <TableHead>Фото</TableHead>
                  <TableHead className="w-32 text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {helpRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(r.createdAt)}</TableCell>
                    <TableCell className="font-medium">
                      <div>{r.childName}</div>
                      <div className="text-xs text-muted-foreground">{r.age} лет</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">{r.diagnosis}</div>
                      <div className="font-medium mt-1">{r.targetSum} ₽</div>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs whitespace-pre-wrap">{r.parentContacts}</TableCell>
                    <TableCell>
                      {r.photoUrl ? (
                        <a href={publicUrlForObject(r.photoUrl)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          Ссылка
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!showArchived && <AcceptButton type="helpRequests" id={r.id} />}
                    </TableCell>
                  </TableRow>
                ))}
                {helpRequests.length === 0 && emptyRow(6)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Сообщение</TableHead>
                  <TableHead className="w-32 text-right">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(c.createdAt)}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell className="max-w-md whitespace-pre-wrap">{c.message}</TableCell>
                    <TableCell className="text-right">
                      {!showArchived && <AcceptButton type="contacts" id={c.id} />}
                    </TableCell>
                  </TableRow>
                ))}
                {contacts.length === 0 && emptyRow(5)}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
