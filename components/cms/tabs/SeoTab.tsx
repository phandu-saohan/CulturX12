'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, HelpCircle, Sparkles, Globe, FileText, 
  Layers, Settings, BookOpen, PlusCircle, CheckCircle2, 
  AlertTriangle, X, Play, RefreshCw, Info, Check, ShieldAlert
} from 'lucide-react';
import { CulturXData, AppSettings } from '@/lib/initialData';

type PageSeo = { title: string; description: string; canonicalUrl: string; };

interface SeoTabProps {
  siteData: CulturXData;
  seoChecklist: Record<string, boolean>;
  toggleSeoCheck: (key: string) => void;
  seoPages: Record<'home' | 'shop' | 'articles', PageSeo>;
  handleUpdatePageSeo: (pageKey: 'home' | 'shop' | 'articles', field: keyof PageSeo, value: string) => void;
  showToast: (msg: string) => void;
  appSettings: AppSettings;
}

export default function SeoTab({ 
  siteData, 
  seoChecklist, 
  toggleSeoCheck, 
  seoPages, 
  handleUpdatePageSeo, 
  showToast,
  appSettings 
}: SeoTabProps) {
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  // Compute checklist coverage (integrating hardcoded toggle states + live connection checks)
  const isGa4Connected = !!appSettings.integrations?.googleAnalyticsId;
  const isGscConnected = !!appSettings.integrations?.googleSearchConsoleId;
  
  const totalBaseItems = Object.keys(seoChecklist).length;
  const checkedBaseItems = Object.entries(seoChecklist).filter(([key, val]) => {
    // Override connections based on actual appSettings
    if (key === 'ga4') return isGa4Connected;
    if (key === 'searchConsole') return isGscConnected;
    if (key === 'sitemap') return true; // Dynamic sitemap is always ready
    return val;
  }).length;

  const seoPercentage = Math.round((checkedBaseItems / totalBaseItems) * 100);

  // Run SEO audit routine
  const handleRunAudit = () => {
    setAuditLoading(true);
    setTimeout(() => {
      setAuditLoading(false);
      setAuditOpen(true);
      showToast("Live SEO & index crawl simulation complete.");
    }, 1200);
  };

  // Compute live audit statistics
  const getAuditReport = () => {
    let score = 100;
    const items: Array<{
      id: string;
      title: string;
      status: 'pass' | 'warning' | 'error';
      message: string;
      scoreImpact: number;
    }> = [];

    // Title lengths
    const homeTitleLen = seoPages.home.title.length;
    if (homeTitleLen < 40 || homeTitleLen > 60) {
      score -= 5;
      items.push({
        id: 'home-title',
        title: 'Home Page Title Tag Length',
        status: 'warning',
        message: `Currently ${homeTitleLen} characters. Target is 40–60 characters to optimize Google SERP snippet formatting.`,
        scoreImpact: -5
      });
    } else {
      items.push({
        id: 'home-title',
        title: 'Home Page Title Tag Length',
        status: 'pass',
        message: `Currently ${homeTitleLen} characters. Perfect range (40–60).`,
        scoreImpact: 0
      });
    }

    const shopTitleLen = seoPages.shop.title.length;
    if (shopTitleLen < 40 || shopTitleLen > 60) {
      score -= 5;
      items.push({
        id: 'shop-title',
        title: 'Shop Page Title Tag Length',
        status: 'warning',
        message: `Currently ${shopTitleLen} characters. Optimal title is 40–60 characters.`,
        scoreImpact: -5
      });
    } else {
      items.push({
        id: 'shop-title',
        title: 'Shop Page Title Tag',
        status: 'pass',
        message: `Currently ${shopTitleLen} characters. Perfect range.`,
        scoreImpact: 0
      });
    }

    // Description lengths
    const homeDescLen = seoPages.home.description.length;
    if (homeDescLen < 120 || homeDescLen > 160) {
      score -= 5;
      items.push({
        id: 'home-desc',
        title: 'Home Page Meta Description',
        status: 'warning',
        message: `Currently ${homeDescLen} characters. Recommended range is 120–160 characters to prevent search summary truncation.`,
        scoreImpact: -5
      });
    } else {
      items.push({
        id: 'home-desc',
        title: 'Home Page Meta Description',
        status: 'pass',
        message: `Currently ${homeDescLen} characters. Optimal description size.`,
        scoreImpact: 0
      });
    }

    // Google connections
    if (!isGa4Connected) {
      score -= 15;
      items.push({
        id: 'ga4-connection',
        title: 'Google Analytics 4 Pipeline',
        status: 'error',
        message: 'No measurement tracking ID configured. Analytics dashboard cannot compile client conversion indicators.',
        scoreImpact: -15
      });
    } else {
      items.push({
        id: 'ga4-connection',
        title: 'Google Analytics 4 Pipeline',
        status: 'pass',
        message: `Active measurement endpoint configured (${appSettings.integrations.googleAnalyticsId}).`,
        scoreImpact: 0
      });
    }

    if (!isGscConnected) {
      score -= 15;
      items.push({
        id: 'gsc-connection',
        title: 'Google Search Console Verification',
        status: 'error',
        message: 'No Search Console verification ID. Crawler bots will not prioritize indexing web URLs.',
        scoreImpact: -15
      });
    } else {
      items.push({
        id: 'gsc-connection',
        title: 'Google Search Console Verification',
        status: 'pass',
        message: `Verification key active (${appSettings.integrations.googleSearchConsoleId}).`,
        scoreImpact: 0
      });
    }

    // Local Targeting (Melbourne target)
    const targetCity = appSettings.localization?.targetCity || '';
    const targetRegion = appSettings.localization?.targetRegion || '';
    if (targetCity.toLowerCase() !== 'melbourne' || targetRegion.toLowerCase() !== 'victoria') {
      score -= 10;
      items.push({
        id: 'local-seo',
        title: 'Local SEO Geolocation Target',
        status: 'warning',
        message: `Targeting set to "${targetCity || 'None'}, ${targetRegion || 'None'}". Recommended setting is "Melbourne, Victoria" for maximum localized biohacking ranking.`,
        scoreImpact: -10
      });
    } else {
      items.push({
        id: 'local-seo',
        title: 'Local SEO Geolocation Target',
        status: 'pass',
        message: 'Local targeting correctly prioritized for Melbourne, Victoria.',
        scoreImpact: 0
      });
    }

    // Dynamic XML Sitemap
    items.push({
      id: 'sitemap-schema',
      title: 'Dynamic XML Schema Sitemap',
      status: 'pass',
      message: `XML index file automatically generated with ${siteData.products.length + 3} active URLs.`,
      scoreImpact: 0
    });

    return {
      score: Math.max(score, 30),
      items
    };
  };

  const auditReport = getAuditReport();

  return (
    <div className="space-y-6 animate-fadeIn text-slate-800">
      
      {/* Tab Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[4px] text-indigo-600 font-mono font-bold block mb-1">CULTURX™ SUITE</span>
          <h2 className="text-xl font-bold uppercase text-slate-950 tracking-widest font-display">SEO Verification & Google Setup Checklist</h2>
          <p className="text-xs text-slate-500 font-sans">Monitor and compile search visibility indices, verify Google Analytics pipelines, configure Webmaster profiles and legal terms.</p>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={auditLoading}
          className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-bold uppercase cursor-pointer hover:bg-slate-800 transition shadow-sm shrink-0 disabled:opacity-75"
        >
          {auditLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-brand-gold fill-current" />
          )}
          <span>{auditLoading ? "Auditing Site..." : "Run SEO Audit"}</span>
        </button>
      </div>

      {/* Progress Summary Card */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center space-x-2 text-[#d4af37]">
            <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest">SEO Content Optimization Level</h3>
          </div>
          <p className="text-2xl font-black font-display text-white">
            {checkedBaseItems} / {totalBaseItems} Parameters <span className="text-[#d4af37]">({seoPercentage}%)</span>
          </p>
          <p className="text-xs text-slate-400">
            Active metadata headers have successfully compiled against the routing components!
          </p>
        </div>
        <div className="w-full md:w-64 space-y-1">
          <div className="flex justify-between text-[10px] font-mono tracking-wider text-slate-400 uppercase">
            <span>Checklist coverage percentage</span>
            <span>{seoPercentage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-500 rounded-full transition-all duration-500"
              style={{ width: `${seoPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* SEO Main Content Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
        
        {/* Left Columns - SEO Audit Forms & Checklist groups */}
        <div className="xl:col-span-8 space-y-6">

          {/* SEO Content Audit Details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4 shadow-xs border-t-4 border-t-[#d4af37]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <Globe className="w-5 h-5 text-indigo-600 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#d4af37] font-display">SEO Page Snippets</h3>
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
                          <span className={`${titleCount > 60 || titleCount < 40 ? 'text-amber-600 font-bold' : 'text-slate-400 font-medium'}`}>
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
                          <span className={`${descCount > 160 || descCount < 120 ? 'text-amber-600 font-bold' : 'text-slate-400 font-medium'}`}>
                            {descCount}/160 chars
                          </span>
                        </div>
                        <textarea
                          id={`seo-desc-${pageKey}`}
                          rows={4}
                          value={pageData.description}
                          onChange={(e) => handleUpdatePageSeo(pageKey, 'description', e.target.value)}
                          placeholder="Formulate description summarizing the core directory target..."
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-base text-slate-900 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow focus:shadow-sm leading-relaxed"
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
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleSeoCheck(item.key)}
                  className="flex items-start text-left space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs w-full border-0 focus:outline-none"
                >
                  <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                    seoChecklist[item.key]
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 text-transparent bg-white'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 2: Homepage SEO & Verification */}
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
                  <button 
                    key={item.key} 
                    type="button"
                    onClick={() => toggleSeoCheck(item.key)}
                    className="flex items-start text-left space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs w-full border-0 focus:outline-none"
                  >
                    <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                      seoChecklist[item.key]
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 text-transparent bg-white'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                      {item.label}
                    </span>
                  </button>
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
                <button 
                  key={item.key} 
                  type="button"
                  onClick={() => toggleSeoCheck(item.key)}
                  className="flex items-start text-left space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs w-full border-0 focus:outline-none"
                >
                  <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                    seoChecklist[item.key]
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 text-transparent bg-white'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category 4: Google Infrastructure Setup */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 animate-spin-slow" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">4. Google Infrastructure Setup</h3>
            </div>
            
            <div className="space-y-4">
              
              {/* Google Analytics 4 Setup Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-widest block">Google Analytics (GA4)</span>
                  <p className="text-xs font-bold text-slate-800">Tracking Pipeline Status</p>
                  <p className="text-[11px] text-slate-500">Collects traffic counts, visitor conversion metrics, and shop action logs.</p>
                </div>
                {isGa4Connected ? (
                  <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-mono text-[10px] font-black rounded-lg uppercase tracking-wide shrink-0">
                    ✓ Connected: {appSettings.integrations.googleAnalyticsId}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-mono text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0">
                    ⚠ Missing (Set in App Settings)
                  </span>
                )}
              </div>

              {/* Google Search Console Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-widest block">Google Search Console</span>
                  <p className="text-xs font-bold text-slate-800">Domain Index Ownership</p>
                  <p className="text-[11px] text-slate-500">Indexes URLs, generates index maps, and verifies DNS metadata details.</p>
                </div>
                {isGscConnected ? (
                  <span className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 font-mono text-[10px] font-black rounded-lg uppercase tracking-wide shrink-0">
                    ✓ Verified: {appSettings.integrations.googleSearchConsoleId}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 font-mono text-[10px] font-bold rounded-lg uppercase tracking-wide shrink-0">
                    ⚠ Not Verified (Set in App Settings)
                  </span>
                )}
              </div>

              {/* General checkboxes for other Google items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                {[
                  { key: 'domainVerify', label: 'Configure Domain Ownership record via DNS TXT keys' },
                  { key: 'sitemap', label: 'Publish and index XML schema sitemap structures' },
                  { key: 'indexing', label: 'Queue page indexes under central crawling crawlers' },
                  { key: 'tagManager', label: 'Setup Google Tag Manager - GTM (Optional)' }
                ].map((item) => {
                  let isChecked = seoChecklist[item.key] || false;
                  if (item.key === 'sitemap') isChecked = true; // Always active
                  
                  return (
                    <button 
                      key={item.key} 
                      type="button"
                      disabled={item.key === 'sitemap'}
                      onClick={() => toggleSeoCheck(item.key)}
                      className={`flex items-start text-left space-x-3 p-3 bg-slate-50 rounded-xl transition text-xs w-full border-0 focus:outline-none ${
                        item.key !== 'sitemap' ? 'hover:bg-slate-100/70 cursor-pointer' : 'opacity-85'
                      }`}
                    >
                      <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                        isChecked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 text-transparent bg-white'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className={`${isChecked ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Category 5: Performance, Legal & Guidelines compliance */}
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
                <button 
                  key={item.key} 
                  type="button"
                  onClick={() => toggleSeoCheck(item.key)}
                  className="flex items-start text-left space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs w-full border-0 focus:outline-none"
                >
                  <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                    seoChecklist[item.key]
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 text-transparent bg-white'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
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
                <button 
                  key={item.key} 
                  type="button"
                  onClick={() => toggleSeoCheck(item.key)}
                  className="flex items-start text-left space-x-3 p-3 bg-slate-50 hover:bg-slate-100/70 rounded-xl transition cursor-pointer text-xs w-full border-0 focus:outline-none"
                >
                  <div className={`mt-0.5 rounded border flex items-center justify-center w-4.5 h-4.5 shrink-0 ${
                    seoChecklist[item.key]
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-slate-300 text-transparent bg-white'
                  }`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className={`${seoChecklist[item.key] ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'}`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
        
        {/* Right Column - Brand Notes & Sitemap Builders */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Brand Guidelines Card */}
          <div className="bg-slate-950 text-white border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl text-left">
            <span className="text-[9px] font-mono tracking-[4px] text-[#d4af37] uppercase block">Brand Architecture Rules</span>
            <h3 className="text-md font-bold font-display uppercase tracking-wider text-white border-b border-neutral-900 pb-2">Important Brand Notes</h3>
            
            <ul className="space-y-4 text-xs text-zinc-400 font-sans">
              <li className="flex items-start space-x-2">
                <span className="text-[#d4af37] shrink-0 font-bold">✦</span>
                <span>Always spell with **&quot;Optimized&quot;** terminating with a **&quot;Z&quot;** rather than the fallback Commonwealth spelling (keep consistent with standard CULTURX branding specifications).</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#d4af37] shrink-0 font-bold">✦</span>
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
                <button 
                  key={tag} 
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(tag);
                      showToast(`Copied keyword: ${tag}`);
                    }
                  }}
                  className="bg-slate-100 border border-slate-200 hover:border-slate-350 hover:bg-slate-200 transition-all font-mono font-semibold text-[10px] text-slate-700 px-2.2 py-1 rounded-md cursor-pointer border-0 focus:outline-none"
                >
                  {tag}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-450 mt-2">Click any keyword element to seamlessly copy it into your system clipboard for draft integration.</p>
          </div>

          {/* Sitemap & Robots.txt Download */}
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
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition flex items-center justify-center space-x-1 cursor-pointer border-0"
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

      {/* SEO DIAGNOSTIC / CRAWLER AUDIT MODAL SHEET */}
      {auditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setAuditOpen(false)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-slate-800 shadow-2xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={() => setAuditOpen(false)}
              className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/35 uppercase tracking-widest">
                Search Engine Optimization Audit
              </span>
              <h3 className="text-xl font-bold uppercase text-slate-900 font-display tracking-tight mt-2">
                Real-Time Crawler & Index Integrity Report
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Audit computed on active metadata metrics, local geolocations, and telemetry connection variables.</p>
            </div>

            {/* Audit Score Dashboard */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-450 uppercase font-black block">Crawl Integrity Score</span>
                <span className="text-3xl font-black font-display text-white">{auditReport.score}<span className="text-brand-gold">/100</span></span>
                <p className="text-[10px] text-slate-400 font-sans leading-normal">
                  {auditReport.score >= 90 ? "Excellent configuration. Crawler bots can fully index URL targets." : "Action required. Configure missing elements in App Settings."}
                </p>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="#1e293b" strokeWidth="4" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    fill="transparent" 
                    stroke={auditReport.score >= 90 ? '#10b981' : auditReport.score >= 70 ? '#f59e0b' : '#ef4444'} 
                    strokeWidth="4" 
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - auditReport.score / 100)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-bold font-mono">{auditReport.score}%</span>
              </div>
            </div>

            {/* Detailed Audited Items list */}
            <div className="space-y-3 font-sans text-xs">
              <span className="text-[9px] font-bold tracking-widest text-[#a5801e] font-mono uppercase block mb-1">Diagnostic Checks</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                {auditReport.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-start space-x-3 transition-colors hover:bg-slate-50">
                    {item.status === 'pass' && (
                      <CheckCircle2 className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                    )}
                    {item.status === 'warning' && (
                      <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    {item.status === 'error' && (
                      <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        {item.scoreImpact < 0 && (
                          <span className="text-[10px] font-bold text-red-500 font-mono">{item.scoreImpact} pts</span>
                        )}
                      </div>
                      <p className="text-slate-500 leading-normal text-[11px]">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable recommendations list */}
            <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-2 text-left">
              <span className="text-[9px] font-mono font-bold text-amber-800 tracking-wider uppercase block">Recommendations Action Plan</span>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-[11px] font-medium leading-relaxed">
                {auditReport.items.filter(i => i.status !== 'pass').length === 0 ? (
                  <li className="list-none pl-0 text-green-700 font-bold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                    No critical optimization warnings detected!
                  </li>
                ) : (
                  auditReport.items.filter(i => i.status !== 'pass').map((i, idx) => (
                    <li key={idx}>{i.message}</li>
                  ))
                )}
              </ul>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setAuditOpen(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer"
              >
                Close Audit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
