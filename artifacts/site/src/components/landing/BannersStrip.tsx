import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBanners } from "@/lib/banners";
import { publicUrlForObject } from "@/lib/upload";

export function BannersStrip() {
  const { data: banners, isLoading } = useBanners();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [banners]);

  if (isLoading || !banners || banners.length === 0) return null;

  const activeBanner = banners[activeIndex];

  const handleClick = () => {
    if (!activeBanner.linkUrl) return;
    if (activeBanner.linkUrl.startsWith("http://") || activeBanner.linkUrl.startsWith("https://")) {
      window.open(activeBanner.linkUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (activeBanner.linkUrl.startsWith("/#")) {
      const id = activeBanner.linkUrl.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="bg-[#fff4ea] py-4">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.button
            key={activeBanner.id}
            type="button"
            onClick={handleClick}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="relative flex min-h-[180px] w-full overflow-hidden rounded-[30px] border border-white/70 bg-white text-left shadow-[0_18px_48px_-28px_rgba(165,145,115,0.45)]"
          >
            <img
              src={publicUrlForObject(activeBanner.imageUrl) || "/child-placeholder.png"}
              alt={activeBanner.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(76,46,26,0.88)] via-[rgba(76,46,26,0.68)] to-[rgba(76,46,26,0.18)]" />
            <div className="relative z-10 flex max-w-3xl flex-col justify-center px-6 py-7 sm:px-10">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Баннер фонда</p>
              <h2 className="mt-3 text-3xl font-serif font-bold leading-tight text-white md:text-4xl">
                {activeBanner.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/88 md:text-base">
                {activeBanner.description}
              </p>
            </div>
          </motion.button>
        </AnimatePresence>
      </div>
    </section>
  );
}
