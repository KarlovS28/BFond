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

      <main className="p-6 max-w-7xl mx-auto mt-4">
        <Tabs defaultValue="children" className="w-full flex flex-col md:flex-row gap-6">
          <TabsList className="md:order-2 md:w-56 md:shrink-0 md:flex md:flex-col md:h-auto md:items-stretch md:gap-1 md:p-2 md:sticky md:top-24 grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-white border border-border">
            <TabsTrigger value="children" className="py-2.5 md:justify-start">Подопечные</TabsTrigger>
            <TabsTrigger value="stories" className="py-2.5 md:justify-start">Истории</TabsTrigger>
            <TabsTrigger value="reports" className="py-2.5 md:justify-start">Отчёты</TabsTrigger>
            <TabsTrigger value="requests" className="py-2.5 md:justify-start">Заявки</TabsTrigger>
            <TabsTrigger value="stats" className="py-2.5 md:justify-start">Статистика</TabsTrigger>
            <TabsTrigger value="settings" className="py-2.5 md:justify-start">Настройки</TabsTrigger>
          </TabsList>

          <div className="flex-1 md:order-1 min-w-0">
            <TabsContent value="children" className="mt-0"><AdminChildrenTab /></TabsContent>
            <TabsContent value="stories" className="mt-0"><AdminStoriesTab /></TabsContent>
            <TabsContent value="reports" className="mt-0"><AdminReportsTab /></TabsContent>
            <TabsContent value="requests" className="mt-0"><AdminSubmissionsTab /></TabsContent>
            <TabsContent value="stats" className="mt-0"><AdminStatsTab /></TabsContent>
            <TabsContent value="settings" className="mt-0"><AdminSettingsTab /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
