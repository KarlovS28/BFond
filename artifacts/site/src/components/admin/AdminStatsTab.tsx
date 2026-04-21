import React from "react";
import { useAdminDonationStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, MousePointerClick } from "lucide-react";

export function AdminStatsTab() {
  const { data: stats, isLoading } = useAdminDonationStats();

  if (isLoading) return <div>Загрузка...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-serif font-medium">Статистика</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MousePointerClick size={16} className="text-primary" />
              Кликов «Пожертвовать» за неделю
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{stats.totalWeek}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 size={18} />
            Популярность сборов (клики по детям)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя подопечного</TableHead>
                <TableHead className="text-right">Количество кликов</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.perChild.map((item) => (
                <TableRow key={item.childId}>
                  <TableCell className="font-medium">{item.childName}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                </TableRow>
              ))}
              {stats.perChild.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">Нет данных</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
