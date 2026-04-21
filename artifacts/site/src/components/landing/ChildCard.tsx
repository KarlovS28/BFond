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
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-border/50 flex flex-col md:flex-row"
      onClick={onClick}
    >
      {child.isUrgent && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <UrgentMarquee />
        </div>
      )}

      <div className={`md:w-2/5 relative h-40 md:h-auto overflow-hidden ${!isEven ? 'md:order-last' : ''}`}>
        <img
          src={publicUrlForObject(child.photoUrl) || "/child-placeholder.png"}
          alt={`${child.name} ${child.surname}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      <div className={`md:w-3/5 p-4 md:p-6 flex flex-col justify-center relative z-10 ${child.isUrgent ? 'pt-8 md:pt-10' : ''}`}>
        <div className="mb-1">
          <h3 className="text-lg md:text-xl font-serif font-bold text-foreground">
            {child.name} {child.surname}
          </h3>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            {child.age} лет • {child.diagnosis}
          </p>
        </div>

        <p className="text-foreground/80 line-clamp-2 mb-4 text-sm leading-relaxed">
          {child.story}
        </p>

        <div className="space-y-2 mt-auto">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-foreground">
                {formatRub(child.collectedSum)} из {formatRub(child.targetSum)}
              </span>
            </div>
            <Progress value={percent} className="h-1.5 bg-muted" />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{percent}%</span>
              <span>Остаток: {formatRub(remaining > 0 ? remaining : 0)}</span>
            </div>
          </div>

          <Button
            size="sm"
            className="w-full sm:w-auto mt-2 px-6 rounded-full"
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
