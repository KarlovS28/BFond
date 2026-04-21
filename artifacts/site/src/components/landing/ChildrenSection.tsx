import React, { useState } from "react";
import { useListChildren } from "@workspace/api-client-react";
import { ChildCard } from "./ChildCard";
import { ChildDialog } from "./ChildDialog";
import { Child } from "@workspace/api-client-react";

export function ChildrenSection() {
  const { data: children } = useListChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  if (!children || children.length === 0) return null;

  return (
    <section id="children" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Им нужна помощь
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Каждое пожертвование приближает этих детей к здоровой жизни.
          </p>
        </div>

        <div className="space-y-12 md:space-y-24">
          {children.map((child, idx) => (
            <ChildCard 
              key={child.id} 
              child={child} 
              index={idx} 
              onClick={() => setSelectedChild(child)} 
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
