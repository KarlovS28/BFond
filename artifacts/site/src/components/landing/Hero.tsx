import React from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  const { data: settings } = useGetPublicSettings();
  
  const orgName = settings?.orgName || "Мечты добрых сердец";
  const slogan = settings?.slogan || "Мы помогаем спасать жизни и дарить надежду";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      className="relative w-full py-10 md:py-15 lg:py-10 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/generated-hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
      
      <div className="container relative z-10 mx-auto px-40 flex flex-col items-center text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-foreground max-w-4xl tracking-tight leading-tight mb-6"
        >
          {orgName}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-foreground/80 max-w-2xl mb-10"
        >
          {slogan}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button 
            size="lg" 
            className="text-base h-14 px-8 rounded-full"
            onClick={() => scrollTo("children")}
          >
            Хочу помочь
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-base h-14 px-8 rounded-full bg-white/80 hover:bg-white text-foreground"
            onClick={() => scrollTo("help-request")}
          >
            Нужна помощь
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
