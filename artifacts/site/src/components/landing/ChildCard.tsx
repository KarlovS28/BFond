import React from "react";
import { Child } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { formatRub, formatPercent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UrgentMarquee } from "./UrgentMarquee";
import { publicUrlForObject } from "@/lib/upload";

interface ChildCardProps {
  child: Child;
  index: number;
  onClick: () => void;
  onOpenGallery: () => void;
}

export function ChildCard({ child, index, onClick, onOpenGallery }: ChildCardProps) {
  const percent = formatPercent(child.collectedSum, child.targetSum);
  const remaining = child.targetSum - child.collectedSum;
  const photoUrl = publicUrlForObject(child.photoUrl) || "/child-placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2) }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/86 shadow-[0_18px_48px_-28px_rgba(165,145,115,0.45)] backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-[0_24px_64px_-28px_rgba(165,145,115,0.55)]"
      onClick={onClick}
    >
      {child.isUrgent && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <UrgentMarquee />
        </div>
      )}

      <div className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(250,243,236,0.86),rgba(255,255,255,0.78)_78%,rgba(255,255,255,0.92)_100%)] px-4 pb-0 pt-5 sm:px-5">
        <div className="relative flex aspect-[4/4.8] w-full items-end justify-center overflow-hidden rounded-t-[24px]">
          <img
            src={photoUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.92)_76%,rgba(255,255,255,1)_100%)]" />
          <img
            src={photoUrl}
            alt={`${child.name} ${child.surname}`}
            className="relative z-10 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className={`relative z-10 -mt-4 flex flex-1 flex-col rounded-t-[28px] bg-white/94 px-5 pb-5 pt-6 backdrop-blur-sm sm:px-6 sm:pb-6 ${child.isUrgent ? "pt-9" : ""}`}>
        <h3 className="text-xl font-serif font-bold leading-tight text-foreground sm:text-2xl">
          {child.name} {child.surname}
        </h3>
        <p className="mb-3 mt-1 text-sm font-medium text-[#8a6f58] sm:text-base">
          {child.age} лет • {child.diagnosis}
        </p>

        <p className="mb-5 line-clamp-3 text-sm leading-7 text-foreground/75 sm:text-base">
          {child.story}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between gap-3 text-sm sm:text-base">
            <span className="font-semibold text-foreground">{formatRub(child.collectedSum)}</span>
            <span className="text-right text-muted-foreground">из {formatRub(child.targetSum)}</span>
          </div>
          <Progress value={percent} className="h-2.5 bg-[#f3e7db]" />
          <div className="flex justify-between gap-3 text-xs text-muted-foreground sm:text-sm">
            <span>{percent}%</span>
            <span>Остаток: {formatRub(remaining > 0 ? remaining : 0)}</span>
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Button
              size="sm"
              className="h-11 rounded-full text-sm sm:h-12 sm:text-base"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Помочь
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-11 rounded-full border-primary/30 bg-white/85 px-3 text-center text-[12px] leading-4 text-primary hover:bg-primary/5 sm:h-12 sm:px-4 sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpenGallery();
              }}
            >
              <span className="block whitespace-normal">Жизнь наших подопечных</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
