import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle, Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Reveal } from '../motion/Reveal';

export const ContactCtaSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential Villa',
    budget: '$500K - $1.5M',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email address.');
      return;
    }
    setSubmitted(true);
    toast.success('Thank you! Your inquiry has been received. Our principal architect will contact you within 24 hours.');
  };

  return (
    <section className="relative py-28 sm:py-36 bg-[#0F172A] text-white overflow-hidden">
      {/* Background Architectural Photo with Dark Overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
        <img
          src="/images/hero_architecture.jpg"
          alt="Architecture background"
          className="w-full h-full object-cover filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Editorial Header */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#38BDF8] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-[#2872A1]" /> INITIATE A PROJECT
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
                Ready To Build A <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CBDDE9] to-[#38BDF8]">
                  Remarkable Space?
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-md">
                Whether you own land ready for architectural development or require turnkey construction management, our team is ready to assist.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="pt-4 space-y-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                  <span>Direct Consultation With Principal Architect</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                  <span>Fixed-Price Turnkey BOQ Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#38BDF8]" />
                  <span>ISO 9001 Construction Standard Compliance</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Interactive Form Box */}
          <div className="lg:col-span-7">
            <Reveal delay={0.3}>
              <div className="p-8 sm:p-10 rounded-3xl bg-[#1E293B] border border-white/15 shadow-2xl">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#2872A1]/20 text-[#38BDF8] mx-auto flex items-center justify-center border border-[#2872A1]/30">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white">Inquiry Received</h3>
                    <p className="text-sm text-slate-300 max-w-sm mx-auto">
                      Our senior director will review your project details and reach out within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-display font-bold text-white pb-2 border-b border-white/10">
                      Project Inquiry Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/20 text-white text-sm focus:outline-none focus:border-[#2872A1] transition-colors placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. ramesh@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/20 text-white text-sm focus:outline-none focus:border-[#2872A1] transition-colors placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/20 text-white text-sm focus:outline-none focus:border-[#2872A1] transition-colors placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Project Type
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/20 text-white text-sm focus:outline-none focus:border-[#2872A1] transition-colors"
                        >
                          <option value="Residential Villa">Residential Villa / Estate</option>
                          <option value="Commercial HQ">Commercial HQ / Office</option>
                          <option value="Interior Architecture">Luxury Interior Fitout</option>
                          <option value="Renovation">Architectural Renovation</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Project Message / Site Location Details
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your site location, scope of work, land area, or timeline expectations..."
                        className="w-full px-4 py-3 rounded-xl bg-[#0F172A] border border-white/20 text-white text-sm focus:outline-none focus:border-[#2872A1] transition-colors placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#2872A1] hover:bg-[#1D557A] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#2872A1]/25 hover:scale-[1.01]"
                    >
                      <span>Submit Project Inquiry</span> <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
