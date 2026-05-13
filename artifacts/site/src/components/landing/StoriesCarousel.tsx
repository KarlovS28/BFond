import React, { useState } from "react";
import { useListStories } from "@workspace/api-client-react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicUrlForObject } from "@/lib/upload";

export function StoriesCarousel() {
  const { data: stories } = useListStories();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  if (!stories || stories.length === 0) return null;

  return (
    <section className="flex min-h-[calc(100dvh-5rem)] items-center py-14 md:py-16">
      <div className="container mx-auto max-w-[1500px] px-4">
        <div className="mb-8 flex flex-col items-center justify-center gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div className="mx-auto max-w-3xl md:mx-0">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Истории спасённых
            </h2>
            <p className="text-lg text-muted-foreground">
              Благодаря вашей поддержке они получили шанс на здоровое будущее.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1320px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[rgba(255,248,242,0.98)] via-[rgba(255,248,242,0.78)] to-transparent md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[rgba(255,248,242,0.98)] via-[rgba(255,248,242,0.78)] to-transparent md:block" />
        <div className="touch-pan-y overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 items-stretch justify-center">
            {stories.map((story) => (
              <div key={story.id} className="min-w-0 flex-[0_0_82%] pl-4 md:flex-[0_0_42%] lg:flex-[0_0_31%]">
                <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/70 bg-white/72 aspect-[4/5] backdrop-blur-sm">
                  <img 
                    src={publicUrlForObject(story.photoUrl) || "/child-placeholder.png"} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Default state - Title visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:-translate-y-full opacity-100 group-hover:opacity-0">
                    <h3 className="text-xl font-serif font-bold leading-tight">{story.title}</h3>
                  </div>

                  {/* Hover state - Description slides up */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-black/40 backdrop-blur-sm">
                    <h3 className="text-xl font-serif font-bold leading-tight mb-3">{story.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-6">{story.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
