import React from 'react';
import { Sparkles, Quote, Star } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

const TESTIMONIALS = [
  {
    quote:
      'Working with ARCS transformed our ambitious subterranean concept into a breathtaking reality. Their precision in structural concrete casting is unmatched.',
    name: 'Vikram & Radhika Seth',
    role: 'Homeowners',
    project: 'Dune Sanctuary Residence, Chennai',
    image: '/images/hero_architecture.jpg',
  },
  {
    quote:
      'ARCS completed our corporate campus 2 months ahead of schedule with flawless architectural detailing and zero compromise on safety or materials.',
    name: 'Anand Viswanathan',
    role: 'Managing Director, Aethelred Tech',
    project: 'Aethelred Corporate HQ, Bengaluru',
    image: '/images/project_commercial_hq.jpg',
  },
  {
    quote:
      'The travertine stone craftsmanship and cove lighting design in our penthouse are works of art. Highly professional engineering team.',
    name: 'Dr. Meera Chandran',
    role: 'Executive',
    project: 'Skyline Travertine Suite, Chennai',
    image: '/images/project_interior_penthouse.jpg',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#0F172A] text-white border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-16 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#38BDF8] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#2872A1]" /> CLIENT TESTIMONIALS
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                Trusted By Visionary <br />
                Clients Worldwide
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="flex items-center gap-1 text-[#38BDF8]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#38BDF8] text-[#38BDF8]" />
              ))}
              <span className="text-xs font-bold text-white ml-2 uppercase tracking-wider">
                5.0 Overall Client Rating
              </span>
            </div>
          </Reveal>
        </div>

        {/* Testimonial Cards Grid matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 0.15}>
              <div className="p-8 rounded-3xl bg-[#1E293B] border border-white/10 flex flex-col justify-between h-full space-y-6 hover:border-[#2872A1]/50 transition-all duration-300">
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-[#2872A1]" />
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-[#38BDF8] font-medium">{t.role}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{t.project}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
