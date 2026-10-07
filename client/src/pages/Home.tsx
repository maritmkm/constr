import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Intro } from '../components/sections/Intro';
import { FeaturedProjectsSection } from '../components/sections/FeaturedProjectsSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { ConstructionJourney } from '../components/sections/ConstructionJourney';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { FaqSection } from '../components/sections/FaqSection';
import { ContactCtaSection } from '../components/sections/ContactCtaSection';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-arch-bg text-arch-dark font-sans selection:bg-arch-terracotta selection:text-white">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <FeaturedProjectsSection />
        <ServicesSection />
        <ConstructionJourney />
        <TestimonialsSection />
        <FaqSection />
        <ContactCtaSection />
      </main>
      <Footer />
    </div>
  );
};
