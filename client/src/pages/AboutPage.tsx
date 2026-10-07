import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Award, ShieldCheck, Users, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';
import { Reveal } from '../components/motion/Reveal';

const LEADERSHIP = [
  {
    name: 'Ar. Rajesh Subramanian',
    role: 'Principal Architect & Founder',
    bio: 'Master of Architecture from AA London. 18+ years leading award-winning organic and subterranean residential projects.',
    image: '/images/hero_architecture.jpg',
  },
  {
    name: 'Er. Karthik Periasamy',
    role: 'Director of Engineering & Construction',
    bio: 'Structural Engineering lead specializing in post-tensioned concrete slabs, deep foundation rock pilings, and BOQ cost governance.',
    image: '/images/project_commercial_hq.jpg',
  },
  {
    name: 'Priya Sundaram',
    role: 'Head of Interior Architecture',
    bio: 'Expert in bespoke stone joinery, travertine finishing, and concealed acoustics for high-end luxury penthouses.',
    image: '/images/project_interior_penthouse.jpg',
  },
];

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-arch-dark text-arch-bg font-sans">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/10 pb-16 space-y-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-arch-bronze text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-arch-terracotta" /> ABOUT THE STUDIO
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-white tracking-tight leading-none">
              WE DESIGN. WE BUILD. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-arch-sand to-arch-bronze">
                WE DELIVER.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              ARCS is a contemporary architecture and construction practice focused on creating thoughtful, functional, and enduring environments.
            </p>
          </Reveal>
        </div>

        {/* Philosophy */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-arch-bronze uppercase tracking-widest block">
                Our Design Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                Restraint, Materiality & Structural Truth.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                We believe great architecture emerges when structural engineering and aesthetic design work in complete harmony. By taking full responsibility for both design and construction, we eliminate the gaps that traditionally dilute architectural concepts.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <span className="text-2xl font-display font-extrabold text-white">100%</span>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Turnkey Execution</p>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-display font-extrabold text-white">ISO 9001</span>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Certified Quality</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img src="/images/hero_architecture.jpg" alt="Studio" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-b border-white/10 space-y-12">
          <div className="space-y-2">
            <span className="text-xs font-bold text-arch-bronze uppercase tracking-widest">
              Leadership Team
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              Craftsmen & Visionaries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEADERSHIP.map((m) => (
              <div key={m.name} className="p-8 rounded-3xl bg-arch-darkCard border border-white/10 space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">{m.name}</h3>
                <p className="text-xs font-semibold text-arch-bronze">{m.role}</p>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
