'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Tag, Phone, Globe, Plug, ShoppingBag, Share2, Bell,
  ChevronDown, ChevronUp, Save, Check, Eye, EyeOff,
  AlertTriangle, Info, Upload, X, Image,
  Instagram, Youtube, Linkedin
} from 'lucide-react';
import { AppSettings } from '@/lib/initialData';

interface SettingsTabProps {
  appSettings: AppSettings;
  onSaveAppSettings: (updated: AppSettings) => void;
  showToast: (msg: string) => void;
}

type SectionKey = 'brand' | 'contact' | 'localization' | 'integrations' | 'store' | 'social' | 'notifications';

const TIMEZONES = [
  'Australia/Melbourne', 'Australia/Sydney', 'Australia/Brisbane',
  'Australia/Perth', 'Australia/Adelaide', 'Asia/Ho_Chi_Minh',
  'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'America/New_York',
  'America/Los_Angeles', 'UTC',
];

const CURRENCIES = [
  { code: 'AUD', symbol: '$', label: 'Australian Dollar' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'SGD', symbol: '$', label: 'Singapore Dollar' },
  { code: 'VND', symbol: '₫', label: 'Vietnamese Dong' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
];

export default function SettingsTab({ appSettings, onSaveAppSettings, showToast }: SettingsTabProps) {
  const [draft, setDraft] = useState<AppSettings>(appSettings);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    brand: true,
    contact: false,
    localization: false,
    integrations: false,
    store: false,
    social: false,
    notifications: false,
  });
  const [savedSections, setSavedSections] = useState<Partial<Record<SectionKey, boolean>>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [faviconDragging, setFaviconDragging] = useState(false);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Sync favicon to browser <link rel="icon"> whenever it changes
  useEffect(() => {
    const src = draft.brand.faviconUrl;
    if (!src) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = src;
  }, [draft.brand.faviconUrl]);

  const handleFaviconFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (PNG, ICO, SVG, WebP)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Favicon must be under 2 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setDraft(prev => ({ ...prev, brand: { ...prev.brand, faviconUrl: dataUrl } }));
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Deep update helper
  const updateDraft = <G extends keyof AppSettings>(group: G, field: keyof AppSettings[G], value: AppSettings[G][keyof AppSettings[G]]) => {
    setDraft(prev => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const saveSection = (section: SectionKey) => {
    onSaveAppSettings(draft);
    setSavedSections(prev => ({ ...prev, [section]: true }));
    showToast(`Settings saved: ${section.toUpperCase()}`);
    setTimeout(() => setSavedSections(prev => ({ ...prev, [section]: false })), 2500);
  };

  const saveAll = () => {
    onSaveAppSettings(draft);
    showToast('All settings saved successfully!');
  };

  // ── Input helpers ──────────────────────────────────────────
  const InputField = ({
    label, value, onChange, type = 'text', placeholder = '', hint = '', secret = false, secretKey = ''
  }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; hint?: string; secret?: boolean; secretKey?: string;
  }) => (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block">{label}</label>
      <div className="relative">
        <input
          type={secret && !showSecrets[secretKey] ? 'password' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
        {secret && (
          <button type="button" onClick={() => toggleSecret(secretKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showSecrets[secretKey] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      {hint && <p className="text-[10px] text-slate-400 leading-snug">{hint}</p>}
    </div>
  );

  const ToggleSwitch = ({
    label, description, checked, onChange
  }: {
    label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 cursor-pointer ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  // ── Section header ─────────────────────────────────────────
  const SectionHeader = ({
    icon, title, subtitle, sectionKey, color = 'indigo'
  }: {
    icon: React.ReactNode; title: string; subtitle: string; sectionKey: SectionKey; color?: string;
  }) => {
    const isOpen = openSections[sectionKey];
    const isSaved = savedSections[sectionKey];
    const colorMap: Record<string, string> = {
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
      violet: 'bg-violet-50 text-violet-600 border-violet-100',
      rose: 'bg-rose-50 text-rose-600 border-rose-100',
      sky: 'bg-sky-50 text-sky-600 border-sky-100',
      teal: 'bg-teal-50 text-teal-600 border-teal-100',
    };
    return (
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center gap-4 p-5 text-left group hover:bg-slate-50 transition rounded-t-2xl"
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[color] || colorMap.indigo} shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h3>
            {isSaved && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-fadeIn">
                <Check className="w-3 h-3" /> SAVED
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
        </div>
        <div className="text-slate-400 group-hover:text-slate-600 transition shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
    );
  };

  const SectionFooter = ({ sectionKey }: { sectionKey: SectionKey }) => (
    <div className="px-5 pb-5 pt-2">
      <button
        type="button"
        onClick={() => saveSection(sectionKey)}
        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm shadow-indigo-200"
      >
        <Save className="w-3.5 h-3.5" />
        Save {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Settings
      </button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="border-b border-slate-200 pb-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">App Settings</h2>
          <p className="text-xs text-slate-500 mt-1">Configure all webapp parameters — changes take effect immediately across the public site.</p>
        </div>
        <button
          type="button"
          onClick={saveAll}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
        >
          <Save className="w-3.5 h-3.5" />
          Save All
        </button>
      </div>

      {/* ─── SECTION 1: BRAND IDENTITY ─────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="brand"
          icon={<Tag className="w-5 h-5" />}
          title="Brand Identity"
          subtitle="Name, tagline, domain, logo, and favicon"
          color="indigo"
        />
        {openSections.brand && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Brand Name"
                value={draft.brand.name}
                onChange={v => updateDraft('brand', 'name', v)}
                placeholder="CULTURX™"
                hint="Appears in navigation, footer, and page titles"
              />
              <InputField
                label="Logo Text"
                value={draft.brand.logoText}
                onChange={v => updateDraft('brand', 'logoText', v)}
                placeholder="CULTURX™"
                hint="Text displayed as the nav logo (can differ from brand name)"
              />
              <InputField
                label="Tagline"
                value={draft.brand.tagline}
                onChange={v => updateDraft('brand', 'tagline', v)}
                placeholder="Internal. External. Optimized."
                hint="Shown in hero section and meta descriptions"
              />
              <InputField
                label="Website Domain"
                value={draft.brand.domain}
                onChange={v => updateDraft('brand', 'domain', v)}
                placeholder="https://culturx.com.au"
                hint="Used in canonical URLs and SEO structured data"
              />

              {/* ── FAVICON UPLOAD ── */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block">Favicon Image</label>
                <div className="flex items-start gap-4">
                  {/* Preview box */}
                  <div className="relative shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group">
                    {draft.brand.faviconUrl ? (
                      <>
                        <img src={draft.brand.faviconUrl} alt="Favicon" className="w-12 h-12 object-contain" />
                        <button
                          type="button"
                          onClick={() => setDraft(prev => ({ ...prev, brand: { ...prev.brand, faviconUrl: '' } }))}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-2xl select-none">{draft.brand.faviconEmoji || '🧬'}</span>
                    )}
                  </div>

                  {/* Drop zone */}
                  <div
                    onClick={() => faviconInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setFaviconDragging(true); }}
                    onDragLeave={() => setFaviconDragging(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setFaviconDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleFaviconFile(file);
                    }}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed cursor-pointer transition ${
                      faviconDragging
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/50'
                    }`}
                  >
                    <Upload className="w-4 h-4 text-slate-400" />
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-slate-600">
                        {draft.brand.faviconUrl ? 'Replace favicon' : 'Upload favicon'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">PNG, ICO, SVG, WebP · max 2 MB · ideal 32×32 or 64×64px</p>
                    </div>
                  </div>

                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/png,image/x-icon,image/svg+xml,image/webp,image/jpeg"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFaviconFile(file);
                      e.target.value = '';
                    }}
                  />
                </div>

                {/* Emoji fallback */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider shrink-0">Emoji fallback (if no image)</span>
                  <input
                    type="text"
                    value={draft.brand.faviconEmoji}
                    onChange={e => updateDraft('brand', 'faviconEmoji', e.target.value)}
                    placeholder="🧬"
                    maxLength={2}
                    className="w-16 text-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.brand.primaryColor}
                    onChange={e => updateDraft('brand', 'primaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer bg-slate-50 p-1"
                  />
                  <input
                    type="text"
                    value={draft.brand.primaryColor}
                    onChange={e => updateDraft('brand', 'primaryColor', e.target.value)}
                    placeholder="#4f46e5"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Used for buttons, links, and accent elements</p>
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-3 font-bold">Live Preview — Browser Tab</p>
              <div className="flex items-center gap-3">
                {/* Favicon preview */}
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  {draft.brand.faviconUrl ? (
                    <img src={draft.brand.faviconUrl} alt="favicon" className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-lg leading-none">{draft.brand.faviconEmoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium truncate shadow-xs">
                    {draft.brand.name} — {draft.brand.tagline}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono truncate">{draft.brand.domain}</p>
                </div>
              </div>
            </div>
            <SectionFooter sectionKey="brand" />
          </div>
        )}
      </div>

      {/* ─── SECTION 2: CONTACT & LOCATION ─────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="contact"
          icon={<Phone className="w-5 h-5" />}
          title="Contact & Location"
          subtitle="Email, phone, address, and founder info"
          color="emerald"
        />
        {openSections.contact && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Business Email"
                value={draft.contact.email}
                onChange={v => updateDraft('contact', 'email', v)}
                type="email"
                placeholder="hello@culturx.com.au"
                hint="Shown in contact section and enquiry confirmation emails"
              />
              <InputField
                label="Phone Number"
                value={draft.contact.phone}
                onChange={v => updateDraft('contact', 'phone', v)}
                placeholder="+61 457 788 884"
              />
              <InputField
                label="Founder Name"
                value={draft.contact.founderName}
                onChange={v => updateDraft('contact', 'founderName', v)}
                placeholder="Gabriela Popa"
              />
              <InputField
                label="Founder Title"
                value={draft.contact.founderTitle}
                onChange={v => updateDraft('contact', 'founderTitle', v)}
                placeholder="Founder & CEO"
              />
              <InputField
                label="Street Address"
                value={draft.contact.address}
                onChange={v => updateDraft('contact', 'address', v)}
                placeholder="Collins Street"
              />
              <InputField
                label="City"
                value={draft.contact.city}
                onChange={v => updateDraft('contact', 'city', v)}
                placeholder="Melbourne"
              />
              <InputField
                label="State / Region"
                value={draft.contact.state}
                onChange={v => updateDraft('contact', 'state', v)}
                placeholder="Victoria"
              />
              <InputField
                label="Country"
                value={draft.contact.country}
                onChange={v => updateDraft('contact', 'country', v)}
                placeholder="Australia"
              />
            </div>
            <SectionFooter sectionKey="contact" />
          </div>
        )}
      </div>

      {/* ─── SECTION 3: LOCALIZATION ────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="localization"
          icon={<Globe className="w-5 h-5" />}
          title="Localization"
          subtitle="Currency, timezone, locale, and SEO geo-targeting"
          color="amber"
        />
        {openSections.localization && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block">Currency</label>
                <select
                  value={draft.localization.currency}
                  onChange={e => {
                    const curr = CURRENCIES.find(c => c.code === e.target.value);
                    updateDraft('localization', 'currency', e.target.value);
                    if (curr) updateDraft('localization', 'currencySymbol', curr.symbol);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol}) — {c.label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400">Used in cart, product prices, and checkout</p>
              </div>
              <InputField
                label="Currency Symbol"
                value={draft.localization.currencySymbol}
                onChange={v => updateDraft('localization', 'currencySymbol', v)}
                placeholder="$"
                hint="Override the auto-detected symbol if needed"
              />
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold block">Timezone</label>
                <select
                  value={draft.localization.timezone}
                  onChange={e => updateDraft('localization', 'timezone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                >
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <InputField
                label="Locale Code"
                value={draft.localization.locale}
                onChange={v => updateDraft('localization', 'locale', v)}
                placeholder="en-AU"
                hint="e.g. en-AU, en-US, vi-VN — affects date/number formatting"
              />
              <InputField
                label="SEO Target City"
                value={draft.localization.targetCity}
                onChange={v => updateDraft('localization', 'targetCity', v)}
                placeholder="Melbourne"
                hint="City used in auto-generated SEO meta descriptions"
              />
              <InputField
                label="SEO Target Region"
                value={draft.localization.targetRegion}
                onChange={v => updateDraft('localization', 'targetRegion', v)}
                placeholder="Victoria"
                hint="Region used for local SEO targeting"
              />
            </div>
            <SectionFooter sectionKey="localization" />
          </div>
        )}
      </div>

      {/* ─── SECTION 4: INTEGRATIONS ────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="integrations"
          icon={<Plug className="w-5 h-5" />}
          title="Third-Party Integrations"
          subtitle="Stripe, Analytics, Supabase, and tracking keys"
          color="violet"
        />
        {openSections.integrations && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-snug">
                API keys are stored in browser storage. For production, use environment variables in your hosting provider instead.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Payments — Stripe</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <InputField
                  label="Stripe Publishable Key"
                  value={draft.integrations.stripePublicKey}
                  onChange={v => updateDraft('integrations', 'stripePublicKey', v)}
                  placeholder="pk_live_..."
                  hint="Your Stripe dashboard → Developers → API Keys"
                  secret
                  secretKey="stripe_pk"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Google Analytics & Search</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <InputField
                  label="Google Analytics 4 ID"
                  value={draft.integrations.googleAnalyticsId}
                  onChange={v => updateDraft('integrations', 'googleAnalyticsId', v)}
                  placeholder="G-XXXXXXXXXX"
                  hint="From Google Analytics → Admin → Data Streams"
                />
                <InputField
                  label="Search Console Verification ID"
                  value={draft.integrations.googleSearchConsoleId}
                  onChange={v => updateDraft('integrations', 'googleSearchConsoleId', v)}
                  placeholder="Verification meta tag content value"
                  hint="Google Search Console → Settings → Ownership verification"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Meta / Facebook</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <InputField
                  label="Facebook Pixel ID"
                  value={draft.integrations.facebookPixelId}
                  onChange={v => updateDraft('integrations', 'facebookPixelId', v)}
                  placeholder="123456789012345"
                  hint="Meta Business Suite → Events Manager → Pixels"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Database — Supabase</p>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <InputField
                  label="Supabase Project URL"
                  value={draft.integrations.supabaseUrl}
                  onChange={v => updateDraft('integrations', 'supabaseUrl', v)}
                  placeholder="https://xxxx.supabase.co"
                  hint="Supabase Dashboard → Project Settings → API"
                />
                <InputField
                  label="Supabase Anon Key"
                  value={draft.integrations.supabaseAnonKey}
                  onChange={v => updateDraft('integrations', 'supabaseAnonKey', v)}
                  placeholder="sb_publishable_..."
                  hint="Safe to use in frontend (row-level security enforced)"
                  secret
                  secretKey="supabase_anon"
                />
              </div>
            </div>
            <SectionFooter sectionKey="integrations" />
          </div>
        )}
      </div>

      {/* ─── SECTION 5: STORE & FEATURES ────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="store"
          icon={<ShoppingBag className="w-5 h-5" />}
          title="Store & Features"
          subtitle="Toggle sections and enable maintenance mode"
          color="rose"
        />
        {openSections.store && (
          <div className="px-5 pb-1 space-y-0 border-t border-slate-100 pt-5">
            {draft.store.maintenanceMode && (
              <div className="mb-4 flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-rose-800 leading-snug">
                  <strong>Maintenance mode is ON.</strong> The public site will show the maintenance message to all visitors.
                </p>
              </div>
            )}

            <ToggleSwitch
              label="Shop / E-Commerce"
              description="Product catalog, cart, and checkout functionality"
              checked={draft.store.enableShop}
              onChange={v => updateDraft('store', 'enableShop', v)}
            />
            <ToggleSwitch
              label="Clinical Bodyworks"
              description="Treatment booking and therapist concierge service"
              checked={draft.store.enableBodyworks}
              onChange={v => updateDraft('store', 'enableBodyworks', v)}
            />
            <ToggleSwitch
              label="Intelligence Articles"
              description="Medical research articles and editorial section"
              checked={draft.store.enableArticles}
              onChange={v => updateDraft('store', 'enableArticles', v)}
            />
            <ToggleSwitch
              label="Concierge Recovery"
              description="Hotel concierge and in-room recovery program"
              checked={draft.store.enableConcierge}
              onChange={v => updateDraft('store', 'enableConcierge', v)}
            />

            <div className="pt-4 mt-2 border-t border-slate-200 space-y-3">
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Maintenance Controls
              </p>
              <ToggleSwitch
                label="Maintenance Mode"
                description="Show maintenance screen to all public visitors — CMS remains accessible"
                checked={draft.store.maintenanceMode}
                onChange={v => updateDraft('store', 'maintenanceMode', v)}
              />
              {draft.store.maintenanceMode && (
                <InputField
                  label="Maintenance Message"
                  value={draft.store.maintenanceMessage}
                  onChange={v => updateDraft('store', 'maintenanceMessage', v)}
                  placeholder="We're upgrading. Check back soon."
                  hint="Shown on the public maintenance screen"
                />
              )}
            </div>
            <div className="pt-2">
              <SectionFooter sectionKey="store" />
            </div>
          </div>
        )}
      </div>

      {/* ─── SECTION 6: SOCIAL MEDIA ────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="social"
          icon={<Share2 className="w-5 h-5" />}
          title="Social Media Links"
          subtitle="Platform profile URLs shown in the public footer"
          color="sky"
        />
        {openSections.social && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 block">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram
                </label>
                <input
                  type="url"
                  value={draft.social.instagram}
                  onChange={e => updateDraft('social', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/culturx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 block">
                  <svg className="w-3.5 h-3.5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </label>
                <input
                  type="url"
                  value={draft.social.facebook}
                  onChange={e => updateDraft('social', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/culturx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 block">
                  <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn
                </label>
                <input
                  type="url"
                  value={draft.social.linkedin}
                  onChange={e => updateDraft('social', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/culturx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 block">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.77a8.28 8.28 0 004.84 1.55V6.88a4.85 4.85 0 01-1.07-.19z"/></svg>
                  TikTok
                </label>
                <input
                  type="url"
                  value={draft.social.tiktok}
                  onChange={e => updateDraft('social', 'tiktok', e.target.value)}
                  placeholder="https://tiktok.com/@culturx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 block">
                  <Youtube className="w-3.5 h-3.5 text-red-600" /> YouTube
                </label>
                <input
                  type="url"
                  value={draft.social.youtube}
                  onChange={e => updateDraft('social', 'youtube', e.target.value)}
                  placeholder="https://youtube.com/@culturx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>
            <SectionFooter sectionKey="social" />
          </div>
        )}
      </div>

      {/* ─── SECTION 7: NOTIFICATIONS ───────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <SectionHeader
          sectionKey="notifications"
          icon={<Bell className="w-5 h-5" />}
          title="Notifications"
          subtitle="Admin alert emails and customer confirmation settings"
          color="teal"
        />
        {openSections.notifications && (
          <div className="px-5 pb-1 space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-start gap-2.5 p-3.5 bg-sky-50 border border-sky-200 rounded-xl">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-sky-800 leading-snug">
                Email delivery requires a transactional email service (Resend, SendGrid, etc.) connected to the API. Settings here configure the destination addresses and preferences.
              </p>
            </div>

            <InputField
              label="Admin Notification Email"
              value={draft.notifications.adminEmail}
              onChange={v => updateDraft('notifications', 'adminEmail', v)}
              type="email"
              placeholder="admin@culturx.com.au"
              hint="Receives new order, booking, and enquiry alerts"
            />

            <div className="space-y-0 bg-slate-50 border border-slate-100 rounded-xl p-4">
              <ToggleSwitch
                label="Admin Email Alerts"
                description="Send email to admin when new orders, bookings, or enquiries arrive"
                checked={draft.notifications.adminEmailAlerts}
                onChange={v => updateDraft('notifications', 'adminEmailAlerts', v)}
              />
              <ToggleSwitch
                label="Order Confirmation Emails"
                description="Send automatic order confirmation to customers"
                checked={draft.notifications.orderConfirmEmail}
                onChange={v => updateDraft('notifications', 'orderConfirmEmail', v)}
              />
              <ToggleSwitch
                label="Booking Confirmation Emails"
                description="Send confirmation when a treatment is booked"
                checked={draft.notifications.bookingConfirmEmail}
                onChange={v => updateDraft('notifications', 'bookingConfirmEmail', v)}
              />
              <ToggleSwitch
                label="Enquiry Alert Emails"
                description="Notify admin when a new client enquiry is submitted"
                checked={draft.notifications.enquiryAlertEmail}
                onChange={v => updateDraft('notifications', 'enquiryAlertEmail', v)}
              />
            </div>
            <SectionFooter sectionKey="notifications" />
          </div>
        )}
      </div>

      {/* Bottom save all */}
      <div className="pt-2 pb-4">
        <button
          type="button"
          onClick={saveAll}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-sm shadow-indigo-200"
        >
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
