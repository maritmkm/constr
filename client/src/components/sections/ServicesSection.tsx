import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Layers, Compass, HardHat, Home } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

const SERVICES = [
  {
    number: '01',
    title: 'Architecture & Concept Design',
    description:
      'Visionary spatial planning, massing studies, subterranean vaulting, and climate-responsive architectural detailing.',
    icon: Compass,
    image: '/images/hero_architecture.jpg',
    scope: ['Site Topography Analysis', '3D Photorealistic Modeling', 'Climatic Solar Orientation', 'BIM Engineering Integration'],
  },
  {
    number: '02',
    title: 'High-End Construction & Execution',
    description:
      'Rigorous structural engineering, post-tensioned concrete slabs, precision board-formed masonry, and turnkey site supervision.',
    icon: HardHat,
    image: '/images/project_coastal_sanctuary.jpg',
    scope: ['Foundation & Rock Anchoring', 'Cast-In-Place Architectural Concrete', 'Marine & Extreme Weather Proofing', 'Rigorous Quality Auditing'],
  },
  {
    number: '03',
    title: 'Bespoke Interior Architecture',
    description:
      'Custom travertine joinery, hand-applied micro-cement plasters, concealed lighting design, and curated material palettes.',
    icon: Home,
    image: '/images/project_interior_penthouse.jpg',
    scope: ['Custom Stone & Millwork', 'Acoustic & Cove Lighting', 'Furnishing Selection', 'Smart Automation Fitouts'],
  },
  {
    number: '04',
    title: 'Project Management & Supervision',
    description:
      'End-to-end milestone tracking, transparent budget auditing, regulatory compliance, and zero-defect handover quality.',
    icon: Layers,
    image: '/images/project_commercial_hq.jpg',
    scope: ['Milestone Budget Tracking', 'Regulatory Building Permits', 'Vendor & Craftsmen Oversight', 'Safety & Environmental Standards'],
  },
];

export const ServicesSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] text-[#0F172A] overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header matching reference image */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-16 border-b border-slate-200">
          <div className="space-y-4 max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2872A1]/10 border border-[#2872A1]/20 text-[#2872A1] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> OUR CAPABILITIES
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-[#0F172A] tracking-tight">
                Effective Showcase <br />
                Of Our Services
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <Link
              to="/services"
              data-cursor="link"
              className="px-6 py-3 rounded-full bg-[#0F172A] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#1E293B] transition-all shadow-md"
            >
              All Services <ArrowUpRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>
          </Reveal>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 items-center">
          {/* Left Column Services List */}
          <div className="lg:col-span-7 space-y-4">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              const isActive = activeIdx === idx;
              return (
                <Reveal key={service.number} delay={idx * 0.1}>
                  <div
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className={`p-6 sm:p-8 rounded-2xl transition-all duration-500 cursor-pointer border ${
                      isActive
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-2xl scale-[1.01]'
                        : 'bg-white text-[#0F172A] border-slate-200 hover:border-[#2872A1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-extrabold tracking-widest font-display ${
                            isActive ? 'text-[#38BDF8]' : 'text-[#64748B]'
                          }`}
                        >
                          {service.number}
                        </span>
                        <div
                          className={`p-2.5 rounded-xl ${
                            isActive ? 'bg-white/10 text-[#38BDF8]' : 'bg-[#2872A1]/10 text-[#2872A1]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
                          {service.title}
                        </h3>
                      </div>
                      <ArrowUpRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive ? 'text-[#38BDF8] translate-x-1 -translate-y-1' : 'text-[#64748B]'
                        }`}
                      />
                    </div>

                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4 animate-fadeIn">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {service.scope.map((item) => (
                            <span
                              key={item}
                              className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-[#CBDDE9] border border-white/10"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Right Column Dynamic Image Preview matching reference style */}
          <div className="lg:col-span-5 hidden lg:block sticky top-32">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <img
                src={SERVICES[activeIdx].image}
                alt={SERVICES[activeIdx].title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
                <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-widest">
                  Featured Discipline • {SERVICES[activeIdx].number}
                </span>
                <h4 className="text-2xl font-display font-bold">{SERVICES[activeIdx].title}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
