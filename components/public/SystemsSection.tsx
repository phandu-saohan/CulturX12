'use client';
import React from 'react';
import { CulturXData } from '@/lib/initialData';

interface SystemsSectionProps {
  siteData: CulturXData;
}

export default function SystemsSection({ siteData }: SystemsSectionProps) {
  return (
    <section id="duality" className="scroll-mt-12 border-t border-b border-brand-line/30">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Black System */}
        <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 px-8 lg:px-20 py-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-brand-line/30 min-h-[400px]">
          <div className="max-w-lg mx-auto space-y-6">
            <span className="text-[10px] tracking-[4px] font-mono text-brand-gold font-bold uppercase">{siteData.blackSystem.kicker}</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-display leading-[1.1] tracking-tight">
              {siteData.blackSystem.heading.split('.').map(p => p.trim()).filter(Boolean).map((part, index, arr) => {
                const isGold = part.toLowerCase() === 'activation';
                return (
                  <React.Fragment key={index}>
                    <span className={isGold ? "text-brand-gold" : "text-white"}>{part}</span>
                    {index < arr.length - 1 && <span className={isGold ? "text-brand-gold" : "text-white"}>.</span>}
                    {index < arr.length - 1 && <br />}
                  </React.Fragment>
                );
              })}
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                {siteData.blackSystem.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {siteData.blackSystem.pills.map((pill, idx) => (
                <span key={idx} className="inline-block border border-brand-line/50 rounded-full px-4 py-2 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-gold bg-neutral-900">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* White System */}
        <div className="bg-gradient-to-br from-neutral-100 to-amber-50/70 text-zinc-900 px-8 lg:px-20 py-14 flex flex-col justify-center min-h-[400px]">
          <div className="max-w-lg mx-auto space-y-6">
            <span className="text-[10px] tracking-[4px] font-mono text-[#aa8612] font-semibold uppercase">{siteData.whiteSystem.kicker}</span>
            <h2 className="text-3xl md:text-5xl font-black text-neutral-950 uppercase font-display leading-[1.1] tracking-tight">
              {siteData.whiteSystem.heading.split('.').map(p => p.trim()).filter(Boolean).map((part, index, arr) => {
                const isHighlight = part.toLowerCase() === 'regulation';
                return (
                  <React.Fragment key={index}>
                    <span className={isHighlight ? "text-[#aa8612]" : "text-neutral-950"}>{part}</span>
                    {index < arr.length - 1 && <span className={isHighlight ? "text-[#aa8612]" : "text-neutral-950"}>.</span>}
                    {index < arr.length - 1 && <br />}
                  </React.Fragment>
                );
              })}
            </h2>
            <div className="space-y-4">
              <p className="text-zinc-700 text-xs md:text-sm leading-relaxed">
                {siteData.whiteSystem.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              {siteData.whiteSystem.pills.map((pill, idx) => (
                <span key={idx} className="inline-block border border-[#aa8612]/35 rounded-full px-4 py-2 text-[10px] font-mono font-black tracking-widest uppercase text-[#aa8612] bg-white/70">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integration Hub / Connecting Ribbon */}
      <div className="bg-neutral-950 border-t border-brand-line/25 py-6 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse shrink-0"></span>
          <p className="text-xs font-mono font-semibold text-brand-soft uppercase tracking-[3px]">
            Together they form one integrated system.
          </p>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse shrink-0 hidden md:block"></span>
        </div>
      </div>
    </section>
  );
}
