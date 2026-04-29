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
import { AdminGalleryTab } from "@/components/admin/AdminGalleryTab";
import { AdminBannersTab } from "@/components/admin/AdminBannersTab";

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

      <main className="mx-auto mt-4 max-w-[1440px] p-4 md:p-6">
        <Tabs defaultValue="children" className="flex w-full flex-col gap-6 lg:flex-row">
          <div className="lg:w-[280px] lg:shrink-0">
            <TabsList className="grid h-auto grid-cols-2 gap-2 overflow-x-auto rounded-[24px] border border-border bg-white p-2 sm:grid-cols-3 lg:sticky lg:top-24 lg:flex lg:w-[280px] lg:flex-col lg:gap-2 lg:self-start lg:p-3">
              <TabsTrigger value="children" className="min-h-11 px-4 py-3 text-sm md:justify-start">Подопечные</TabsTrigger>
              <TabsTrigger value="stories" className="min-h-11 px-4 py-3 text-sm md:justify-start">Истории</TabsTrigger>
              <TabsTrigger value="reports" className="min-h-11 px-4 py-3 text-sm md:justify-start">Отчёты</TabsTrigger>
              <TabsTrigger value="requests" className="min-h-11 px-4 py-3 text-sm md:justify-start">Заявки</TabsTrigger>
              <TabsTrigger value="gallery" className="min-h-11 px-4 py-3 text-sm md:justify-start">Галерея</TabsTrigger>
              <TabsTrigger value="banners" className="min-h-11 px-4 py-3 text-sm md:justify-start">Банеры</TabsTrigger>
              <TabsTrigger value="stats" className="min-h-11 px-4 py-3 text-sm md:justify-start">Статистика</TabsTrigger>
              <TabsTrigger value="settings" className="min-h-11 px-4 py-3 text-sm md:justify-start">Настройки</TabsTrigger>
            </TabsList>
          </div>

          <div className="min-w-0 flex-1">
            <TabsContent value="children" className="mt-0"><AdminChildrenTab /></TabsContent>
            <TabsContent value="stories" className="mt-0"><AdminStoriesTab /></TabsContent>
            <TabsContent value="reports" className="mt-0"><AdminReportsTab /></TabsContent>
            <TabsContent value="requests" className="mt-0"><AdminSubmissionsTab /></TabsContent>
            <TabsContent value="gallery" className="mt-0"><AdminGalleryTab /></TabsContent>
            <TabsContent value="banners" className="mt-0"><AdminBannersTab /></TabsContent>
            <TabsContent value="stats" className="mt-0"><AdminStatsTab /></TabsContent>
            <TabsContent value="settings" className="mt-0"><AdminSettingsTab /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
