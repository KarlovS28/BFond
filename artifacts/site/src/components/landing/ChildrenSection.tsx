import React, { useState } from "react";
import { useListChildren } from "@workspace/api-client-react";
import { ChildCard } from "./ChildCard";
import { ChildDialog } from "./ChildDialog";
import { Child } from "@workspace/api-client-react";

export function ChildrenSection({ onOpenGallery }: { onOpenGallery: (childId: number) => void }) {
  const { data: children } = useListChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  if (!children || children.length === 0) return null;

  return (
    <section id="children" className="bg-[linear-gradient(180deg,rgba(253,249,244,0.96),rgba(248,241,232,0.92))] py-20 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 text-center md:mb-16">
          <h2 className="mb-4 text-4xl font-serif font-bold text-foreground md:text-5xl">
            Им нужна помощь
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
            Каждое пожертвование приближает этих детей к здоровой жизни.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child, idx) => (
            <ChildCard
              key={child.id}
              child={child}
              index={idx}
              onClick={() => setSelectedChild(child)}
              onOpenGallery={() => onOpenGallery(child.id)}
            />
          ))}
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
