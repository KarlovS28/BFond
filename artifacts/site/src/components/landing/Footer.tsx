import React, { useState } from "react";
import { useGetPublicSettings } from "@workspace/api-client-react";
import { PrivacyDialog } from "./PrivacyDialog";
import { FaTelegram, FaVk, FaWhatsapp, FaInstagram } from "react-icons/fa6";

export function Footer() {
  const { data: settings } = useGetPublicSettings();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const orgName = settings?.orgName || "Мечты добрых сердец";

  return (
    <footer className="bg-foreground text-background py-12 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
        <div>
          <h3 className="font-serif text-2xl font-bold mb-2">{orgName}</h3>
          <p className="text-sm text-white/60 mb-6">
            © {currentYear} {orgName}. Все права защищены.
          </p>
          <button 
            onClick={() => setPrivacyOpen(true)}
            className="text-sm text-white/80 hover:text-white underline underline-offset-4 transition-colors"
          >
            Политика конфиденциальности
          </button>
        </div>

        {settings?.socials && (
          <div>
            <p className="text-sm text-white/60 mb-4 md:text-right">Мы в социальных сетях:</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              {settings.socials.vk && (
                <a href={settings.socials.vk} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all">
                  <FaVk size={18} />
                </a>
              )}
              {settings.socials.telegram && (
                <a href={settings.socials.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all">
                  <FaTelegram size={18} />
                </a>
              )}
              {settings.socials.whatsapp && (
                <a href={settings.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all">
                  <FaWhatsapp size={18} />
                </a>
              )}
              {settings.socials.instagram && (
                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all">
                  <FaInstagram size={18} />
                </a>
              )}
              {settings.socials.max && (
                <a href={settings.socials.max} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all font-bold text-[10px]">
                  MAX
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
    </footer>
  );
}
