import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

const STAGES = [
  {
    step: '01',
    title: 'Topography & Concept',
    desc: 'BIM 3D modeling, solar path vector mapping, and subterranean site soil testing.',
  },
  {
    step: '02',
    title: 'Permits & Structural Design',
    desc: 'Post-tensioned slab calculations, hurricane/earthquake structural resilience engineering.',
  },
  {
    step: '03',
    title: 'Subterranean Foundation',
    desc: 'Deep granite piling, multi-layer waterproofing, and subterranean utility channels.',
  },
  {
    step: '04',
    title: 'Cast-In-Place Structure',
    desc: 'Precision timber formwork pouring for curved vaults and monolithic concrete slabs.',
  },
  {
    step: '05',
    title: 'Interior Craftsmanship',
    desc: 'Hand-troweled micro-cement plastering, stone joinery, and concealed lighting diffusers.',
  },
  {
    step: '06',
    title: 'Commissioning & Handover',
    desc: 'Airflow quality validation, smart automation testing, and full structural warranty issuance.',
  },
];

export const ConstructionJourney: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] text-[#0F172A] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-16 border-b border-slate-200">
          <div className="space-y-4 max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2872A1]/10 border border-[#2872A1]/20 text-[#2872A1] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> EXECUTION METHODOLOGY
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight">
                From Soil Survey <br />
                To Architectural Icon
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.3}>
            <p className="text-sm text-[#475569] max-w-md font-normal leading-relaxed">
              Our integrated architecture and construction model eliminates friction between design intent and physical build quality.
            </p>
          </Reveal>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-16">
          {STAGES.map((stage, idx) => (
            <Reveal key={stage.step} delay={idx * 0.1}>
              <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-4 hover:border-[#2872A1] transition-all duration-300 hover:shadow-xl group">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-2xl text-[#2872A1] font-mono">
                    {stage.step}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-slate-400 group-hover:text-[#2872A1] transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A] tracking-tight">
                  {stage.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">{stage.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
