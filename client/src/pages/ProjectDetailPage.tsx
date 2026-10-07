import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin, Calendar, Building, Layers, CheckCircle2 } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';
import { Reveal } from '../components/motion/Reveal';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = PROJECTS_DATA.find((p) => p.slug === slug) || PROJECTS_DATA[0];

  return (
    <div className="min-h-screen bg-arch-dark text-arch-bg font-sans">
      <CustomCursor />
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-arch-terracotta" /> Back to Portfolio Archive
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
          <div className="space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-white/10 text-arch-bronze text-xs font-mono font-bold border border-white/15">
              PROJECT {project.number} • {project.categoryLabel}
            </span>
            <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-lg sm:text-2xl text-slate-300 font-normal max-w-3xl leading-relaxed">
              {project.subtitle}
            </p>
          </div>

          {/* Full Cover Image */}
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          </div>

          {/* Project Metadata Table Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-arch-darkCard border border-white/10">
            <div>
              <span className="text-[11px] font-bold text-arch-bronze uppercase tracking-widest block mb-1">
                Location
              </span>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-arch-terracotta shrink-0" /> {project.location}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-arch-bronze uppercase tracking-widest block mb-1">
                Year & Status
              </span>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-arch-terracotta shrink-0" /> {project.year} ({project.status})
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-arch-bronze uppercase tracking-widest block mb-1">
                Footprint Area
              </span>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Building className="w-4 h-4 text-arch-terracotta shrink-0" /> {project.area}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-arch-bronze uppercase tracking-widest block mb-1">
                Scope of Work
              </span>
              <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-arch-terracotta shrink-0" /> {project.scope}
              </p>
            </div>
          </div>

          {/* Project Narrative Story */}
          <div className="py-12 border-t border-b border-white/10 grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
                Architectural Story
              </h2>
              <p className="text-xs text-arch-bronze mt-1">Lead Architect: {project.leadArchitect}</p>
            </div>

            <div className="md:col-span-8 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              <div>
                <h3 className="text-base font-bold text-white mb-2">01. Architectural Concept</h3>
                <p>{project.story.concept}</p>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2">02. Spatial Form & Vaulting</h3>
                <p>{project.story.architecture}</p>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2">03. Materiality & Lighting</h3>
                <p>{project.story.materials}</p>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2">04. Structural Execution</h3>
                <p>{project.story.execution}</p>
              </div>
            </div>
          </div>

          {/* Gallery Showcase */}
          <div className="space-y-6 py-8">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
              Project Gallery
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.gallery.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-xl ${
                    i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Construction Journey Stages */}
          <div className="py-12 border-t border-white/10 space-y-8">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
              Execution Journey & Milestones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.journey.map((j) => (
                <div key={j.stage} className="p-6 rounded-2xl bg-arch-darkCard border border-white/10 space-y-3">
                  <span className="text-arch-terracotta font-mono font-bold text-lg">{j.stage}</span>
                  <h3 className="text-base font-bold text-white">{j.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{j.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-12 text-center border-t border-white/10 space-y-6">
            <h3 className="text-3xl font-display font-bold text-white">Have a Similar Project in Mind?</h3>
            <Link
              to="/contact"
              data-cursor="link"
              className="px-8 py-4 rounded-full bg-arch-terracotta hover:bg-arch-terracotta/90 text-white font-bold text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-all shadow-xl shadow-arch-terracotta/20 hover:scale-105"
            >
              Start a Conversation <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
