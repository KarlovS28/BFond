import React from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { publicUrlForObject } from "@/lib/upload";

export function Hero({
  fullHeight = true,
  backgroundUrl,
}: {
  fullHeight?: boolean;
  backgroundUrl?: string;
}) {
  const { data: settings } = useGetPublicSettings();
  
  const orgName = settings?.orgName || "Мечты добрых сердец";
  const slogan = settings?.slogan || "Мы помогаем спасать жизни и дарить надежду";
  const heroImage = backgroundUrl || publicUrlForObject(settings?.backgroundImageUrl) || "/foundation-background.png";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className={`relative flex w-full items-center justify-center overflow-hidden py-8 ${fullHeight ? "min-h-[calc(100dvh-5rem)]" : "min-h-[46vh] rounded-[40px]"}`}
      style={{
        backgroundImage: `url('${heroImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,246,0.1)_0%,rgba(255,246,237,0.08)_18%,rgba(255,249,243,0.22)_42%,rgba(255,250,246,0.54)_72%,rgba(255,244,234,0.94)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.1)_72%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,rgba(255,244,234,0)_0%,rgba(255,244,234,0.68)_58%,rgba(255,244,234,1)_100%)]" />
      
      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-10">
        <div className="sm:px-10 md:px-14 md:py-12 lg:px-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-6 max-w-5xl text-4xl font-serif font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-7xl"
        >
          {orgName}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-3xl text-lg text-foreground/80 md:text-xl"
        >
          {slogan}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
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
      </div>
    </section>
  );
}
