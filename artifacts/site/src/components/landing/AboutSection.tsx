import React from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { MapPin, FileText } from "lucide-react";
import { publicUrlForObject } from "@/lib/upload";

export function AboutSection() {
  const { data: settings } = useGetPublicSettings();
  
  if (!settings) return null;

  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">О фонде</h2>
          <p className="text-lg text-muted-foreground whitespace-pre-wrap text-left md:text-center max-w-3xl mx-auto leading-relaxed">
            {settings.mission}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-serif font-semibold mb-4">Учредительные документы</h3>
            <div className="flex flex-wrap gap-3">
              {settings.documents?.map((doc, idx) => (
                <a 
                  key={idx}
                  href={publicUrlForObject(doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-muted/50 hover:bg-muted text-foreground px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  {doc.title}
                </a>
              ))}
              {(!settings.documents || settings.documents.length === 0) && (
                <span className="text-muted-foreground text-sm">Документы скоро появятся</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-serif font-semibold mb-4">Наш адрес</h3>
            <div className="flex items-start gap-3 bg-secondary/20 p-6 rounded-2xl">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <p className="text-foreground font-medium leading-relaxed">
                {settings.legalAddress}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
