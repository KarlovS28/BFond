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
}

export function ChildCard({ child, index, onClick }: ChildCardProps) {
  const percent = formatPercent(child.collectedSum, child.targetSum);
  const remaining = child.targetSum - child.collectedSum;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.2) }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-border/50 flex flex-col"
      onClick={onClick}
    >
      {child.isUrgent && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <UrgentMarquee />
        </div>
      )}

      <div className="relative h-40 overflow-hidden">
        <img
          src={publicUrlForObject(child.photoUrl) || "/child-placeholder.png"}
          alt={`${child.name} ${child.surname}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className={`p-3 flex flex-col flex-1 ${child.isUrgent ? "pt-6" : ""}`}>
        <h3 className="text-sm font-serif font-bold text-foreground leading-tight">
          {child.name} {child.surname}
        </h3>
        <p className="text-[11px] font-medium text-muted-foreground mt-0.5 mb-2">
          {child.age} лет • {child.diagnosis}
        </p>

        <p className="text-foreground/75 line-clamp-2 mb-3 text-xs leading-relaxed">
          {child.story}
        </p>

        <div className="space-y-1.5 mt-auto">
          <div className="flex justify-between text-[11px]">
            <span className="font-medium">{formatRub(child.collectedSum)}</span>
            <span className="text-muted-foreground">из {formatRub(child.targetSum)}</span>
          </div>
          <Progress value={percent} className="h-1.5 bg-muted" />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{percent}%</span>
            <span>Остаток: {formatRub(remaining > 0 ? remaining : 0)}</span>
          </div>

          <Button
            size="sm"
            className="w-full mt-2 rounded-full text-xs h-8"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Помочь
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
