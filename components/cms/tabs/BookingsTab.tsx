'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Booking } from '@/lib/initialData';

interface BookingsTabProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function BookingsTab({ bookings, onUpdateBookingStatus, onDeleteBooking, showToast }: BookingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">Client Bookings Queue</h2>
        <p className="text-xs text-slate-500">Manage clinically supervised therapist home/hotel dispatches in major cities.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-12 border border-slate-200 bg-slate-50 rounded-2xl text-center text-slate-500 font-sans text-xs">
          No therapist bookings recorded in central storage yet. Submit booking from Frontpage layout.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-200 font-bold">
              <tr>
                <th className="py-2.5 px-4">Session Client</th>
                <th className="py-2.5 px-4">Treatment / Time</th>
                <th className="py-2.5 px-4">Location</th>
                <th className="py-2.5 px-4">Revenue Ledger</th>
                <th className="py-2.5 px-4">Therapist Profile</th>
                <th className="py-2.5 px-4">Status Action</th>
                <th className="py-2.5 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-4 font-sans text-xs font-semibold">
                    <div>
                      <span className="text-slate-900 font-bold block">{b.clientName}</span>
                      <span className="block text-[10px] text-slate-500 font-mono font-normal">{b.clientEmail} · {b.clientPhone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans text-xs">
                    <div>
                      <span className="text-slate-800 uppercase font-display text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded">{b.treatmentName}</span>
                      <span className="block text-[10.5px] font-mono text-indigo-600 mt-1 font-bold">
                        📅 {b.preferredTime.replace('T', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="block text-[11px] font-sans text-slate-700">{b.hotelName}</span>
                      <strong className="block text-[10px] text-indigo-650 uppercase font-mono">{b.hotelRoom || 'N/A'}</strong>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-indigo-700 font-bold font-mono">${b.costUSD} USD</td>
                  <td className="py-4 px-4 text-[11px] text-slate-500">{b.therapistProfile}</td>
                  <td className="py-4 px-4">
                    <select
                      value={b.status}
                      onChange={(e) => {
                        onUpdateBookingStatus(b.id, e.target.value as any);
                        showToast(`Synchronized Session status to [${e.target.value.toUpperCase()}]`);
                      }}
                      className={`p-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-indigo-500/20 shadow-xs cursor-pointer ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                        b.status === 'completed' ? 'bg-indigo-50 text-indigo-850 border border-indigo-200' :
                        b.status === 'cancelled' ? 'bg-red-50 text-red-800 border border-red-200' :
                        'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      <option value="pending">⏳ Pending Check</option>
                      <option value="confirmed">🟢 Verified</option>
                      <option value="completed">✔️ Finished</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Permanently delete this therapist booking? This action is irreversible.")) {
                          onDeleteBooking(b.id);
                          showToast("Booking permanently removed.");
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
