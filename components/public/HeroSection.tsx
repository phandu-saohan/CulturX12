'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CulturXData } from '@/lib/initialData';

interface HeroSectionProps {
  siteData: CulturXData;
}

export default function HeroSection({ siteData }: HeroSectionProps) {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center px-6 lg:px-24 pt-24 pb-12 bg-radial-gradient">
      {/* Glow ambient circle background as requested in original style */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-gold/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="kicker text-[12px] uppercase tracking-[6px] text-brand-gold font-bold font-mono">
            {siteData.hero.brandKicker}
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[8px] font-display mb-2 uppercase leading-[1.05] text-white">
            {siteData.hero.brandLogo}
          </h1>

          <h2 className="text-md md:text-xl font-bold tracking-[4px] font-sans text-brand-soft uppercase mt-4 max-w-3xl mx-auto">
            {siteData.hero.subline}
          </h2>

          <p className="text-xs md:text-sm font-mono text-indigo-400 font-bold tracking-[3px] uppercase mt-2">
            The Future of Health Engineering.
          </p>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-brand-soft text-sm md:text-base max-w-3xl mx-auto leading-relaxed pt-2"
        >
          {siteData.hero.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <a 
            href="#shop" 
            className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-brand-black bg-gradient-to-r from-brand-gold to-yellow-600 rounded-full transition duration-300 hover:scale-105"
          >
            Shop the System
          </a>
          <a 
            href="#bodyworks" 
            className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-brand-gold border border-brand-line hover:border-brand-gold rounded-full bg-transparent hover:bg-neutral-900/40 transition duration-300"
          >
            Book Clinical Bodywork
          </a>
        </motion.div>
      </div>
    </section>
    </>
  );
}
