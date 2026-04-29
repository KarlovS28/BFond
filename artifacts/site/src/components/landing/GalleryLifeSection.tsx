import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGalleryItems } from "@/lib/gallery";
import { publicUrlForObject } from "@/lib/upload";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [activeAlbumId, setActiveAlbumId] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

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

  const activeAlbum = useMemo(
    () => filteredItems.find((item) => item.id === activeAlbumId) ?? items?.find((item) => item.id === activeAlbumId) ?? null,
    [activeAlbumId, filteredItems, items],
  );

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
              className="group relative cursor-pointer overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_48px_-28px_rgba(165,145,115,0.45)]"
              onClick={() => {
                setActiveAlbumId(item.id);
                setActivePhotoIndex(0);
                setZoomed(false);
              }}
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

      <Dialog
        open={Boolean(activeAlbum)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveAlbumId(null);
            setActivePhotoIndex(0);
            setZoomed(false);
          }
        }}
      >
        {activeAlbum && (
          <DialogContent className="max-w-6xl border-0 bg-transparent p-0 shadow-none">
            <div className="rounded-[32px] bg-[rgba(21,16,13,0.92)] p-4 text-white sm:p-6" onContextMenu={(e) => e.preventDefault()}>
              <DialogTitle className="sr-only">{activeAlbum.title}</DialogTitle>
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/65">
                    {activeAlbum.childName || "Наши мероприятия"}
                  </p>
                  <h3 className="mt-2 text-2xl font-serif font-bold sm:text-3xl">{activeAlbum.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/82 sm:text-base">
                    {activeAlbum.description}
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => {
                      setZoomed(false);
                      setActivePhotoIndex((current) => (current - 1 + activeAlbum.photos.length) % activeAlbum.photos.length);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => {
                      setZoomed(false);
                      setActivePhotoIndex((current) => (current + 1) % activeAlbum.photos.length);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] bg-black/30">
                <button
                  type="button"
                  className="w-full"
                  onClick={() => setZoomed((value) => !value)}
                >
                  <img
                    src={publicUrlForObject(activeAlbum.photos[activePhotoIndex]) || "/child-placeholder.png"}
                    alt={activeAlbum.title}
                    draggable={false}
                    className={`h-[58vh] w-full select-none object-contain transition-transform duration-300 ${zoomed ? "scale-[1.55] cursor-zoom-out" : "cursor-zoom-in"}`}
                  />
                </button>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[rgba(21,16,13,0.72)] to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[rgba(21,16,13,0.72)] to-transparent" />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activeAlbum.photos.map((photo, index) => (
                    <button
                      key={`${photo}-${index}`}
                      type="button"
                      onClick={() => {
                        setZoomed(false);
                        setActivePhotoIndex(index);
                      }}
                      className={`overflow-hidden rounded-2xl border transition-all ${
                        activePhotoIndex === index ? "border-white/70" : "border-white/10"
                      }`}
                    >
                      <img
                        src={publicUrlForObject(photo) || "/child-placeholder.png"}
                        alt=""
                        draggable={false}
                        className="h-16 w-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
                <div className="text-sm text-white/70">
                  {activePhotoIndex + 1} / {activeAlbum.photos.length}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
