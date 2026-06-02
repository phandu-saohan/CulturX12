'use client';
import React, { useState } from 'react';
import { CulturXData } from '@/lib/initialData';

interface ContentTabProps {
  siteData: CulturXData;
  onSaveSiteData: (newData: CulturXData) => void;
  showToast: (msg: string) => void;
}

export default function ContentTab({ siteData, onSaveSiteData, showToast }: ContentTabProps) {
  const [editedHero, setEditedHero] = useState(siteData.hero);
  const [editedManifesto, setEditedManifesto] = useState(siteData.manifesto);
  const [editedBlackSystem, setEditedBlackSystem] = useState(siteData.blackSystem);
  const [editedWhiteSystem, setEditedWhiteSystem] = useState(siteData.whiteSystem);
  const [editedExhale, setEditedExhale] = useState(siteData.exhaleWork);
  const [editedContact, setEditedContact] = useState(siteData.contact);
  const [editedBodyworks, setEditedBodyworks] = useState(siteData.bodyworks);
  const [editedEcosystem, setEditedEcosystem] = useState(siteData.ecosystem);

  const defaultVisibility = {
    hero: true,
    manifesto: true,
    duality: true,
    ecosystem: true,
    products: true,
    shop: true,
    bodyworks: true,
    exhaleWork: true,
    concierge: true,
    philosophy: true,
    vault: true,
    articles: true,
    contact: true
  };

  const [editedVisibility, setEditedVisibility] = useState({
    ...defaultVisibility,
    ...siteData.sectionVisibility
  });

  const sectionLabels = {
    hero: "Hero Banner (Top)",
    manifesto: "Manifesto Section",
    duality: "Dual Split Systems",
    ecosystem: "Ecosystem Bento",
    products: "Product System View",
    shop: "Interactive Storefront",
    bodyworks: "Clinical Bodyworks",
    exhaleWork: "ExhaleWork™ Block",
    concierge: "Recovery Concierge",
    philosophy: "Core Philosophy",
    vault: "The Vault Section",
    articles: "Medical Articles",
    contact: "Contact Form"
  };

  const handleToggleVisibility = (key: keyof typeof defaultVisibility) => {
    setEditedVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveVisibility = () => {
    const updatedData: CulturXData = {
      ...siteData,
      sectionVisibility: { ...editedVisibility }
    };
    onSaveSiteData(updatedData);
    showToast("Saved section visibility configuration successfully");
  };

  const handleSaveTextBlocks = (section: 'hero' | 'manifesto' | 'systems' | 'exhale' | 'contact' | 'bodyworks' | 'ecosystem') => {
    const updatedData: CulturXData = { ...siteData };

    if (section === 'hero') {
      updatedData.hero = { ...editedHero };
    } else if (section === 'manifesto') {
      updatedData.manifesto = { ...editedManifesto };
    } else if (section === 'systems') {
      updatedData.blackSystem = { ...editedBlackSystem };
      updatedData.whiteSystem = { ...editedWhiteSystem };
    } else if (section === 'exhale') {
      updatedData.exhaleWork = { ...editedExhale };
    } else if (section === 'contact') {
      updatedData.contact = { ...editedContact };
    } else if (section === 'bodyworks') {
      updatedData.bodyworks = { ...editedBodyworks };
    } else if (section === 'ecosystem') {
      updatedData.ecosystem = { ...editedEcosystem };
    }

    onSaveSiteData(updatedData);
    showToast(`Saved text changes for [${section.toUpperCase()}] successfully`);
  };

  return (
    <div className="space-y-8">
      {/* 2.0 Section Visibility Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-white">⚙️ Section Visibility / Toggle Homepage Sections</h3>
            <p className="text-xs text-slate-400">Show or hide different content sections dynamically on the homepage.</p>
          </div>
          <button 
            onClick={handleSaveVisibility}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-indigo-500/20 shrink-0 text-center"
          >
            Save Visibility
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {Object.entries(sectionLabels).map(([key, label]) => {
            const isVisible = editedVisibility[key as keyof typeof editedVisibility] !== false;
            return (
              <div key={key} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between hover:border-slate-800 transition">
                <div className="space-y-1 pr-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-widest block">Section</span>
                  <h4 className="text-xs font-bold text-white uppercase">{label}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(key as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition cursor-pointer ${
                    isVisible
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-rose-900 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isVisible ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-950 tracking-widest font-display">Prism Section Content Editor</h2>
        <p className="text-xs text-slate-500">Manipulate general copywriting placeholders deployed across the front page.</p>
      </div>

      {/* 2.1 Hero Content */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">H1 · Premium Hero Frontispiece</span>
          <button onClick={() => handleSaveTextBlocks('hero')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Corporate Emblem / Brand Header Text</label>
            <input type="text" value={editedHero.brandLogo} onChange={e => setEditedHero({ ...editedHero, brandLogo: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Brand Description Kicker Header</label>
            <input type="text" value={editedHero.brandKicker} onChange={e => setEditedHero({ ...editedHero, brandKicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Hero Title Statement (use periods for coloring splits)</label>
            <input type="text" value={editedHero.mainHeadline} onChange={e => setEditedHero({ ...editedHero, mainHeadline: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Editorial Sub-claim banner</label>
            <input type="text" value={editedHero.subline} onChange={e => setEditedHero({ ...editedHero, subline: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <label>Hero detailed body introduction</label>
              <span className="text-slate-400 font-mono text-[9px]">{editedHero.description.length} chars</span>
            </div>
            <textarea rows={5} value={editedHero.description} onChange={e => setEditedHero({ ...editedHero, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-2xs transition duration-150" />
          </div>
        </div>
      </div>

      {/* 2.2 Systems split content */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Dual Split Operating Systems Block</span>
          <button onClick={() => handleSaveTextBlocks('systems')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-3">
            <span className="text-[10px] text-slate-905 uppercase tracking-widest font-extrabold block border-b border-slate-200 pb-1">BLACK SYSTEM (Dark Action Pane)</span>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Kicker Logo claim</label>
              <input type="text" value={editedBlackSystem.kicker} onChange={e => setEditedBlackSystem({ ...editedBlackSystem, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Heading Statement</label>
              <input type="text" value={editedBlackSystem.heading} onChange={e => setEditedBlackSystem({ ...editedBlackSystem, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <label>Description claim paragraph</label>
                <span className="text-slate-400 font-mono text-[9px]">{editedBlackSystem.description.length} chars</span>
              </div>
              <textarea rows={4} value={editedBlackSystem.description} onChange={e => setEditedBlackSystem({ ...editedBlackSystem, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-2xs" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Pills (comma-separated list)</label>
              <input type="text" value={editedBlackSystem.pills.join(', ')} onChange={e => setEditedBlackSystem({ ...editedBlackSystem, pills: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] text-slate-905 bg-white px-2 py-0.5 border border-slate-200 rounded uppercase tracking-widest font-extrabold block w-fit">WHITE SYSTEM (Light Regulation Pane)</span>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Kicker Logo claim</label>
              <input type="text" value={editedWhiteSystem.kicker} onChange={e => setEditedWhiteSystem({ ...editedWhiteSystem, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Heading Statement</label>
              <input type="text" value={editedWhiteSystem.heading} onChange={e => setEditedWhiteSystem({ ...editedWhiteSystem, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
                <label>Description claim paragraph</label>
                <span className="text-slate-400 font-mono text-[9px]">{editedWhiteSystem.description.length} chars</span>
              </div>
              <textarea rows={4} value={editedWhiteSystem.description} onChange={e => setEditedWhiteSystem({ ...editedWhiteSystem, description: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-2xs" />
            </div>
            <div>
              <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Pills (comma-separated list)</label>
              <input type="text" value={editedWhiteSystem.pills.join(', ')} onChange={e => setEditedWhiteSystem({ ...editedWhiteSystem, pills: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 2.3 Manifesto Block */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">H2 · Human Manifesto Block</span>
          <button onClick={() => handleSaveTextBlocks('manifesto')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Manifesto Kicker Text</label>
            <input type="text" value={editedManifesto.kicker} onChange={e => setEditedManifesto({ ...editedManifesto, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Manifesto Headline text</label>
            <input type="text" value={editedManifesto.heading} onChange={e => setEditedManifesto({ ...editedManifesto, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <label>Duality Claims & Terms (One term per line)</label>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-mono px-2 py-0.5 rounded-md font-semibold">
                {editedManifesto.terms.length} terms loaded
              </span>
            </div>
            <textarea rows={8} value={editedManifesto.terms.join('\n')} onChange={e => setEditedManifesto({ ...editedManifesto, terms: e.target.value.split('\n').filter(line => line.trim() !== '') })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-2xs" />
          </div>
        </div>
      </div>

      {/* 2.4 Ecosystem Bento Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Ecosystem Bento Grid Segment</span>
          <button onClick={() => handleSaveTextBlocks('ecosystem')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Segment Kicker Head</label>
            <input type="text" value={editedEcosystem.kicker} onChange={e => setEditedEcosystem({ ...editedEcosystem, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Segment Main Title</label>
            <input type="text" value={editedEcosystem.heading} onChange={e => setEditedEcosystem({ ...editedEcosystem, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Ecosystem 4 Items details */}
        <div className="pt-2">
          <span className="text-[10px] text-slate-505 font-mono font-bold tracking-widest uppercase block mb-3">Ecosystem Subsystem Pillars (4 cards)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {editedEcosystem.items.map((item, idx) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Pillar #{idx + 1} ({item.id})</span>
                <div>
                  <label className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider text-[9px]">Title</label>
                  <input type="text" value={item.title} onChange={e => {
                    const newItems = [...editedEcosystem.items];
                    newItems[idx] = { ...item, title: e.target.value };
                    setEditedEcosystem({ ...editedEcosystem, items: newItems });
                  }} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wider text-[9px]">Subtitle</label>
                  <input type="text" value={item.subtitle} onChange={e => {
                    const newItems = [...editedEcosystem.items];
                    newItems[idx] = { ...item, subtitle: e.target.value };
                    setEditedEcosystem({ ...editedEcosystem, items: newItems });
                  }} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider text-slate-450">
                    <label>Description Paragraph</label>
                    <span className="font-mono text-[8px]">{item.description.length} chars</span>
                  </div>
                  <textarea rows={3} value={item.description} onChange={e => {
                    const newItems = [...editedEcosystem.items];
                    newItems[idx] = { ...item, description: e.target.value };
                    setEditedEcosystem({ ...editedEcosystem, items: newItems });
                  }} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2.5 Clinical Bodyworks / Recovery Architecture */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Clinical Bodyworks / Recovery Architecture</span>
          <button onClick={() => handleSaveTextBlocks('bodyworks')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Segment Kicker</label>
            <input type="text" value={editedBodyworks.kicker} onChange={e => setEditedBodyworks({ ...editedBodyworks, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Main Heading Statement (use period to highlight second half)</label>
            <input type="text" value={editedBodyworks.heading} onChange={e => setEditedBodyworks({ ...editedBodyworks, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-400" />
          </div>
          <div className="md:col-span-2">
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Support Subline</label>
            <input type="text" value={editedBodyworks.subline} onChange={e => setEditedBodyworks({ ...editedBodyworks, subline: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-450" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <label>Key explanatory paragraph</label>
              <span className="text-slate-400 font-mono text-[9px]">{editedBodyworks.paragraph.length} chars</span>
            </div>
            <textarea rows={5} value={editedBodyworks.paragraph} onChange={e => setEditedBodyworks({ ...editedBodyworks, paragraph: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-450 leading-relaxed shadow-2xs" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Required state call (e.g. Not indulgence. Required recovery.)</label>
            <input type="text" value={editedBodyworks.statement} onChange={e => setEditedBodyworks({ ...editedBodyworks, statement: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-400" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Clinical Right Box Card Title</label>
            <input type="text" value={editedBodyworks.cardTitle} onChange={e => setEditedBodyworks({ ...editedBodyworks, cardTitle: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-400" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <label>Clinical Card explanations list (One statement per line)</label>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-mono px-2 py-0.5 rounded-md font-semibold">
                {editedBodyworks.cardTexts.length} statements loaded
              </span>
            </div>
            <textarea rows={6} value={editedBodyworks.cardTexts.join('\n')} onChange={e => setEditedBodyworks({ ...editedBodyworks, cardTexts: e.target.value.split('\n').filter(line => line.trim() !== '') })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-850 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400 leading-relaxed shadow-2xs" />
          </div>
        </div>
      </div>

      {/* 2.6 ExhaleWork & Bottom claiming */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">H3 · ExhaleWork & Relief Paragraph claims</span>
          <button onClick={() => handleSaveTextBlocks('exhale')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Kicker Logo Text</label>
            <input type="text" value={editedExhale.kicker} onChange={e => setEditedExhale({ ...editedExhale, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Headline Accent Claim</label>
            <input type="text" value={editedExhale.heading} onChange={e => setEditedExhale({ ...editedExhale, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500">
              <label>Central explanations text</label>
              <span className="text-slate-400 font-mono text-[9px]">{editedExhale.explanation.length} chars</span>
            </div>
            <textarea rows={4} value={editedExhale.explanation} onChange={e => setEditedExhale({ ...editedExhale, explanation: e.target.value })} className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-855 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed shadow-2xs" />
          </div>
        </div>
      </div>

      {/* 2.7 Contact Details */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">H4 · Contact, Operations & Founder Details</span>
          <button onClick={() => handleSaveTextBlocks('contact')} className="px-3.5 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg uppercase hover:bg-indigo-700 transition shadow-xs">Save Block</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Form Section Kicker</label>
            <input type="text" value={editedContact.kicker} onChange={e => setEditedContact({ ...editedContact, kicker: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Form Section Title Head</label>
            <input type="text" value={editedContact.heading} onChange={e => setEditedContact({ ...editedContact, heading: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Founder Fullname</label>
            <input type="text" value={editedContact.founderName} onChange={e => setEditedContact({ ...editedContact, founderName: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Founder Claim Title</label>
            <input type="text" value={editedContact.founderTitle} onChange={e => setEditedContact({ ...editedContact, founderTitle: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Headquarters Email Address</label>
            <input type="text" value={editedContact.email} onChange={e => setEditedContact({ ...editedContact, email: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Headquarters Phone Credentials</label>
            <input type="text" value={editedContact.phone} onChange={e => setEditedContact({ ...editedContact, phone: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Landing Location Coordinates text</label>
            <input type="text" value={editedContact.location} onChange={e => setEditedContact({ ...editedContact, location: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-slate-500 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Official website domain link</label>
            <input type="text" value={editedContact.website} onChange={e => setEditedContact({ ...editedContact, website: e.target.value })} className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

    </div>
  );
}
