import React, { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { AboutSection } from "@/components/landing/AboutSection";
import { ChildrenSection } from "@/components/landing/ChildrenSection";
import { StoriesCarousel } from "@/components/landing/StoriesCarousel";
import { HowToHelp } from "@/components/landing/HowToHelp";
import { HelpRequestForm } from "@/components/landing/HelpRequestForm";
import { ReportsSection } from "@/components/landing/ReportsSection";
import { ContactsSection } from "@/components/landing/ContactsSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-foreground">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ChildrenSection />
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
