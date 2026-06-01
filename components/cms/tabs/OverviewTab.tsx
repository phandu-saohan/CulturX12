'use client';
import React from 'react';
import { DollarSign, Calendar, Mail, Layers } from 'lucide-react';
import { CulturXData, Booking, Enquiry, Order } from '@/lib/initialData';

interface OverviewTabProps {
  siteData: CulturXData;
  bookings: Booking[];
  enquiries: Enquiry[];
  orders: Order[];
  activeBookingsCount: number;
  unreadEnquiriesCount: number;
}

export default function OverviewTab({ siteData, bookings, enquiries, orders, activeBookingsCount, unreadEnquiriesCount }: OverviewTabProps) {
  const totalRevenueVal = orders.reduce((acc, current) => current.status !== 'cancelled' ? acc + current.totalAmount : acc, 0);
  const unpaidComingCount = siteData.products.filter(p => p.isComingSoon).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">System Operations Dashboard</h2>
          <p className="text-xs text-slate-500">Key performance metrics analyzed from mock-checkout transactions and bookings registry.</p>
        </div>
        <span className="text-xs font-mono font-semibold bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-slate-600">
          {new Date().toISOString().split('T')[0]}
        </span>
      </div>

      {/* 4 Cards metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Total Sales Ledger</span>
            <DollarSign className="w-4 h-4 text-indigo-650" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono">${totalRevenueVal}</h3>
          <p className="text-[10px] text-slate-500">All authenticated order transactions</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Therapist Sessions</span>
            <Calendar className="w-4 h-4 text-indigo-650" />
          </div>
          <h3 className="text-2xl font-black text-indigo-600 font-mono">{activeBookingsCount} Active</h3>
          <p className="text-[10px] text-slate-500">{bookings.length} historical bookings logged</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Unread Enquiries</span>
            <Mail className="w-4 h-4 text-indigo-650" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-mono">{unreadEnquiriesCount} New</h3>
          <p className="text-[10px] text-slate-500">{enquiries.length - unreadEnquiriesCount} marked of read status</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-sm">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Managed Products</span>
            <Layers className="w-4 h-4 text-indigo-650" />
          </div>
          <h3 className="text-2xl font-black text-indigo-600 font-mono">{siteData.products.length} Items</h3>
          <p className="text-[10px] text-slate-500">{unpaidComingCount} products pending launch status</p>
        </div>
      </div>

      {/* Quick Start Help Guidance */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Primate Control Operations Quick-Guide:</h4>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>1. <strong>Make Products Shoppable:</strong> Navigate to the <em>Product Inventory</em> tab, click <strong>Configure / Add</strong>, and uncheck &quot;Is Coming Soon&quot; of any product. Supply a valuation price, click save, and visit the Live site to observe the shopping bag activate instantly!</p>
          <p>2. <strong>Testing Client Flows:</strong> Toggle back to the <em>Live Preview</em>, submit contact forms or book session hours, and return here to watch results coordinate into the database live.</p>
          <p>3. <strong>Wipe Content Clutter:</strong> If database objects collect excess test data, use the <em>Backup Settings</em> tab to reload defaults instantly.</p>
        </div>
      </div>
    </div>
  );
}
