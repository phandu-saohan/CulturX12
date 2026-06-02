import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Order } from '@/lib/initialData';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onDeleteOrder: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function OrdersTab({ orders, onUpdateOrderStatus, onDeleteOrder, showToast }: OrdersTabProps) {
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

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
                <th className="py-2.5 px-4 text-right">Actions</th>
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
                        ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-808 text-emerald-800 border border-emerald-200' :
                        ord.status === 'shipped' ? 'bg-indigo-50 text-indigo-850 border border-indigo-200' :
                        ord.status === 'cancelled' ? 'bg-red-50 text-red-800 border border-red-200' :
                        'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <option value="pending">⏳ Pending Carriage</option>
                      <option value="shipped">✈️ Shipped Carrier</option>
                      <option value="delivered">💚 Delivered Handoff</option>
                      <option value="cancelled">❌ Void Order</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => setViewingOrder(ord)}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Confirm deleting this transaction record? This action will remove it completely from the order database.")) {
                          onDeleteOrder(ord.id);
                          showToast("Order transaction registry pruned.");
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition cursor-pointer inline-flex items-center align-middle"
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

      {/* VIEW ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setViewingOrder(null)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full text-slate-800 shadow-2xl space-y-6">
            <button onClick={() => setViewingOrder(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-indigo-50 text-indigo-750 border border-indigo-200 uppercase tracking-widest">Storefront Purchase Order</span>
              <h3 className="text-md font-bold uppercase text-slate-900 mt-2 font-display">Invoice ID: {viewingOrder.id}</h3>
              <p className="text-[11px] text-slate-450 mt-1">Transaction record logs synchronized from client checkout session.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 font-sans text-xs">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Buyer Details</span>
                <p className="font-bold text-slate-900">{viewingOrder.clientName}</p>
                <p className="text-slate-500 mt-0.5">📧 {viewingOrder.clientEmail}</p>
                <p className="text-slate-500">📞 {viewingOrder.clientPhone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Carriage Destination</span>
                <p className="text-slate-700 leading-normal font-medium">{viewingOrder.shippingAddress}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Order Date: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block">Purchased Items Ledger</span>
              <div className="space-y-2">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 border border-slate-200 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{it.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">SKU: {it.sku} · Price: ${it.price} USD</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-650 font-mono font-medium block">Qty: {it.qty}</span>
                      <span className="text-indigo-700 font-bold font-mono text-xs">${it.price * it.qty} USD</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">Carriage Fulfillment</span>
                <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border mt-1 ${
                  viewingOrder.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  viewingOrder.status === 'shipped' ? 'bg-indigo-50 text-indigo-850 border-indigo-200' :
                  viewingOrder.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-200' :
                  'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {viewingOrder.status}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block mb-1">Invoice Net Total</span>
                <span className="text-lg font-black text-indigo-700 font-mono">${viewingOrder.totalAmount} USD</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setViewingOrder(null)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer">
                Close Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
