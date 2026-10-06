import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, MapPin } from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { Reveal } from '../motion/Reveal';

export const FeaturedProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories: { label: string; value: string }[] = [
    { label: 'ALL WORK', value: 'ALL' },
    { label: 'RESIDENTIAL', value: 'RESIDENTIAL' },
    { label: 'COMMERCIAL', value: 'COMMERCIAL' },
    { label: 'INTERIOR', value: 'INTERIOR' },
  ];

  const filteredProjects =
    selectedCategory === 'ALL'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-24 sm:py-32 bg-[#0F172A] text-white overflow-hidden border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header Section matching reference design */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-4 max-w-2xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#38BDF8] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#2872A1]" /> SELECTED PORTFOLIO
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
                Present Your Projects <br />
                With Clarity & Impact
              </h2>
            </Reveal>
          </div>

          {/* Filtering Pills */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-[#2872A1] text-white shadow-lg shadow-[#2872A1]/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Asymmetric Editorial Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16">
          {filteredProjects.map((project, idx) => {
            const isLarge = idx === 0 || idx === 3;
            return (
              <Reveal key={project.id} delay={idx * 0.15} className={isLarge ? 'md:col-span-2' : ''}>
                <Link
                  to={`/projects/${project.slug}`}
                  data-cursor="project"
                  className="group block relative overflow-hidden rounded-3xl bg-[#1E293B] border border-white/10 transition-all duration-500 hover:border-[#2872A1]"
                >
                  {/* Image Container with Clip Mask & Zoom */}
                  <div className={`relative overflow-hidden ${isLarge ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                    {/* Top Overlay Badge */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                      <span className="px-3.5 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md text-[#38BDF8] text-xs font-mono font-bold border border-white/20">
                        {project.number}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                        {project.categoryLabel}
                      </span>
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-2 text-xs text-[#CBDDE9] font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>{project.location}</span>
                          <span>•</span>
                          <span>{project.year}</span>
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight group-hover:text-[#CBDDE9] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 font-normal">
                          {project.subtitle}
                        </p>
                      </div>

                      <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-[#2872A1] text-white flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* View All Projects Footer Action */}
        <div className="pt-16 text-center">
          <Reveal>
            <Link
              to="/projects"
              data-cursor="link"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 border border-white/20 transition-all shadow-xl hover:scale-105"
            >
              View Full Portfolio Archive <ArrowUpRight className="w-4 h-4 text-[#38BDF8]" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
