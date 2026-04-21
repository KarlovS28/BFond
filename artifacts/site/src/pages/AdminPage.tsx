import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";

import { AdminChildrenTab } from "@/components/admin/AdminChildrenTab";
import { AdminStoriesTab } from "@/components/admin/AdminStoriesTab";
import { AdminReportsTab } from "@/components/admin/AdminReportsTab";
import { AdminSubmissionsTab } from "@/components/admin/AdminSubmissionsTab";
import { AdminStatsTab } from "@/components/admin/AdminStatsTab";
import { AdminSettingsTab } from "@/components/admin/AdminSettingsTab";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { data: me, isError } = useAdminMe();
  const logout = useAdminLogout();

  useEffect(() => {
    if (isError) setLocation("/admin/login");
  }, [isError, setLocation]);

  if (!me) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-primary">Админ-панель</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{me.username}</span>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => logout.mutate(undefined as never, { onSuccess: () => setLocation("/admin/login") })}>
            <LogOut size={16} />
            Выйти
          </Button>
        </div>
      </header>
      
      <main className="p-6 max-w-6xl mx-auto mt-4">
        <Tabs defaultValue="children" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3 md:grid-cols-6 h-auto p-1 bg-white border border-border">
            <TabsTrigger value="children" className="py-2.5">Подопечные</TabsTrigger>
            <TabsTrigger value="stories" className="py-2.5">Истории</TabsTrigger>
            <TabsTrigger value="reports" className="py-2.5">Отчёты</TabsTrigger>
            <TabsTrigger value="requests" className="py-2.5">Заявки</TabsTrigger>
            <TabsTrigger value="stats" className="py-2.5">Статистика</TabsTrigger>
            <TabsTrigger value="settings" className="py-2.5">Настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="children"><AdminChildrenTab /></TabsContent>
          <TabsContent value="stories"><AdminStoriesTab /></TabsContent>
          <TabsContent value="reports"><AdminReportsTab /></TabsContent>
          <TabsContent value="requests"><AdminSubmissionsTab /></TabsContent>
          <TabsContent value="stats"><AdminStatsTab /></TabsContent>
          <TabsContent value="settings"><AdminSettingsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
