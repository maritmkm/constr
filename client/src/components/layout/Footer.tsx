import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp, Mail, Phone, MapPin } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0F1D] text-white border-t border-white/10 pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Banner CTA */}
        <Reveal>
          <div className="border-b border-white/10 pb-16 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-[#38BDF8] text-xs font-semibold uppercase tracking-widest border border-white/10">
                Ready To Start?
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
                LET'S BUILD <br />
                SOMETHING GREAT.
              </h2>
            </div>
            <Link
              to="/contact"
              data-cursor="link"
              className="px-8 py-4 rounded-full bg-[#2872A1] hover:bg-[#1D557A] text-white font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all duration-300 shadow-xl shadow-[#2872A1]/20 hover:scale-105"
            >
              Start a Conversation <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </Reveal>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-2xl tracking-tighter text-white">
              ARCS<span className="text-[#38BDF8]">.</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              An architectural design and high-end construction practice creating enduring residential, commercial, and interior spaces.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Capabilities & Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Studio Philosophy
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Worker Registration
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Project Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Contact</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <a href="mailto:hello@arcs-studio.com" className="hover:text-white transition-colors">
                  hello@arcs-studio.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>+91 98400 12345</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>12, Cathedral Road, Chennai, TN 600086</span>
              </li>
            </ul>
          </div>

          {/* Social & Press */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">Connect</h4>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'LinkedIn', 'Behance', 'ArchDaily'].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ARCS Architecture & Construction Studio. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors group"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform text-[#38BDF8]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
