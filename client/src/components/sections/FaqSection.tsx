import React, { useState } from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { Reveal } from '../motion/Reveal';

const FAQS = [
  {
    question: 'What is the typical timeframe from architectural concept to construction handover?',
    answer:
      'For high-end residential villas (5,000–10,000 sq.ft), the total duration spans 14 to 18 months. Design and approvals take 3–4 months, while subterranean foundation and turnkey construction take 11–14 months.',
  },
  {
    question: 'Do you handle local municipal building permits and regulatory clearances?',
    answer:
      'Yes. As an integrated architecture and construction practice, we manage 100% of municipal plan approvals, environmental clearances, structural sanctions, and utility grid connections on behalf of our clients.',
  },
  {
    question: 'How do you guarantee transparent cost control and prevent budget overruns?',
    answer:
      'We operate under a fixed-price turnkey agreement backed by itemized Bill of Quantities (BOQ). Material specifications, slab costs, and finishes are locked prior to breaking ground, ensuring complete financial transparency.',
  },
  {
    question: 'What structural warranties and post-handover support do you provide?',
    answer:
      'We provide a 10-year structural engineering warranty on all concrete framing and foundations, alongside a 2-year comprehensive defect liability period for waterproofing, MEP, and joinery.',
  },
  {
    question: 'Can you execute construction for external architectural plans designed by other firms?',
    answer:
      'Yes. Our general contracting division frequently collaborates with renowned international and domestic architecture studios to execute complex, high-precision builds.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] text-[#0F172A] border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column matching reference screenshot */}
          <div className="lg:col-span-5 space-y-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2872A1]/10 border border-[#2872A1]/20 text-[#2872A1] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> FREQUENTLY ASKED
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-tight text-[#0F172A]">
                Got Questions? <br />
                We've Got Answers.
              </h2>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed max-w-md">
                Have specific inquiries about site feasibility, architectural fees, or construction timelines? Contact our senior director directly.
              </p>
            </Reveal>
          </div>

          {/* Right Column Accordions matching reference pill style */}
          <div className="lg:col-span-7 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <Reveal key={faq.question} delay={idx * 0.1}>
                  <div
                    onClick={() => toggleFaq(idx)}
                    className={`rounded-2xl transition-all duration-300 border cursor-pointer ${
                      isOpen
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xl'
                        : 'bg-white text-[#0F172A] border-slate-200 hover:border-[#2872A1]'
                    }`}
                  >
                    <div className="p-6 sm:p-7 flex items-center justify-between gap-4">
                      <h3 className="text-base sm:text-lg font-display font-bold pr-4">
                        {faq.question}
                      </h3>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isOpen ? 'bg-[#2872A1] text-white' : 'bg-[#2872A1]/10 text-[#2872A1]'
                        }`}
                      >
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-6 pb-7 sm:px-7 pt-0 text-xs sm:text-sm text-slate-200 leading-relaxed border-t border-white/10 mt-2 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
