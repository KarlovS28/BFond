import React, { useEffect } from "react";
import { trackVisit, useGetPublicSettings } from "@workspace/api-client-react";
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
import { publicUrlForObject } from "@/lib/upload";

export default function LandingPage() {
  const [selectedGalleryFilter, setSelectedGalleryFilter] = React.useState<GalleryFilter>(null);
  const { data: settings } = useGetPublicSettings();

  useEffect(() => {
    trackVisit({ path: window.location.pathname }).catch(() => {});
  }, []);

  const openGalleryForChild = (childId: number) => {
    setSelectedGalleryFilter(childId);
    requestAnimationFrame(() => {
      const root = document.getElementById("landing-scroll-root");
      const target = document.getElementById("gallery-life");
      if (root && target) {
        root.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      }
    });
  };

  const backgroundImage = publicUrlForObject(settings?.backgroundImageUrl) || "/foundation-background.png";
  const backgroundImageWithVersion = `${backgroundImage}${backgroundImage.includes("?") ? "&" : "?"}bg=${encodeURIComponent(settings?.backgroundImageUrl || "default")}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-foreground">
      <Header />
      <div className="relative isolate">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-[0.2]"
          style={{ backgroundImage: `url('${backgroundImageWithVersion}')`, backgroundAttachment: "fixed" }}
          aria-hidden="true"
        />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_34%),linear-gradient(180deg,rgba(255,250,245,0.62),rgba(255,255,255,0.74)_38%,rgba(255,249,241,0.72)_100%)]" aria-hidden="true" />
      <main
        id="landing-scroll-root"
        className="relative z-10 h-[calc(100dvh-5rem)] snap-y snap-proximity overflow-y-auto scroll-smooth"
      >
        <div className="landing-slide">
          <section className="flex min-h-[calc(100dvh-5rem)] w-full items-center py-6 md:py-8">
            <div className="container mx-auto flex h-full max-w-[1500px] flex-col justify-center gap-6 px-4 sm:px-6">
              <Hero fullHeight={false} backgroundUrl={backgroundImageWithVersion} />
              <BannersStrip fullHeight={false} />
            </div>
          </section>
        </div>
        <div className="landing-slide">
          <section className="flex min-h-[calc(100dvh-5rem)] w-full items-center py-6 md:py-8">
            <div className="container mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
              <AboutSection fullHeight={false} />
              <ReportsSection fullHeight={false} />
            </div>
          </section>
        </div>
        <div className="landing-slide">
          <ChildrenSection onOpenGallery={openGalleryForChild} />
        </div>
        <div className="landing-slide">
          <GalleryLifeSection
            selectedFilter={selectedGalleryFilter}
            onSelectFilter={setSelectedGalleryFilter}
          />
        </div>
        <div className="landing-slide">
          <StoriesCarousel />
        </div>
        <div className="landing-slide">
          <section className="flex min-h-[calc(100dvh-5rem)] w-full items-center py-6 md:py-8">
            <div className="container mx-auto grid max-w-[1640px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
              <HowToHelp fullHeight={false} />
              <HelpRequestForm fullHeight={false} />
            </div>
          </section>
        </div>
        <div className="landing-slide">
          <div className="flex min-h-[calc(100dvh-5rem)] w-full flex-col justify-between">
            <ContactsSection />
            <Footer />
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
