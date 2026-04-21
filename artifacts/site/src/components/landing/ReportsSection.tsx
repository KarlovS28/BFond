import React, { useState } from "react";
import { useListReports, useListArchiveReports } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { Download, FileText } from "lucide-react";
import { publicUrlForObject } from "@/lib/upload";

export function ReportsSection() {
  const { data: recentReports } = useListReports();
  const { data: archiveReports } = useListArchiveReports();
  const [showArchive, setShowArchive] = useState(false);

  if (!recentReports && !archiveReports) return null;

  return (
    <section id="reports" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Отчётность
          </h2>
          <p className="text-lg text-muted-foreground">
            Мы работаем прозрачно и регулярно публикуем отчёты о поступлениях и тратах.
          </p>
        </div>

        <div className="space-y-4">
          {recentReports?.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary hidden sm:block">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={() => window.open(publicUrlForObject(report.fileUrl), "_blank")}>
                <Download size={16} />
                <span className="hidden sm:inline">Скачать</span>
              </Button>
            </div>
          ))}

          {(!recentReports || recentReports.length === 0) && (
            <p className="text-center text-muted-foreground">Нет недавних отчётов</p>
          )}
        </div>

        {archiveReports && archiveReports.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="ghost" onClick={() => setShowArchive(!showArchive)} className="rounded-full">
              {showArchive ? "Скрыть архив" : "Показать архив"}
            </Button>
            
            {showArchive && (
              <div className="space-y-4 mt-6 text-left">
                {archiveReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-5 bg-card/50 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-muted-foreground" />
                      <div>
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => window.open(publicUrlForObject(report.fileUrl), "_blank")}>
                      <Download size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
