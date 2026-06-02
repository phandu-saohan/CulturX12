'use client';
import React from 'react';
import { CheckSquare, HelpCircle, Sparkles, Globe, FileText, Layers, Settings, BookOpen, PlusCircle } from 'lucide-react';
import { CulturXData } from '@/lib/initialData';

type PageSeo = { title: string; description: string; canonicalUrl: string; };

interface SeoTabProps {
  siteData: CulturXData;
  seoChecklist: Record<string, boolean>;
  toggleSeoCheck: (key: string) => void;
  seoPages: Record<'home' | 'shop' | 'articles', PageSeo>;
  handleUpdatePageSeo: (pageKey: 'home' | 'shop' | 'articles', field: keyof PageSeo, value: string) => void;
  showToast: (msg: string) => void;
}

export default function SeoTab({ siteData, seoChecklist, toggleSeoCheck, seoPages, handleUpdatePageSeo, showToast }: SeoTabProps) {
  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-[10px] uppercase tracking-[4px] text-indigo-600 font-mono font-bold block mb-1">CULTURX™ SUITE</span>
        <h2 className="text-xl font-bold uppercase text-slate-950 tracking-widest font-display">SEO Verification & Google Setup Checklist</h2>
        <p className="text-xs text-slate-500">Monitor and compile search visibility indices, verify Google Analytics pipelines, configure Webmaster profiles and legal terms.</p>
      </div>

      {/* Progress Summary */}
      {(() => {
        const checkedCount = Object.values(seoChecklist).filter(Boolean).length;
        const totalCount = Object.keys(seoChecklist).length;
        const percentage = Math.round((checkedCount / totalCount) * 100);
        return (
          <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center space-x-2 text-brand-gold">
                <Sparkles className="w-5 h-5 text-brand-gold animate-pulse animate-duration-1000" />
                <h3 className="text-xs font-black uppercase tracking-widest">SEO Content Optimization Level</h3>
              </div>
              <p className="text-2xl font-black font-display text-white">
                {checkedCount} / {totalCount} Parameters <span className="text-brand-gold">({percentage}%)</span>
              </p>
              <p className="text-xs text-slate-400">
                Active metadata headers have successfully compiled against the routing components!
              </p>
            </div>
            <div className="w-full md:w-64 space-y-1">
              <div className="flex justify-between text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                <span>Checklist coverage percentage</span>
                <span>{percentage}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
        
        {/* Left Side: Checklists grouped */}
        <div className="xl:col-span-8 space-y-6">

          {/* SEO Content Audit Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-xs border-t-4 border-t-[#d4af37]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <Globe className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d4af37] font-display">SEO Content Audit</h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 font-mono tracking-wider font-bold py-1 px-2.2 rounded-full uppercase">
                Site-Wide Meta Diagnostics
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Audit and define search visibility metadata across core operational directories. Updates propagate instantly to corresponding crawler indices.
            </p>

            <div className="space-y-6 pt-2">
              {(['home', 'shop', 'articles'] as const).map((pageKey) => {
                const pageData = seoPages[pageKey];
                const titleCount = pageData.title.length;
                const descCount = pageData.description.length;
                const pageLabel = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

                return (
                  <div key={pageKey} className="bg-slate-50 border border-slate-200/85 rounded-2xl p-4.5 space-y-4 transition-all duration-200 hover:border-indigo-200/80">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4.5 h-4.5 text-slate-500" />
                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-mono">
                          {pageLabel} Page Path
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase bg-slate-200/50 px-2 py-0.5 rounded-sm">
                        {pageKey === 'home' ? '/' : `/${pageKey}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-xs">
                      {/* Title Input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          <label htmlFor={`seo-title-${pageKey}`}>Browser Title Tag</label>
                          <span className={`${titleCount > 60 ? 'text-amber-600 font-bold' : 'text-slate-400 font-medium'}`}>
                            {titleCount}/60 chars
                          </span>
                        </div>
                        <input
                          id={`seo-title-${pageKey}`}
                          type="text"
                          value={pageData.title}
                          onChange={(e) => handleUpdatePageSeo(pageKey, 'title', e.target.value)}
                          placeholder="Define compelling browser title..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow focus:shadow-sm"
                        />
                      </div>

                      {/* Meta Description Input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          <label htmlFor={`seo-desc-${pageKey}`}>Meta Description Tag (SERP Snippet)</label>
                          <span className={`${descCount > 160 ? 'text-amber-630 font-bold' : 'text-slate-400 font-medium'}`}>
                            {descCount}/160 chars
                          </span>
                        </div>
                        <textarea
                          id={`seo-desc-${pageKey}`}
                          rows={4}
                          value={pageData.description}
                          onChange={(e) => handleUpdatePageSeo(pageKey, 'description', e.target.value)}
                          placeholder="Formulate description summarizing the core directory target..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow focus:shadow-sm leading-relaxed"
                        />
                      </div>

                      {/* Canonical URL Input */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          <label htmlFor={`seo-canonical-${pageKey}`}>Primary Canonical URL</label>
                          <span className="text-slate-400 lowercase font-mono">
                            rel=&quot;canonical&quot;
                          </span>
                        </div>
                        <input
                          id={`seo-canonical-${pageKey}`}
                          type="text"
                          value={pageData.canonicalUrl}
                          onChange={(e) => handleUpdatePageSeo(pageKey, 'canonicalUrl', e.target.value)}
                          placeholder="https://culturx.com.au/..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow focus:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Category 1: Website SEO Basics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <CheckSquare className="w-5 h-5 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">1. Website SEO Basics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'title', label: 'Assign browser Page Titles across layouts' },
                { key: 'metaDesc', label: 'Submit optimal header Meta Descriptions' },
                { key: 'headings', label: 'Audit tactical Heading elements (H1, H2, H3)' },
                { key: 'internalLinks', label: 'Strengthen multi-lateral internal linking patterns' },
                { key: 'imgSizes', label: 'Optimize image dimensions and transfer speeds' },
                { key: 'https', label: 'Mandate secure layer certificates SSL / HTTPS' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={seoChecklist[item.key] || false}
                    onChange={() => toggleSeoCheck(item.key)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category 2: Homepage SEO & Suggested Keywords */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <Layers className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">2. Homepage SEO & Verification</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Page Title</span>
                  <span className="text-green-600 font-black text-[9px] bg-green-50 px-1.5 py-0.5 rounded">ONLINE</span>
                </div>
                <p className="font-mono font-bold text-slate-800 text-sm">CULTURX™ | Internal. External. Optimized.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Meta Description</span>
                  <span className="text-green-600 font-black text-[9px] bg-green-50 px-1.5 py-0.5 rounded">ONLINE</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-sans">
                  CULTURX™ is a premium human optimization ecosystem combining precision-fermented kombucha, targeted supplements, clinical bodywork and concierge recovery for elite human performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {[
                  { key: 'homepageTitle', label: 'Verify Homepage Title is setup in Layout' },
                  { key: 'homepageDesc', label: 'Verify Homepage Meta Description in Layout' }
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                  >
                    <input 
                      type="checkbox" 
                      checked={seoChecklist[item.key] || false}
                      onChange={() => toggleSeoCheck(item.key)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Category 3: Image Alt Text Requirements */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <HelpCircle className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">3. Image Alt Text & Description Requirements</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'altTags', label: 'Add Alt Text to every image resource' },
                { key: 'altProducts', label: 'Describe products clearly with alt text' },
                { key: 'altBodyworks', label: 'Describe specialized bodywork treatment imagery' },
                { key: 'altGeom', label: 'Describe geometric and biotech tech visuals' },
                { key: 'altKeywords', label: 'Use natural keywords in image alt attribute tags' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={seoChecklist[item.key] || false}
                    onChange={() => toggleSeoCheck(item.key)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category 4: Google Connections */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 animate-spin-slow" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">4. Google Infrastructure Setup</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'ga4', label: 'Link up Google Analytics 4 (GA4 Tracking ID)' },
                { key: 'searchConsole', label: 'Submit URL verification keys under Google Search Console' },
                { key: 'domainVerify', label: 'Configure Domain Ownership record via DNS TXT keys' },
                { key: 'sitemap', label: 'Publish and index XML schema sitemap structures' },
                { key: 'indexing', label: 'Queue page indexes under central crawling crawlers' },
                { key: 'tagManager', label: 'Setup Google Tag Manager - GTM (Optional)' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={seoChecklist[item.key] || false}
                    onChange={() => toggleSeoCheck(item.key)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category 5: Performance & Mobile Compliance & Legal */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">5. Performance, Legal & Guidelines compliance</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'mobileResponsive', label: 'Fully mobile viewport adaptive layout styling' },
                { key: 'compressImg', label: 'Compress and optimize images for WebP performance' },
                { key: 'minimizePlugins', label: 'Minimize external script resources to reduce latency' },
                { key: 'pageSpeed', label: 'Maximize Core Web Vitals rating targets using cache' },
                { key: 'smoothScroll', label: 'Leverage smooth scroll viewport interactions' },
                { key: 'privacyPolicy', label: 'Draft and display clear Privacy Protection policies' },
                { key: 'termsConditions', label: 'Publish legal Terms and Conditions of platform usage' },
                { key: 'refundPolicy', label: 'Specify explicit Refund, Return and Return policies' },
                { key: 'disclaimer', label: 'Integrate transparent clinical liability disclaimer widgets' },
                { key: 'accessibility', label: 'Integrate full Accessibility Statement layouts' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={seoChecklist[item.key] || false}
                    onChange={() => toggleSeoCheck(item.key)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category 6: Future SEO Expansion */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <PlusCircle className="w-5 h-5 text-indigo-550" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">6. Future expansion roadmap</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                { key: 'blogSystem', label: 'Integrate robust clinical blogs and article indexes' },
                { key: 'schemaMarkup', label: 'Configure full structured Schema JSON-LD structured markups' },
                { key: 'optimizeProductPages', label: 'Optimize dynamic metadata for specific catalog entries' },
                { key: 'melbourneLcl', label: 'Localize organic search signals in Victoria state / Melbourne region' },
                { key: 'ecommerceSeo', label: 'Implement advanced shopping feeds for Google Merchant networks' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  className="flex items-start space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs"
                >
                  <input 
                    type="checkbox" 
                    checked={seoChecklist[item.key] || false}
                    onChange={() => toggleSeoCheck(item.key)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Tools, Copyable Assets & Brand Guidelines */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Brand Guidelines Card */}
          <div className="bg-slate-950 text-white border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl text-left">
            <span className="text-[9px] font-mono tracking-[4px] text-brand-gold uppercase block">Brand Architecture Rules</span>
            <h3 className="text-md font-bold font-display uppercase tracking-wider text-white border-b border-neutral-900 pb-2">Important Brand Notes</h3>
            
            <ul className="space-y-4 text-xs text-zinc-400 font-sans">
              <li className="flex items-start space-x-2">
                <span className="text-brand-gold">✦</span>
                <span>Always spell with **&quot;Optimized&quot;** terminating with a **&quot;Z&quot;** rather than the fallback Commonwealth spelling (keep consistent with standard CULTURX branding specifications).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brand-gold">✦</span>
                <span>Uphold the critical thematic pairing between the **BLACK SYSTEM** (engineered performance, activation, vital action, and somatic endurance) and the **WHITE SYSTEM** (clinical intelligence, regulation, bio-precision, and restoration).</span>
              </li>
            </ul>
          </div>

          {/* Suggested SEO Keywords Copy Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs text-left">
            <h3 className="text-[11px] font-mono tracking-widest uppercase text-slate-450 border-b pb-2">SUGGESTED SEO KEYWORDS</h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'CULTURX', 'kombucha', 'gut health', 'clinical bodywork', 'wellness concierge',
                'elite human performance', 'precision fermentation', 'biohacking', 
                'microbiome optimization', 'supplements', 'recovery'
              ].map((tag) => (
                <span 
                  key={tag} 
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(tag);
                      showToast(`Copied keyword: ${tag}`);
                    }
                  }}
                  className="bg-slate-100 border border-slate-200 hover:border-slate-300 hover:bg-slate-150 transition-all font-mono font-semibold text-[10px] text-slate-700 px-2.2 py-1 rounded-md cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-450 mt-2">Click any keyword element to seamlessly copy it into your system clipboard for draft integration.</p>
          </div>

          {/* Schema Marker & Sitemap Generator Utility */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs text-left">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b pb-2">Tools & Code Generators</h3>
            <p className="text-xs text-slate-500 leading-normal">
              The workspace automatically builds structured sitemap endpoints dynamically derived from the active system product index:
            </p>
            
            <button
              onClick={() => {
                const dynamicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://culturx.com.au/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://culturx.com.au/#manifesto</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://culturx.com.au/#duality</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://culturx.com.au/#ecosystem</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://culturx.com.au/#shop</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  ${siteData.products.map(p => `  <url>
    <loc>https://culturx.com.au/products/${p.sku.toLowerCase()}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n  ')}
</urlset>`;
                const blob = new Blob([dynamicSitemap], { type: 'text/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sitemap.xml';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast("Successfully compiled and downloaded sitemap.xml!");
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Get Dynamic Sitemap.xml</span>
            </button>

            <button
              onClick={() => {
                const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://culturx.com.au/sitemap.xml`;
                const blob = new Blob([robotsTxt], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'robots.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast("Successfully downloaded robots.txt configuration!");
              }}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase transition flex items-center justify-center space-x-1 cursor-pointer"
            >
              <span>Get Robots.txt File</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
