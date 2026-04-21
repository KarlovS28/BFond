import React, { useState } from "react";
import { useAdminListSubmissions } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/format";

export function AdminSubmissionsTab() {
  const { data: subs, isLoading } = useAdminListSubmissions();

  if (isLoading) return <div>Загрузка...</div>;
  if (!subs) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-serif font-medium mb-4">Входящие заявки</h2>
      
      <Tabs defaultValue="volunteers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="volunteers">Волонтёры ({subs.volunteers.length})</TabsTrigger>
          <TabsTrigger value="materials">Помощь вещами ({subs.materials.length})</TabsTrigger>
          <TabsTrigger value="helpRequests">Заявки о помощи ({subs.helpRequests.length})</TabsTrigger>
          <TabsTrigger value="contacts">Сообщения ({subs.contacts.length})</TabsTrigger>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.volunteers.map(v => (
                  <TableRow key={v.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(v.createdAt)}</TableCell>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="text-xs">
                      <div>{v.phone}</div>
                      <div className="text-muted-foreground">{v.email}</div>
                    </TableCell>
                    <TableCell>{v.city}</TableCell>
                    <TableCell className="max-w-xs">{v.helpType}</TableCell>
                  </TableRow>
                ))}
                {subs.volunteers.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Нет заявок</TableCell></TableRow>}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.materials.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(m.createdAt)}</TableCell>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.phone}</TableCell>
                    <TableCell className="max-w-xs">{m.items}</TableCell>
                    <TableCell>{m.preferredDate}</TableCell>
                  </TableRow>
                ))}
                {subs.materials.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Нет заявок</TableCell></TableRow>}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.helpRequests.map(r => (
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
                      {r.photoUrl ? <a href={r.photoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ссылка</a> : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {subs.helpRequests.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-4">Нет заявок</TableCell></TableRow>}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {subs.contacts.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap text-xs">{formatDate(c.createdAt)}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell className="max-w-md whitespace-pre-wrap">{c.message}</TableCell>
                  </TableRow>
                ))}
                {subs.contacts.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-4">Нет сообщений</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
