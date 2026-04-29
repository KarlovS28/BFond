import React, { useEffect } from "react";
import { trackVisit } from "@workspace/api-client-react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { AboutSection } from "@/components/landing/AboutSection";
import { BannersStrip } from "@/components/landing/BannersStrip";
import { ChildrenSection } from "@/components/landing/ChildrenSection";
import { GalleryLifeSection, type GalleryFilter } from "@/components/landing/GalleryLifeSection";
import { StoriesCarousel } from "@/components/landing/StoriesCarousel";
import { HowToHelp } from "@/components/landing/HowToHelp";
import { HelpRequestForm } from "@/components/landing/HelpRequestForm";
import { ReportsSection } from "@/components/landing/ReportsSection";
import { ContactsSection } from "@/components/landing/ContactsSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  const [selectedGalleryFilter, setSelectedGalleryFilter] = React.useState<GalleryFilter>(null);

  useEffect(() => {
    trackVisit({ path: window.location.pathname }).catch(() => {});
  }, []);

  const openGalleryForChild = (childId: number) => {
    setSelectedGalleryFilter(childId);
    document.getElementById("gallery-life")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-foreground">
      <Header />
      <main>
        <Hero />
        <BannersStrip />
        <AboutSection />
        <ChildrenSection onOpenGallery={openGalleryForChild} />
        <GalleryLifeSection
          selectedFilter={selectedGalleryFilter}
          onSelectFilter={setSelectedGalleryFilter}
        />
        <StoriesCarousel />
        <HowToHelp />
        <HelpRequestForm />
        <ReportsSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
}
