'use client';
import React from 'react';
import { Check } from 'lucide-react';
import { CulturXData } from '@/lib/initialData';

interface ProductsSectionProps { siteData: CulturXData; }

export default function ProductsSection({ siteData }: ProductsSectionProps) {
  return (
    <section id="products" className="bg-gradient-to-b from-[#fff] to-[#f4efe3] text-zinc-900 py-12 px-4 sm:px-6 lg:px-24 scroll-mt-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="kicker text-[10px] uppercase tracking-[4px] text-[#9c741d] font-mono font-black block">CulturX Product System</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-950 uppercase font-display tracking-tight leading-none">
            Internal Order.<br />
            <span className="text-[#a5801e]">External Excellence.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteData.products.slice(0, 5).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-[#9c741d]/30 hover:border-[#d4af37] shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <span className="text-[9.5px] font-bold font-mono tracking-wider text-[#9c741d] bg-[#fdfaf2] border border-[#9c741d]/20 px-3 py-1 rounded-full uppercase block w-fit mb-3">
                  {prod.category}
                </span>

                {/* Product visualization based on CMS upload or fallback */}
                {prod.imageUrl && (
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-[#9c741d]/10 bg-slate-50 mb-4 group shadow-xs">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <h3 className="text-lg font-black font-display text-neutral-950 uppercase mb-2">
                  {prod.name}
                </h3>
                <p className="text-xs text-zinc-600 mb-4 font-sans leading-relaxed">
                  {prod.description}
                </p>
                <ul className="text-xs text-zinc-700 space-y-2 border-t border-zinc-100 pt-4 mb-4">
                  {prod.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 mr-2 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 font-mono tracking-widest block">IDENTIFIER</span>
                  <span className="text-xs font-bold text-zinc-500 font-mono">{prod.sku}</span>
                </div>
                <div>
                  {prod.isComingSoon ? (
                    <span className="text-xs font-semibold text-[#aa8612] bg-yellow-100 px-4 py-2 rounded-full font-mono">
                      Coming Soon
                    </span>
                  ) : (
                    <span className="text-sm font-extrabold text-neutral-950 font-mono">
                      {prod.salePriceVal !== undefined && prod.salePriceVal !== null ? (
                        <>
                          <span className="line-through text-zinc-400 mr-2">${prod.priceVal}</span>
                          <span className="text-emerald-600">${prod.salePriceVal} USD</span>
                        </>
                      ) : (
                        `$${prod.priceVal} USD`
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
