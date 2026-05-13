import React, { useState } from "react";
import { useListChildren } from "@workspace/api-client-react";
import { ChildCard } from "./ChildCard";
import { ChildDialog } from "./ChildDialog";
import { Child } from "@workspace/api-client-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ChildrenSection({ onOpenGallery }: { onOpenGallery: (childId: number) => void }) {
  const { data: children } = useListChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: children ? children.length > 3 : false });

  if (!children || children.length === 0) return null;

  return (
    <section id="children" className="flex w-full min-h-[calc(100dvh-5rem)] items-center py-14 md:py-16">
      <div className="container mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-4 text-4xl font-serif font-bold text-foreground md:text-5xl">
            Им нужна помощь
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
            Каждое пожертвование приближает этих детей к здоровой жизни.
          </p>
        </div>

        <div className="relative mx-auto max-w-[1360px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-16 bg-gradient-to-r from-[rgba(255,248,242,0.98)] via-[rgba(255,248,242,0.78)] to-transparent md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-[rgba(255,248,242,0.98)] via-[rgba(255,248,242,0.78)] to-transparent md:block" />
          <div className="absolute left-1 top-1/2 z-10 -translate-y-1/2 md:-left-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full border border-white/70 bg-white/92 shadow-md md:h-12 md:w-12"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 md:-right-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full border border-white/70 bg-white/92 shadow-md md:h-12 md:w-12"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div ref={emblaRef} className="touch-pan-y overflow-hidden">
            <div className="-ml-5 flex items-stretch justify-center">
              {children.map((child, idx) => (
                <div key={child.id} className="min-w-0 shrink-0 grow-0 basis-[92%] pl-5 sm:basis-[74%] lg:basis-[46%] xl:basis-[31%]">
                  <ChildCard
                    child={child}
                    index={idx}
                    onClick={() => setSelectedChild(child)}
                    onOpenGallery={() => onOpenGallery(child.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <ChildDialog 
        child={selectedChild} 
        open={!!selectedChild} 
        onOpenChange={(open) => !open && setSelectedChild(null)} 
      />
    </section>
  );
}
