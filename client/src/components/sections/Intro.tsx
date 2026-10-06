import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

export const Intro: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] text-[#0F172A] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column Pill Label */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2872A1]/10 border border-[#2872A1]/20 text-[#2872A1] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> OVERVIEW
              </div>
            </Reveal>
          </div>

          {/* Right Column Statement */}
          <div className="lg:col-span-9 space-y-8">
            <Reveal delay={0.2}>
              <h2 className="text-editorial-title font-display font-extrabold text-[#0F172A] leading-tight">
                FROM CONCEPT TO CONSTRUCTION, WE TRANSFORM IDEAS INTO SPACES THAT STAND THE TEST OF TIME.
              </h2>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-lg sm:text-2xl text-[#475569] font-normal max-w-3xl leading-relaxed">
                ARCS is a multi-disciplinary practice combining visionary architectural design with rigorous engineering execution. We believe true luxury lies in restraint, natural materials, and flawless spatial proportions.
              </p>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="pt-4 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  data-cursor="link"
                  className="px-6 py-3 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md"
                >
                  Our Philosophy <ArrowUpRight className="w-4 h-4 text-[#38BDF8]" />
                </Link>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#2872A1]" />
                  <span>ISO 9001 Certified Construction</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
