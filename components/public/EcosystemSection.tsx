'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CulturXData } from '@/lib/initialData';

interface EcosystemSectionProps {
  siteData: CulturXData;
}

export default function EcosystemSection({ siteData }: EcosystemSectionProps) {
  return (
    <section id="ecosystem" className="bg-gradient-to-br from-[#0c0c0c] to-black py-12 px-6 lg:px-24 border-t border-b border-brand-line/30 scroll-mt-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-2">{siteData.ecosystem.kicker}</span>
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white">
            {siteData.ecosystem.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteData.ecosystem.items.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ y: -6, borderColor: 'rgba(212,175,55,.85)' }}
              className="bg-neutral-950 border border-brand-line/50 p-6 rounded-[20px] shadow-lg flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-1 bg-brand-gold/10 text-brand-gold rounded-full border border-brand-gold/20">
                  CX · {item.title}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold group-hover:animate-ping" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display uppercase text-white mb-2">{item.title}</h3>
                <p className="text-brand-gold text-xs font-semibold mb-3">{item.subtitle}</p>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
