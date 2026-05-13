import React, { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useBanners } from "@/lib/banners";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { publicUrlForObject } from "@/lib/upload";
import { cn } from "@/lib/utils";

export function BannersStrip({ fullHeight = true }: { fullHeight?: boolean }) {
  const { data: banners, isLoading } = useBanners();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);
  const bannerList = banners ?? [];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  });

  useEffect(() => {
    if (!emblaApi) return;

    const syncIndex = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    syncIndex();
    emblaApi.on("select", syncIndex);
    emblaApi.on("reInit", syncIndex);

    return () => {
      emblaApi.off("select", syncIndex);
      emblaApi.off("reInit", syncIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (bannerList.length <= 1 || !emblaApi || isHovered) return;

    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);

    return () => window.clearInterval(timer);
  }, [bannerList.length, emblaApi, isHovered]);

  const selectedBanner = useMemo(
    () => bannerList.find((banner) => banner.id === selectedBannerId) ?? null,
    [bannerList, selectedBannerId],
  );

  if (isLoading || bannerList.length === 0) return null;

  return (
    <section className={`flex items-center bg-transparent ${fullHeight ? "min-h-[calc(100dvh-5rem)] py-6 md:py-8" : "py-2"}`}>
      <div className={`mx-auto w-full ${fullHeight ? "container max-w-7xl px-4 sm:px-6" : ""}`}>
        <div
          className="group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#fff4ea] via-[#fff4ea]/80 to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#fff4ea] via-[#fff4ea]/80 to-transparent md:w-28" />

          <div ref={emblaRef} className="touch-pan-y overflow-hidden">
            <div className="-ml-4 flex">
              {bannerList.map((banner, index) => (
                <div key={banner.id} className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[76%] lg:basis-[68%]">
                  <motion.button
                    type="button"
                    onClick={() => setSelectedBannerId(banner.id)}
                    initial={{ opacity: 0.55, scale: 0.94 }}
                    animate={{
                      opacity: activeIndex === index ? 1 : 0.6,
                      scale: activeIndex === index ? 1 : 0.94,
                    }}
                    transition={{ duration: 0.35 }}
                    className={cn(
                      "relative flex min-h-[220px] w-full overflow-hidden rounded-[32px] border border-white/70 text-left shadow-[0_22px_60px_-32px_rgba(165,145,115,0.46)] ring-1 ring-[#f3dfcf]/70 md:min-h-[290px]",
                      activeIndex === index ? "shadow-[0_30px_80px_-30px_rgba(165,145,115,0.52)]" : "",
                    )}
                  >
                    <img
                      src={publicUrlForObject(banner.imageUrl) || "/child-placeholder.png"}
                      alt={banner.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[rgba(68,40,18,0.92)] via-[rgba(68,40,18,0.56)] to-[rgba(68,40,18,0.12)]" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[rgba(255,244,234,0.18)] to-transparent" />
                    <div className="relative z-10 flex max-w-3xl flex-col justify-end px-6 py-7 sm:px-8 md:px-10">
                      <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">События фонда</p>
                      <h2 className="mt-3 text-2xl font-serif font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                        {banner.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
                        {banner.description}
                      </p>
                    </div>
                  </motion.button>
                </div>
              ))}
            </div>
          </div>

          {bannerList.length > 1 && (
            <>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute left-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/70 bg-white/92 text-[#6b4d35] opacity-100 shadow-lg transition-opacity hover:bg-white md:left-6 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => emblaApi?.scrollNext()}
                className="absolute right-3 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full border border-white/70 bg-white/92 text-[#6b4d35] opacity-100 shadow-lg transition-opacity hover:bg-white md:right-6 md:h-12 md:w-12 md:opacity-0 md:group-hover:opacity-100"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={selectedBanner !== null} onOpenChange={(open) => !open && setSelectedBannerId(null)}>
        <DialogContent className="max-w-4xl overflow-hidden border-0 bg-[#fffaf5] p-0">
          <AnimatePresence mode="wait">
            {selectedBanner && (
              <motion.div
                key={selectedBanner.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="grid md:grid-cols-[1.1fr_0.9fr]"
              >
                <div className="relative min-h-[240px] md:min-h-[420px]">
                  <img
                    src={publicUrlForObject(selectedBanner.imageUrl) || "/child-placeholder.png"}
                    alt={selectedBanner.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(45,24,10,0.28)] via-transparent to-transparent" />
                </div>
                <div className="flex flex-col justify-center px-6 py-7 sm:px-8">
                  <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="font-serif text-2xl leading-tight text-[#5f432c] sm:text-3xl">
                      {selectedBanner.title}
                    </DialogTitle>
                    <DialogDescription className="text-base leading-7 text-[#6f5847]">
                      {selectedBanner.description}
                    </DialogDescription>
                  </DialogHeader>
                  {selectedBanner.linkUrl ? (
                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={() => {
                          if (selectedBanner.linkUrl.startsWith("http://") || selectedBanner.linkUrl.startsWith("https://")) {
                            window.open(selectedBanner.linkUrl, "_blank", "noopener,noreferrer");
                            return;
                          }

                          if (selectedBanner.linkUrl.startsWith("/#")) {
                            document.getElementById(selectedBanner.linkUrl.slice(2))?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                            setSelectedBannerId(null);
                          }
                        }}
                        className="rounded-full bg-[#d98652] px-6 text-white hover:bg-[#c97542]"
                      >
                        Перейти к событию
                      </Button>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </section>
  );
}
