'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CulturXData } from '@/lib/initialData';

interface ManifestoSectionProps {
  siteData: CulturXData;
}

export default function ManifestoSection({ siteData }: ManifestoSectionProps) {
  return (
    <section id="manifesto" className="bg-brand-black py-12 px-6 lg:px-24 border-t border-brand-line/30 scroll-mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="kicker text-center text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-4">
          {siteData.manifesto.kicker}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-center uppercase font-display mb-6 text-white tracking-wide">
          {siteData.manifesto.heading}
        </h2>

        <motion.div 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="card bg-neutral-950 border border-brand-line/75 rounded-[24px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 blur-xl rounded-full" />
          
          <div className="space-y-8">
            {/* Introduction terms */}
            <div className="space-y-4 text-center max-w-2xl mx-auto">
              <p className="text-base md:text-lg font-bold tracking-tight text-white leading-relaxed font-display">
                {siteData.manifesto.terms[0] || "Through discipline, structure, and intelligent systems… comes freedom."}
              </p>
              <div className="flex justify-center items-center space-x-4 py-1">
                <span className="h-px bg-neutral-800 w-8 md:w-12"></span>
                <span className="text-brand-gold text-xs font-black uppercase tracking-[4px] font-mono">
                  {siteData.manifesto.terms[1] || "Not restriction. Liberation."}
                </span>
                <span className="h-px bg-neutral-800 w-8 md:w-12"></span>
              </div>
            </div>

            {/* Duality section: Freedom From vs. Freedom To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Freedom From - Clinical Downregulation */}
              <div className="bg-neutral-900/60 border border-neutral-800/80 p-6 rounded-2xl space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-[#aa8612] font-black uppercase block border-b border-neutral-900 pb-2">
                  Dissolving Restrictions
                </span>
                <ul className="space-y-3.5 text-xs text-zinc-400">
                  {(siteData.manifesto.terms.slice(2, 10).length > 0 
                    ? siteData.manifesto.terms.slice(2, 10) 
                    : [
                        "Freedom from disorder.",
                        "Freedom from stagnation.",
                        "Freedom from dysfunction.",
                        "Freedom from unnecessary suffering.",
                        "Freedom from bloating.",
                        "Freedom from inflammation.",
                        "Freedom from fatigue.",
                        "Freedom from nervous system overload."
                      ]
                  ).map((term, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="text-red-500/80 font-bold shrink-0">✕</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Freedom To - Performance Activation */}
              <div className="bg-neutral-900/60 border border-neutral-800/80 p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono tracking-widest text-brand-gold font-black uppercase block border-b border-neutral-900 pb-2">
                    Activating Human Potential
                  </span>
                  <ul className="space-y-4 text-xs text-zinc-300">
                    {(siteData.manifesto.terms.slice(10, 14).length > 0
                      ? siteData.manifesto.terms.slice(10, 14)
                      : [
                          "Freedom to think clearly.",
                          "Freedom to move freely.",
                          "Freedom to perform optimally.",
                          "Freedom to become what you are capable of becoming."
                        ]
                    ).map((term, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <span className="text-brand-gold font-bold shrink-0">✓</span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-neutral-900 hidden md:block">
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase">System Integration Level: Elite</span>
                </div>
              </div>
            </div>

            {/* Conclusion term */}
            <div className="text-center max-w-xl mx-auto pt-6 border-t border-neutral-900">
              <p className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 mb-1">THE SOVEREIGN STATE</p>
              <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed font-display">
                {siteData.manifesto.terms[14] || "The ultimate freedom is not escape."}{" "}
                <span className="text-brand-gold block md:inline font-bold">
                  {siteData.manifesto.terms[15] || "It is the ability to fully inhabit yourself."}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
