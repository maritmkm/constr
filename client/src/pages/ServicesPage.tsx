import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Compass, HardHat, Home, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CustomCursor } from '../components/motion/CustomCursor';
import { Reveal } from '../components/motion/Reveal';

const ALL_SERVICES = [
  {
    id: 'architecture',
    title: 'Architecture & Master Planning',
    subtitle: 'Climate-responsive spatial design, subterranean vaults, and parametric massing.',
    icon: Compass,
    image: '/images/hero_architecture.jpg',
    deliverables: [
      'Topographic Site & Micro-climate Analysis',
      '3D Photorealistic Architectural Renderings',
      'Subterranean Vault & Acoustic Engineering',
      'BIM (Building Information Modeling) Integration',
      'Municipal & Environmental Clearance Plans',
    ],
  },
  {
    id: 'construction',
    title: 'Turnkey Construction & Execution',
    subtitle: 'Precision structural concrete, post-tensioned slabs, and zero-defect site oversight.',
    icon: HardHat,
    image: '/images/project_coastal_sanctuary.jpg',
    deliverables: [
      'Deep Rock Piling & Subterranean Waterproofing',
      'Cast-In-Place Board-Formed Concrete Framing',
      'Post-Tensioned Deflection-Free Floor Slabs',
      'ISO 9001 Construction Quality Control Audits',
      'Fixed-Price Turnkey Bill of Quantities (BOQ)',
    ],
  },
  {
    id: 'interiors',
    title: 'Bespoke Interior Architecture',
    subtitle: 'Tactile stone joinery, travertine fireplaces, and automated cove lighting.',
    icon: Home,
    image: '/images/project_interior_penthouse.jpg',
    deliverables: [
      'Hand-Selected Quarried Stone & Millwork Fitouts',
      'Micro-Cement & Terracotta Plastering',
      'Concealed Linear Slot Diffusers & LED Cove Design',
      'Curated Italian Furniture & Textile Selection',
      'Smart Home Automation & Lighting Controls',
    ],
  },
  {
    id: 'project-management',
    title: 'Project Supervision & Governance',
    subtitle: 'Milestone cost tracking, vendor auditing, and zero safety incident management.',
    icon: Layers,
    image: '/images/project_commercial_hq.jpg',
    deliverables: [
      'Transparent Milestone Cost Auditing',
      'On-Site General Contractor Supervision',
      'Procurement & Supply Chain Management',
      'Structural Safety & Air Quality Validation',
      'Complete As-Built Documentation & Warranty',
    ],
  },
];

export const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-arch-bg text-arch-dark font-sans">
      <CustomCursor />
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 border-b border-arch-sand/40 pb-16 space-y-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-arch-dark/5 border border-arch-dark/10 text-arch-terracotta text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> STUDIO DISCIPLINES
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-4xl sm:text-7xl font-display font-extrabold text-arch-dark tracking-tight leading-none">
              WHAT WE DO & <br />
              HOW WE BUILD.
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-base sm:text-xl text-arch-muted max-w-2xl font-normal leading-relaxed">
              We provide an integrated, seamless workflow from architectural concept to structural foundation and final interior handover.
            </p>
          </Reveal>
        </div>

        {/* Detailed Service Sections */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-24">
          {ALL_SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            const isReverse = idx % 2 !== 0;

            return (
              <div
                key={srv.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-16 border-b border-arch-sand/40 last:border-none`}
              >
                <div className={`lg:col-span-6 space-y-6 ${isReverse ? 'lg:order-2' : ''}`}>
                  <div className="inline-flex items-center gap-2 text-arch-terracotta font-mono font-bold text-sm">
                    <Icon className="w-5 h-5" /> DISCIPLINE 0{idx + 1}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-arch-dark tracking-tight">
                    {srv.title}
                  </h2>
                  <p className="text-base text-arch-muted leading-relaxed font-normal">{srv.subtitle}</p>

                  <div className="space-y-3 pt-4 border-t border-arch-sand/60">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-arch-dark">
                      Key Deliverables & Capabilities:
                    </h3>
                    <div className="space-y-2">
                      {srv.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-arch-dark font-medium">
                          <CheckCircle2 className="w-4 h-4 text-arch-terracotta shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/contact"
                      className="px-6 py-3 rounded-full bg-arch-dark hover:bg-arch-dark/90 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-md"
                    >
                      Inquire About This Service <ArrowUpRight className="w-4 h-4 text-arch-terracotta" />
                    </Link>
                  </div>
                </div>

                <div className={`lg:col-span-6 ${isReverse ? 'lg:order-1' : ''}`}>
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-arch-dark/10">
                    <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
