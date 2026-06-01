'use client';
import React from 'react';
import { Info } from 'lucide-react';
import { CulturXData, Product } from '@/lib/initialData';

interface ShopSectionProps {
  siteData: CulturXData;
  onAddToCart: (product: Product) => void;
  onViewProductSeo: (product: Product) => void;
}

export default function ShopSection({ siteData, onAddToCart, onViewProductSeo }: ShopSectionProps) {
  return (
    <section id="shop" className="bg-[#050505] py-12 px-6 lg:px-24 border-t border-brand-line/30 scroll-mt-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="max-w-4xl">
          <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block mb-2">Shop CulturX</span>
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white tracking-wide">
            Operational From Launch.<br />
            <span className="text-brand-gold">Built to Sell the System.</span>
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm mt-3 leading-relaxed max-w-2xl">
            This section is fully integrated. If a product is marked as ready for sale (i.e. updated in the CMS with pricing), visitors can click &quot;Configure Order&quot; to purchase dynamically. Keep items marked as &quot;Coming Soon&quot; or set prices to enable direct shopping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {siteData.products.map((prod) => (
            <div
              key={prod.id}
              className="bg-neutral-950 border border-brand-line/50 hover:border-brand-gold/80 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SKU: {prod.sku}</span>
                  <span className="text-[10px] text-brand-gold font-bold font-mono bg-brand-gold/10 px-2 py-1 rounded-md border border-brand-line/20">{prod.category}</span>
                </div>

                {/* Product visualization based on CMS upload or fallback */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-900/40 group">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900/60 text-zinc-600 font-mono text-[10px] uppercase">
                      No Image Loaded
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-white uppercase">{prod.name}</h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed h-14 overflow-hidden text-ellipsis">
                    {prod.description}
                  </p>
                </div>

                <div className="border-t border-neutral-900 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase font-mono">Costing Structure</span>
                    <p className="text-sm font-bold text-brand-gold font-mono">
                      {prod.isComingSoon ? 'Price TBC' : `$${prod.priceVal} USD`}
                    </p>
                  </div>
                  <button
                    onClick={() => onViewProductSeo(prod)}
                    className="text-[10px] text-brand-gold font-mono hover:underline uppercase flex items-center space-x-1 cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-brand-gold" />
                    <span>SEO Analytics</span>
                  </button>
                </div>
              </div>

              <div className="pt-6">
                {prod.isComingSoon ? (
                  <button
                    disabled
                    className="w-full py-3 bg-neutral-900 border border-brand-line/30 text-zinc-500 rounded-full text-xs font-bold uppercase tracking-wider cursor-not-allowed text-center"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={() => onAddToCart(prod)}
                    className="w-full py-3 bg-brand-gold text-brand-black hover:bg-white hover:text-brand-black rounded-full text-xs font-black uppercase tracking-wider text-center transition"
                  >
                    Configure Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
