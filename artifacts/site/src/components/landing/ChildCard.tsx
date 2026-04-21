import React from "react";
import { Child } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { formatRub, formatPercent } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { UrgentMarquee } from "./UrgentMarquee";

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="group relative bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-border/50 flex flex-col md:flex-row"
      onClick={onClick}
    >
      {child.isUrgent && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <UrgentMarquee />
        </div>
      )}

      <div className={`md:w-1/2 relative h-64 md:h-auto overflow-hidden ${!isEven ? 'md:order-last' : ''}`}>
        <img 
          src={child.photoUrl || "/child-placeholder.png"} 
          alt={`${child.name} ${child.surname}`} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-${isEven ? 'r' : 'l'} from-card via-card/50 to-transparent opacity-80 md:opacity-100 md:from-card md:via-card/20 md:to-transparent`}></div>
      </div>

      <div className={`md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10 ${child.isUrgent ? 'pt-14 md:pt-16' : ''}`}>
        <div className="mb-2">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            {child.name} {child.surname}
          </h3>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {child.age} лет • {child.diagnosis}
          </p>
        </div>

        <p className="text-foreground/80 line-clamp-3 mb-8 text-base leading-relaxed">
          {child.story}
        </p>

        <div className="space-y-4 mt-auto">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">
                Собрано: {formatRub(child.collectedSum)} из {formatRub(child.targetSum)}
              </span>
            </div>
            <Progress value={percent} className="h-2.5 bg-muted" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{percent}%</span>
              <span>Остаток: {formatRub(remaining > 0 ? remaining : 0)}</span>
            </div>
          </div>

          <Button 
            className="w-full sm:w-auto mt-4 px-8 rounded-full"
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
