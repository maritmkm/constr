import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-[#0F172A] text-white">
      {/* Background Architectural Photo with Dark Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="/images/hero_architecture.jpg"
          alt="Luxury organic concrete architecture"
          initial={{ scale: 1.15, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.65 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full my-auto py-12">
        <div className="max-w-4xl space-y-6">
          {/* Pill Badge matching reference image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#38BDF8] text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2872A1]" />
            <span>Elevate Your Vision With ARCS</span>
          </motion.div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-editorial-hero font-display font-extrabold text-white tracking-tight"
          >
            WE BUILD <br />
            SPACES THAT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CBDDE9] to-[#38BDF8]">
              DEFINE PLACES.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-xl text-slate-200 max-w-xl font-normal leading-relaxed"
          >
            An award-winning architecture and construction practice creating enduring residential, commercial, and subterranean environments.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              to="/projects"
              data-cursor="link"
              className="px-7 py-3.5 rounded-full bg-[#2872A1] hover:bg-[#1D557A] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all duration-300 shadow-xl shadow-[#2872A1]/30 hover:scale-105"
            >
              Explore Portfolio <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              data-cursor="link"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all duration-300"
            >
              Our Philosophy
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="border-r border-white/10 pr-4 last:border-none">
            <span className="text-2xl sm:text-4xl font-display font-extrabold text-white">50+</span>
            <p className="text-[11px] text-slate-300 uppercase tracking-widest mt-1">Projects Completed</p>
          </div>
          <div className="border-r border-white/10 pr-4 last:border-none">
            <span className="text-2xl sm:text-4xl font-display font-extrabold text-white">120K+</span>
            <p className="text-[11px] text-slate-300 uppercase tracking-widest mt-1">Sq.Ft Built</p>
          </div>
          <div className="border-r border-white/10 pr-4 last:border-none">
            <span className="text-2xl sm:text-4xl font-display font-extrabold text-white">$3.5M</span>
            <p className="text-[11px] text-slate-300 uppercase tracking-widest mt-1">Executed Value</p>
          </div>
          <div className="pr-4">
            <span className="text-2xl sm:text-4xl font-display font-extrabold text-white">940M+</span>
            <p className="text-[11px] text-slate-300 uppercase tracking-widest mt-1">Spatial Reach</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 right-8 z-10 hidden lg:flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest"
      >
        <span>SCROLL</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#38BDF8]" />
      </motion.div>
    </section>
  );
};
