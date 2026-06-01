'use client';
import React from 'react';
import { HardDrive, Sparkles, Download, Upload, Layers, AlertCircle } from 'lucide-react';
import { PaymentConfig } from '@/lib/initialData';

interface SystemTabProps {
  handleExportData: () => void;
  handleImportData: (e: React.FormEvent) => void;
  backupJsonText: string;
  setBackupJsonText: (text: string) => void;
  paymentConfig: PaymentConfig;
  handleTogglePaymentMethod: (key: keyof PaymentConfig) => void;
  handleUpdatePaymentDetails: (key: keyof PaymentConfig, updates: any) => void;
  onResetToDefaults: () => void;
  showToast: (msg: string) => void;
}

export default function SystemTab({
  handleExportData,
  handleImportData,
  backupJsonText,
  setBackupJsonText,
  paymentConfig,
  handleTogglePaymentMethod,
  handleUpdatePaymentDetails,
  onResetToDefaults,
  showToast,
}: SystemTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">System Backup Administration</h2>
        <p className="text-xs text-slate-500">Export database clones or restore initial factory settings seamlessly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Save Database Pane */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Prism Sandbox Safeguard Backup</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download your fully structured products dictionary, clients session registers, and transactions ledger into a local `.json` file backup. You can copy this text or use the auto-downloader anytime.
          </p>
          
          <button
            onClick={handleExportData}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Database Backup File</span>
          </button>
        </div>

        {/* Import Database Pane */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold">
            <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Restore DB State Descriptor</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Paste raw backup JSON text or import your custom file configurations to instantly rewrite the browser storage schema and switch environments.
          </p>

          <form onSubmit={handleImportData} className="space-y-2">
            <textarea
              rows={5}
              value={backupJsonText}
              onChange={e => setBackupJsonText(e.target.value)}
              placeholder='Paste JSON code here i.e. { "siteData": {...}, "bookings": [...] }'
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 placeholder-slate-400 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-750 text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Rehydrate / Restore Backup State</span>
            </button>
          </form>
        </div>

      </div>

      {/* Supabase SQL Setup Schema Helper */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold">
          <Layers className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-wider">Supabase Production Live Database Migration SQL</h3>
        </div>
        <p className="text-xs text-slate-350 leading-relaxed font-sans">
          Hệ thống của bạn đã được kết nối và đồng bộ hoàn toàn với cơ sở dữ liệu Supabase của bạn tại địa chỉ: <code className="text-[#aa8612] font-mono bg-black/40 px-1.5 py-0.5 rounded">https://ayvnxquhmbyvljfmsdtq.supabase.co</code>. Để đồng bộ dữ liệu sản phẩm, bài viết, đơn hàng và lịch đặt điều trị từ CMS trực tiếp lên đám mây, hãy mở <strong>SQL Editor</strong> trong trang quản trị Supabase và chạy đoạn mã truy vấn sau để khởi tạo bảng lưu trữ:
        </p>
        <div className="relative">
          <pre className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-850">
{`-- Create the CulturX central store table
CREATE TABLE IF NOT EXISTS public.culturx_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.culturx_store ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous select & write access for rapid app prototyping
CREATE POLICY "Allow public read access" ON public.culturx_store FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.culturx_store FOR ALL USING (true);`}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.culturx_store (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.culturx_store ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.culturx_store FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.culturx_store FOR ALL USING (true);`);
              alert('Đã sao chép câu lệnh SQL khởi tạo bảng!');
            }}
            type="button"
            className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-[10px] font-mono px-2.5 py-1 rounded text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            Sao chép SQL
          </button>
        </div>
        <div className="flex items-start space-x-2.5 bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-xs text-slate-350">
          <span className="text-indigo-400 font-mono text-[10px] uppercase font-bold tracking-widest mt-0.5 shrink-0">HƯỚNG DẪN DEPLOY VERCEL:</span>
          <p className="leading-relaxed font-sans">
            Để chạy thật tế trên <strong>Vercel</strong>, bạn chỉ cần nạp các biến môi trường này vào mục <strong>Settings &gt; Environment Variables</strong> trong Vercel Project, sau đó tiến hành kích hoạt Webhook tự động hoặc chạy <code className="text-slate-300 font-mono">vercel deploy</code>:
            <br />
            <code className="text-emerald-400 block font-mono mt-1 select-all bg-black/20 p-1.5 rounded">
              NEXT_PUBLIC_SUPABASE_URL=https://ayvnxquhmbyvljfmsdtq.supabase.co
              <br />
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_VWe1bP7wYNktlq-9j7Djag_uiV5SjW3
            </code>
          </p>
        </div>
      </div>

      {/* Australian Payments Integration Management */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">Australian Payment Gateways Integration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Toggle and customize checkout payment endpoints for the public store layout.</p>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono uppercase font-black">Admin Suite</span>
        </div>

        <div className="space-y-6 divide-y divide-slate-100">
          {/* Gateways Loop */}
          {(['card', 'afterpay', 'payid', 'apple_google_pay', 'paypal'] as (keyof PaymentConfig)[]).map((key) => {
            const method = paymentConfig[key];
            if (!method) return null;
            return (
              <div key={key} className="pt-6 first:pt-0 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-widest">{key === 'apple_google_pay' ? 'Apple & Google' : key.toUpperCase()}</span>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>{method.title}</span>
                      {method.enabled ? (
                        <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold uppercase">ACTIVE</span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-semibold uppercase">DISABLED</span>
                      )}
                    </h4>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleTogglePaymentMethod(key)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition cursor-pointer ${
                      method.enabled
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {method.enabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                {/* Details edit controls */}
                {method.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs animate-fadeIn">
                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider">Gateway Public Label Name</label>
                      <input
                        type="text"
                        value={method.title}
                        onChange={(e) => handleUpdatePaymentDetails(key, { title: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider">Gateway Bottom Subtitle Details</label>
                      <input
                        type="text"
                        value={method.details}
                        onChange={(e) => handleUpdatePaymentDetails(key, { details: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Specific fields */}
                    {key === 'payid' && (
                      <>
                        <div>
                          <label className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider font-bold text-slate-700">PayID Registered Email</label>
                          <input
                            type="text"
                            value={method.payidEmail || ''}
                            onChange={(e) => handleUpdatePaymentDetails(key, { payidEmail: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-indigo-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider font-bold text-slate-700">Australian Business ABN</label>
                          <input
                            type="text"
                            value={method.businessAbn || ''}
                            onChange={(e) => handleUpdatePaymentDetails(key, { businessAbn: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>
                      </>
                    )}

                    {key === 'paypal' && (
                      <div className="md:col-span-2">
                        <label className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider font-bold text-slate-700">PayPal Business Email Receiver</label>
                        <input
                          type="text"
                          value={method.paypalEmail || ''}
                          onChange={(e) => handleUpdatePaymentDetails(key, { paypalEmail: e.target.value })}
                          className="w-full bg-white border border-slate-250 rounded-lg p-2 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-semibold text-blue-700"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset to defaults pane */}
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-3 mt-6">
        <div className="flex items-center space-x-2 text-rose-700">
          <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />
          <h4 className="text-sm font-bold uppercase tracking-widest font-mono text-rose-800 font-bold">Factory Reset Workspace (Wipe All Testing Changes)</h4>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          Notice: This action will restore all landing page texts, reset pricing strings, clean customer orders history, and re-establish the pristine CulturX HTML mock catalog baseline. Use this to erase database clutter instantly.
        </p>
        <button
          onClick={() => {
            if (confirm("Warning: Are you sure you want to restore the default initial configuration and delete all existing user, book, and order data? This action is irreversible.")) {
              onResetToDefaults();
              showToast("Workspace successfully reset to pristine factory settings");
            }
          }}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
        >
          Confirm Full Factory Wipe
        </button>
      </div>

    </div>
  );
}
