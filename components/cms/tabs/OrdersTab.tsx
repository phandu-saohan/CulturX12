'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Order } from '@/lib/initialData';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function OrdersTab({ orders, onUpdateOrderStatus, onDeleteOrder, showToast }: OrdersTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">Customer Checkout Transactions</h2>
        <p className="text-xs text-slate-500">Watch simulated checkout purchases placed dynamically from frontpage.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 border border-slate-200 bg-slate-50 rounded-2xl text-center text-slate-500 font-sans text-xs">
          There are no shop transactions registered. Set products in Product tab to activate live purchase flows on live site.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4">Buyer Details</th>
                <th className="py-2.5 px-4">Items Purchased</th>
                <th className="py-2.5 px-4">Carriage Destination</th>
                <th className="py-2.5 px-4">Revenue Total</th>
                <th className="py-2.5 px-4">Fulfillment Status</th>
                <th className="py-2.5 px-4 text-right">Cancel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-sans text-xs font-semibold">
                    <div>
                      <span className="text-slate-900 font-bold block">{ord.clientName}</span>
                      <span className="block text-[10px] text-slate-500 font-mono font-normal">📧 {ord.clientEmail} <br /> 📞 {ord.clientPhone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[10.5px]">
                    <ul className="space-y-1 text-slate-700">
                      {ord.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between max-w-xs bg-slate-50 p-1.5 border border-slate-200 rounded-lg">
                          <span>{it.name} (x{it.qty})</span>
                          <span className="text-indigo-650 font-bold font-mono">${it.price * it.qty}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="text-[9px] text-slate-400 block mt-1">LOGGED ID: {ord.id}</span>
                  </td>
                  <td className="py-4 px-4 text-[10.5px] leading-normal text-slate-600 font-sans max-w-xs truncate" title={ord.shippingAddress}>
                    {ord.shippingAddress}
                  </td>
                  <td className="py-4 px-4 text-indigo-700 font-bold text-xs font-mono">${ord.totalAmount} USD</td>
                  <td className="py-4 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => {
                        onUpdateOrderStatus(ord.id, e.target.value as any);
                        showToast(`Logged order fulfillment update [${e.target.value.toUpperCase()}]`);
                      }}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-xs cursor-pointer ${
                        ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-805 text-emerald-800 border border-emerald-200' :
                        ord.status === 'shipped' ? 'bg-indigo-50 text-indigo-850 border border-indigo-200' :
                        ord.status === 'cancelled' ? 'bg-red-50 text-red-800 border border-red-201 border-red-200' :
                        'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <option value="pending font-sans">⏳ Pending Carriage</option>
                      <option value="shipped font-sans">✈️ Shipped Carrier</option>
                      <option value="delivered font-sans">💚 Delivered Handoff</option>
                      <option value="cancelled font-sans">❌ Void Order</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Confirm deleting this transaction record? This action will remove it completely from the order database.")) {
                          onDeleteOrder(ord.id);
                          showToast("Order transaction registry pruned.");
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
