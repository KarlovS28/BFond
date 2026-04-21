import React from "react";
import { useAdminDonationStats, useAdminVisitStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MousePointerClick, Users, Wallet } from "lucide-react";
import { formatRub } from "@/lib/format";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

export function AdminStatsTab() {
  const { data: donations, isLoading: dl } = useAdminDonationStats();
  const { data: visits, isLoading: vl } = useAdminVisitStats();

  if (dl || vl) return <div>Загрузка...</div>;

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h2 className="text-xl font-serif font-medium flex items-center gap-2">
          <Eye size={20} className="text-primary" />
          Отчёт 1. Посещаемость сайта
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Посещений за неделю
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{visits?.totalWeek ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Посещения по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Количество посещений</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits?.perDay?.map((d) => (
                  <TableRow key={d.date}>
                    <TableCell className="font-medium">{formatDate(d.date)}</TableCell>
                    <TableCell className="text-right">{d.count}</TableCell>
                  </TableRow>
                ))}
                {(!visits?.perDay || visits.perDay.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">Нет данных</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Последние посещения (дата и время)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Страница</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits?.recent?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{formatDateTime(r.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.path}</TableCell>
                  </TableRow>
                ))}
                {(!visits?.recent || visits.recent.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">Нет данных</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-serif font-medium flex items-center gap-2">
          <Wallet size={20} className="text-primary" />
          Отчёт 2. Пожертвования
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MousePointerClick size={16} className="text-primary" />
                Намерений пожертвовать за неделю
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{donations?.totalWeek ?? 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet size={16} className="text-primary" />
                Общая сумма (по указанным суммам)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{formatRub(donations?.totalAmount ?? 0)}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Кому жертвовали</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Подопечный</TableHead>
                  <TableHead className="text-right">Кол-во намерений</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations?.perChild?.map((p) => (
                  <TableRow key={p.childId}>
                    <TableCell className="font-medium">{p.childName}</TableCell>
                    <TableCell className="text-right">{p.count}</TableCell>
                    <TableCell className="text-right">{formatRub(p.totalAmount ?? 0)}</TableCell>
                  </TableRow>
                ))}
                {(!donations?.perChild || donations.perChild.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Нет данных</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Последние пожертвования</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Подопечный</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations?.recent?.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{formatDateTime(r.createdAt)}</TableCell>
                    <TableCell>{r.childName}</TableCell>
                    <TableCell className="text-right">{r.amount ? formatRub(r.amount) : "—"}</TableCell>
                  </TableRow>
                ))}
                {(!donations?.recent || donations.recent.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Нет данных</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
