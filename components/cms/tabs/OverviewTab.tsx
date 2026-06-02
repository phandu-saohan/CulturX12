'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, Mail, Layers, Sparkles, TrendingUp, 
  ArrowUpRight, Clock, MapPin, Play, RefreshCw, ShoppingCart, User
} from 'lucide-react';
import { CulturXData, Booking, Enquiry, Order } from '@/lib/initialData';

interface OverviewTabProps {
  siteData: CulturXData;
  bookings: Booking[];
  enquiries: Enquiry[];
  orders: Order[];
  activeBookingsCount: number;
  unreadEnquiriesCount: number;
}

export default function OverviewTab({ 
  siteData, 
  bookings, 
  enquiries, 
  orders, 
  activeBookingsCount, 
  unreadEnquiriesCount 
}: OverviewTabProps) {
  
  // Real-time states for simulation
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [localBookings, setLocalBookings] = useState<Booking[]>(bookings);
  const [isSimulating, setIsSimulating] = useState(false);
  const [pulseMetric, setPulseMetric] = useState<string | null>(null);

  // Sync state if props change
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  // Compute stats
  const totalRevenueVal = localOrders.reduce((acc, current) => current.status !== 'cancelled' ? acc + current.totalAmount : acc, 0);
  const unpaidComingCount = siteData.products.filter(p => p.isComingSoon).length;
  const activeLocalBookings = localBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;

  // Local Time Simulator
  const [melbourneTime, setMelbourneTime] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Australia/Melbourne',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setMelbourneTime(new Date().toLocaleTimeString('en-AU', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Run real-time mock simulation
  const triggerSimulation = () => {
    setIsSimulating(true);
    
    setTimeout(() => {
      // Simulate random order
      const randomNames = ["David Miller", "Emma Watson", "Alexander Wright", "Chloe Bennett", "Liam O'Connor"];
      const randomProducts = [
        { name: "Classic Ginger Kombucha", sku: "CX-FER-GINGER-330", price: 12 },
        { name: "Veggie-Might Elixer™", sku: "CX-ELX-VEGMIGHT", price: 18 },
        { name: "Polyphenol Lipid Complex™", sku: "CX-LIPID-MCTEVOO", price: 55 },
        { name: "Trinity Salve-ation™", sku: "CX-ELX-TRINITY", price: 45 }
      ];

      const name = randomNames[Math.floor(Math.random() * randomNames.length)];
      const prod = randomProducts[Math.floor(Math.random() * randomProducts.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      const total = prod.price * qty;

      const newOrder: Order = {
        id: `CX-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: name,
        clientEmail: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        clientPhone: "+61 491 570 156",
        shippingAddress: "Collins St, Melbourne VIC 3000",
        items: [{
          id: `item-${Date.now()}`,
          name: prod.name,
          sku: prod.sku,
          qty: qty,
          price: prod.price
        }],
        totalAmount: total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      setLocalOrders(prev => [newOrder, ...prev]);
      setPulseMetric('revenue');
      setIsSimulating(false);

      // Trigger pulse animations
      setTimeout(() => setPulseMetric(null), 2000);
    }, 1000);
  };

  // Compile Chart data derived dynamically from order ledger
  const getChartData = () => {
    const dailyMap: Record<string, number> = {};
    localOrders.forEach(o => {
      if (o.status !== 'cancelled') {
        const formattedDate = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        dailyMap[formattedDate] = (dailyMap[formattedDate] || 0) + o.totalAmount;
      }
    });

    const entries = Object.entries(dailyMap).map(([label, value]) => ({ label, value }));
    // If empty or small, fill in visual mock timeline to make it beautiful
    if (entries.length < 5) {
      const defaults = [
        { label: 'May 28', value: 120 },
        { label: 'May 29', value: 240 },
        { label: 'May 30', value: 90 },
        { label: 'May 31', value: 380 },
        { label: 'Jun 01', value: 180 }
      ];
      // append existing entries to visual dashboard
      entries.forEach(item => {
        const match = defaults.find(d => d.label === item.label);
        if (match) match.value += item.value;
        else defaults.push(item);
      });
      return defaults.slice(-5);
    }
    return entries.slice(-5);
  };

  const chartData = getChartData();
  const maxChartVal = Math.max(...chartData.map(c => c.value), 100);

  // Compute Booking Status Ratio
  const confirmedCount = localBookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = localBookings.filter(b => b.status === 'pending').length;
  const cancelledCount = localBookings.filter(b => b.status === 'cancelled').length;
  const totalB = localBookings.length || 1;

  const confPercent = Math.round((confirmedCount / totalB) * 100);
  const pendPercent = Math.round((pendingCount / totalB) * 100);
  const cancPercent = Math.round((cancelledCount / totalB) * 100);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[4px] text-indigo-600 font-mono font-bold block mb-1">CULTURX™ SUITE</span>
          <h2 className="text-xl font-bold uppercase text-slate-950 tracking-widest font-display">System Operations Dashboard</h2>
          <p className="text-xs text-slate-500">Key performance metrics analyzed from mock-checkout transactions and bookings registry.</p>
        </div>
        
        {/* Telemetry Clock & Simulator */}
        <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
          <div className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2.5 shadow-sm text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase leading-none font-bold">Melbourne Time</span>
              <span className="font-bold text-slate-100">{melbourneTime || '--:--:--'}</span>
            </div>
          </div>
          <button
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold uppercase rounded-xl transition cursor-pointer shadow-sm shadow-indigo-500/10"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-brand-gold fill-current" />
            )}
            <span>{isSimulating ? "Simulating..." : "Simulate Sale"}</span>
          </button>
        </div>
      </div>

      {/* 4 Cards metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1: Total Sales */}
        <div className={`p-5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-xs transition duration-300 relative overflow-hidden ${
          pulseMetric === 'revenue' ? 'ring-2 ring-indigo-500 bg-indigo-50/20 scale-[1.02]' : ''
        }`}>
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Total Sales Ledger</span>
            <DollarSign className="w-4 h-4 text-indigo-650" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-slate-900 font-mono">${totalRevenueVal}</h3>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold flex items-center">
              <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +15%
            </span>
          </div>
          <p className="text-[10px] text-slate-500">All authenticated order transactions</p>
        </div>

        {/* Metric 2: Bookings */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Active Sessions</span>
            <Calendar className="w-4 h-4 text-indigo-650" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-indigo-600 font-mono">{activeLocalBookings} Active</h3>
            <span className="text-[9px] text-slate-500 font-mono font-medium">/ {localBookings.length} total</span>
          </div>
          <p className="text-[10px] text-slate-500">Clinical bookings logged</p>
        </div>

        {/* Metric 3: Enquiries */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Unread Enquiries</span>
            <Mail className="w-4 h-4 text-indigo-650" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-slate-900 font-mono">{unreadEnquiriesCount} New</h3>
            <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-mono font-bold">
              95% SLA
            </span>
          </div>
          <p className="text-[10px] text-slate-500">Awaiting client support replies</p>
        </div>

        {/* Metric 4: Managed Products */}
        <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-widest font-mono">Managed Products</span>
            <Layers className="w-4 h-4 text-indigo-650" />
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-indigo-600 font-mono">{siteData.products.length} Items</h3>
            <span className="text-[9px] text-slate-500 font-mono font-medium">/ {unpaidComingCount} pending</span>
          </div>
          <p className="text-[10px] text-slate-500">Products currently inside database</p>
        </div>
      </div>

      {/* Analytics Visualizers (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Sales Trend Graph */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest font-display text-slate-900">Weekly Transaction Volumes</h3>
            </div>
            <span className="text-[9px] font-mono font-black text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded">
              USD ($) Ledger
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-48 flex items-end justify-between pt-4 px-2">
            {chartData.map((data, index) => {
              const pct = (data.value / maxChartVal) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  {/* Tooltip value */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[9px] font-bold font-mono px-2 py-0.5 rounded mb-1.5 shadow-md">
                    ${data.value}
                  </div>
                  {/* Visual Column bar */}
                  <div className="w-8 sm:w-12 bg-slate-100 rounded-t-lg h-32 flex items-end overflow-hidden border border-slate-200/50">
                    <div 
                      style={{ height: `${pct}%` }} 
                      className="w-full bg-indigo-600 group-hover:bg-indigo-700 transition-all duration-500 rounded-t-md shadow-inner"
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[9px] font-mono text-slate-450 uppercase font-black tracking-tighter mt-2">
                    {data.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings Status Ratio circular progress bar panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-xs font-black uppercase tracking-widest font-display text-slate-900">Session Status Index</h3>
            <span className="text-[9px] font-mono text-slate-450 uppercase font-bold">Telemetry</span>
          </div>

          <div className="space-y-4 pt-2">
            
            {/* Confirmed progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px] font-medium text-slate-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Confirmed
                </span>
                <span className="font-mono font-bold text-slate-900">{confirmedCount} ({confPercent}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${confPercent}%` }} className="h-full bg-green-500 rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Pending progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px] font-medium text-slate-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Pending
                </span>
                <span className="font-mono font-bold text-slate-900">{pendingCount} ({pendPercent}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${pendPercent}%` }} className="h-full bg-amber-500 rounded-full transition-all duration-300" />
              </div>
            </div>

            {/* Cancelled progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10.5px] font-medium text-slate-600">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-2" /> Cancelled
                </span>
                <span className="font-mono font-bold text-slate-900">{cancelledCount} ({cancPercent}%)</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div style={{ width: `${cancPercent}%` }} className="h-full bg-red-500 rounded-full transition-all duration-300" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Recent Activity stream tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Recent Checkout Orders */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-indigo-650" />
              <h3 className="text-xs font-black uppercase tracking-widest font-display text-slate-900">Recent Checkout Orders</h3>
            </div>
            <span className="text-[10px] text-slate-450 font-mono">Real-time</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs leading-normal">
            {localOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{order.clientName}</span>
                    <span className="text-[9px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded uppercase">
                      {order.id}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{order.clientEmail}</p>
                </div>
                
                <div className="text-right space-y-0.5 shrink-0">
                  <span className="font-mono font-bold text-indigo-650 block">${order.totalAmount}</span>
                  <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                    order.status === 'shipped' ? 'bg-indigo-50 text-indigo-700' :
                    order.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clinical Bookings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-650" />
              <h3 className="text-xs font-black uppercase tracking-widest font-display text-slate-900">Recent Clinical Sessions</h3>
            </div>
            <span className="text-[10px] text-slate-450 font-mono">Real-time</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs leading-normal">
            {localBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{b.clientName}</span>
                    <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.2 rounded uppercase">
                      {b.treatmentName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{b.hotelName} ({b.hotelRoom})</span>
                  </div>
                </div>
                
                <div className="text-right space-y-0.5 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {b.preferredTime.replace('T', ' ')}
                  </span>
                  <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    b.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                    b.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                    b.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Operational Quick Guide */}
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
        <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center">
          <Sparkles className="w-4 h-4 mr-2" /> Operations Management Guide:
        </h4>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>1. <strong>Simulate Client Actions:</strong> Click the **&quot;Simulate Sale&quot;** button at the top right to instantly generate an incoming mock order and watch the weekly transaction charts and activity logs update dynamically.</p>
          <p>2. <strong>Testing Live Site Checkout:</strong> Exit the CMS Panel, navigate the storefront catalog to add items to your cart, execute a mock checkout session, and watch the order propagate live back into your operations ledger.</p>
          <p>3. <strong>Manage Clinical Bookings:</strong> Use the sidebar modules to confirm or decline sessions. Booking status updates compile and reflect directly inside the Operational Analytics Gauges above.</p>
        </div>
      </div>
      
    </div>
  );
}
