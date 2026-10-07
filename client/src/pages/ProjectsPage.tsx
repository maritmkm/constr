import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin, Sparkles, Search } from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';
import { Reveal } from '../components/motion/Reveal';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { label: 'ALL WORK', value: 'ALL' },
    { label: 'RESIDENTIAL', value: 'RESIDENTIAL' },
    { label: 'COMMERCIAL', value: 'COMMERCIAL' },
    { label: 'INTERIOR', value: 'INTERIOR' },
  ];

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-arch-dark text-arch-bg font-sans">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Header Banner */}
          <div className="border-b border-white/10 pb-12 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-arch-bronze text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-arch-terracotta" /> PORTFOLIO ARCHIVE
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-white tracking-tight leading-none">
                SELECTED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-arch-sand to-arch-bronze">
                  WORKS & ESTATES.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Explore our archive of completed residential, commercial, and interior architecture projects crafted across India and international sites.
              </p>
            </Reveal>
          </div>

          {/* Filtering & Search Bar */}
          <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-arch-terracotta text-white shadow-lg shadow-arch-terracotta/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-arch-terracotta transition-colors"
              />
            </div>
          </div>

          {/* Projects Asymmetric Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12">
              {filteredProjects.map((project, idx) => (
                <Reveal key={project.id} delay={idx * 0.1}>
                  <Link
                    to={`/projects/${project.slug}`}
                    data-cursor="project"
                    className="group block relative overflow-hidden rounded-3xl bg-arch-darkCard border border-white/10 transition-all duration-500 hover:border-arch-terracotta/50"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-arch-dark via-arch-dark/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                        <span className="px-3.5 py-1 rounded-full bg-arch-dark/80 backdrop-blur-md text-arch-bronze text-xs font-mono font-bold border border-white/15">
                          {project.number}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                          {project.categoryLabel}
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-arch-sand font-medium">
                            <MapPin className="w-3.5 h-3.5 text-arch-terracotta" />
                            <span>{project.location}</span>
                            <span>•</span>
                            <span>{project.year}</span>
                          </div>
                          <h3 className="text-2xl font-display font-extrabold text-white tracking-tight group-hover:text-arch-sand transition-colors">
                            {project.title}
                          </h3>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-arch-terracotta text-white flex items-center justify-center shrink-0 transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-4">
              <p className="text-slate-400 text-sm">No projects match your search criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
