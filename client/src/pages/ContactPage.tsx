import React from 'react';
import { ContactCtaSection } from '../components/sections/ContactCtaSection';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Reveal } from '../components/motion/Reveal';

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-arch-dark text-arch-bg font-sans">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/10 pb-16 space-y-6">
          <Reveal>
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-arch-bronze text-xs font-bold uppercase tracking-widest border border-white/15">
              GET IN TOUCH
            </span>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-white tracking-tight leading-none">
              START A <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-arch-sand to-arch-bronze">
                PROJECT INQUIRY.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              We welcome architectural inquiries, site feasibility consultations, and general contracting partnerships.
            </p>
          </Reveal>
        </div>

        {/* Office Locations */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10">
          <div className="p-8 rounded-3xl bg-arch-darkCard border border-white/10 space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Chennai Studio (HQ)</h3>
            <p className="text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-arch-terracotta shrink-0 mt-0.5" />
              12, Cathedral Road, Nungambakkam, Chennai, TN 600086
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-arch-terracotta shrink-0" /> +91 98400 12345
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-arch-terracotta shrink-0" /> chennai@arcs-studio.com
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-arch-darkCard border border-white/10 space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Bengaluru Office</h3>
            <p className="text-xs text-slate-300 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-arch-terracotta shrink-0 mt-0.5" />
              45, Indiranagar 100ft Road, Bengaluru, KA 560038
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-arch-terracotta shrink-0" /> +91 98765 43210
            </p>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-arch-terracotta shrink-0" /> blr@arcs-studio.com
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-arch-darkCard border border-white/10 space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Studio Hours</h3>
            <p className="text-xs text-slate-300 flex items-start gap-2">
              <Clock className="w-4 h-4 text-arch-terracotta shrink-0 mt-0.5" />
              Monday – Saturday: 9:00 AM – 7:00 PM (IST)
            </p>
            <p className="text-xs text-slate-400">Sunday: By Prior Appointment Only</p>
          </div>
        </div>

        <ContactCtaSection />
      </main>

      <Footer />
    </div>
  );
};
