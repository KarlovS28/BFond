import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useGalleryItems } from "@/lib/gallery";
import { publicUrlForObject } from "@/lib/upload";

export type GalleryFilter = number | "general" | null;

interface GalleryLifeSectionProps {
  selectedFilter: GalleryFilter;
  onSelectFilter: (filter: GalleryFilter) => void;
}

export function GalleryLifeSection({
  selectedFilter,
  onSelectFilter,
}: GalleryLifeSectionProps) {
  const { data: items, isLoading } = useGalleryItems();

  const groups = useMemo(() => {
    if (!items) return [];

    const groupMap = new Map<string, { key: GalleryFilter; title: string; count: number }>();
    groupMap.set("general", { key: "general", title: "Наши мероприятия", count: 0 });

    for (const item of items) {
      if (item.childId === null) {
        groupMap.get("general")!.count += 1;
        continue;
      }

      const key = String(item.childId);
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          key: item.childId,
          title: item.childName || `Подопечный #${item.childId}`,
          count: 0,
        });
      }
      groupMap.get(key)!.count += 1;
    }

    return Array.from(groupMap.values()).filter((group) => group.count > 0);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    if (selectedFilter === null) return items;
    if (selectedFilter === "general") return items.filter((item) => item.childId === null);
    return items.filter((item) => item.childId === selectedFilter);
  }, [items, selectedFilter]);

  useEffect(() => {
    if (selectedFilter === null) return;
    document.getElementById("gallery-life")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedFilter]);

  return (
    <section id="gallery-life" className="bg-[linear-gradient(180deg,#fff8f2_0%,#fff 100%)] py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 text-center">
          <h2 className="mb-4 text-4xl font-serif font-bold text-foreground md:text-5xl">
            Жизнь наших подопечных
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
            Фотографии с мероприятий, встреч и важных моментов, которые помогают увидеть жизнь фонда изнутри.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <button
            type="button"
            onClick={() => onSelectFilter("general")}
            className={`rounded-[28px] border p-5 text-left transition-all ${
              selectedFilter === "general"
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-white hover:-translate-y-0.5 hover:shadow-sm"
            }`}
          >
            <p className="text-sm uppercase tracking-[0.2em] text-primary/70">Раздел</p>
            <h3 className="mt-3 text-2xl font-serif font-bold">Наши мероприятия</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Общий фотоархив фонда без привязки к одному подопечному.
            </p>
          </button>

          {groups
            .filter((group) => group.key !== "general")
            .map((group) => (
              <button
                key={String(group.key)}
                type="button"
                onClick={() => onSelectFilter(group.key)}
                className={`rounded-[28px] border p-5 text-left transition-all ${
                  selectedFilter === group.key
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-white hover:-translate-y-0.5 hover:shadow-sm"
                }`}
              >
                <p className="text-sm uppercase tracking-[0.2em] text-primary/70">Подопечный</p>
                <h3 className="mt-3 text-2xl font-serif font-bold">{group.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {group.count} {group.count === 1 ? "карточка" : group.count < 5 ? "карточки" : "карточек"}
                </p>
              </button>
            ))}
        </div>

        {selectedFilter !== null && (
          <div className="mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => onSelectFilter(null)}
              className="rounded-full border border-border bg-white px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Показать все карточки
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,#f7ede2,#ffffff)] shadow-[0_18px_48px_-28px_rgba(165,145,115,0.25)]"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[30px] border border-dashed border-primary/25 bg-white/70 px-6 py-12 text-center">
            <h3 className="text-2xl font-serif font-bold text-foreground">Галерея скоро наполнится</h3>
            <p className="mt-3 text-muted-foreground">
              Раздел уже подключён. После добавления карточек в административной панели они появятся здесь.
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.18) }}
              className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_48px_-28px_rgba(165,145,115,0.45)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={publicUrlForObject(item.photoUrl) || "/child-placeholder.png"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(80,52,34,0.9)] via-[rgba(80,52,34,0.36)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 bg-white/18 p-5 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/75">
                    {item.childName || "Наши мероприятия"}
                  </p>
                  <h3 className="mt-2 text-2xl font-serif font-bold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/90">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
