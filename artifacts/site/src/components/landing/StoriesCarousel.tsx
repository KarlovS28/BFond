import React, { useState } from "react";
import { useListStories } from "@workspace/api-client-react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicUrlForObject } from "@/lib/upload";

export function StoriesCarousel() {
  const { data: stories } = useListStories();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  if (!stories || stories.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Истории спасённых
            </h2>
            <p className="text-lg text-muted-foreground">
              Благодаря вашей поддержке они получили шанс на здоровое будущее.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {stories.map((story) => (
              <div key={story.id} className="flex-[0_0_80%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 pl-4">
                <div className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted cursor-pointer">
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
    </section>
  );
}
