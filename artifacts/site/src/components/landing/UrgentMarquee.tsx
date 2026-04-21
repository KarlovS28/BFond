import React from "react";

export function UrgentMarquee() {
  return (
    <div className="bg-destructive text-destructive-foreground overflow-hidden py-1.5 whitespace-nowrap">
      <div className="animate-marquee inline-block font-bold text-sm tracking-widest px-4">
        !!! СРОЧНЫЙ СБОР !!! СРОЧНЫЙ СБОР !!! СРОЧНЫЙ СБОР !!! !!! СРОЧНЫЙ СБОР !!! СРОЧНЫЙ СБОР !!! СРОЧНЫЙ СБОР !!! !!! СРОЧНЫЙ СБОР !!! СРОЧНЫЙ СБОР !!!
      </div>
    </div>
  );
}
