'use client';
import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { Booking } from '@/lib/initialData';

interface BookingsTabProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
  onDeleteBooking: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function BookingsTab({ bookings, onUpdateBookingStatus, onDeleteBooking, showToast }: BookingsTabProps) {
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

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
                <th className="py-2.5 px-4 text-right">Actions</th>
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
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => setViewingBooking(b)}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10.5px] uppercase font-bold transition cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Permanently delete this therapist booking? This action is irreversible.")) {
                          onDeleteBooking(b.id);
                          showToast("Booking permanently removed.");
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

      {/* VIEW BOOKING DETAILS MODAL */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setViewingBooking(null)} />
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl w-full text-slate-800 shadow-2xl space-y-6">
            <button onClick={() => setViewingBooking(null)} className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition cursor-pointer">
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-indigo-50 text-indigo-750 border border-indigo-200 uppercase tracking-widest">Booking Invoice Details</span>
              <h3 className="text-md font-bold uppercase text-slate-900 mt-2 font-display">Booking ID: {viewingBooking.id}</h3>
              <p className="text-[11px] text-slate-400 mt-1">Logged session details for clinical treatment dispatch.</p>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-slate-100 py-4 font-sans text-xs">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Client Profile</span>
                <p className="font-bold text-slate-900">{viewingBooking.clientName}</p>
                <p className="text-slate-500 mt-0.5">📧 {viewingBooking.clientEmail}</p>
                <p className="text-slate-500">📞 {viewingBooking.clientPhone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Treatment Session</span>
                <p className="font-bold text-indigo-700 uppercase font-display text-[11px]">{viewingBooking.treatmentName}</p>
                <p className="text-slate-500 mt-0.5">⏱️ Duration: {viewingBooking.durationMin} mins</p>
                <p className="text-slate-500">💰 Cost: ${viewingBooking.costUSD} USD</p>
              </div>

              <div className="pt-2 border-t border-slate-100 sm:border-t-0">
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Dispatch Location</span>
                <p className="font-medium text-slate-800">{viewingBooking.hotelName}</p>
                <p className="text-indigo-650 font-mono font-bold">Room/Suite: {viewingBooking.hotelRoom || 'N/A'}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 sm:border-t-0">
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Schedule & Specialist</span>
                <p className="text-slate-800 font-mono font-bold">📅 {viewingBooking.preferredTime.replace('T', ' ')}</p>
                <p className="text-slate-500 mt-0.5">👤 Therapist: {viewingBooking.therapistProfile}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-450 uppercase font-mono font-bold block mb-1">Status State</span>
                <span className={`inline-block text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg border mt-1 ${
                  viewingBooking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  viewingBooking.status === 'completed' ? 'bg-indigo-50 text-indigo-850 border-indigo-200' :
                  viewingBooking.status === 'cancelled' ? 'bg-red-50 text-red-800 border-red-200' :
                  'bg-amber-50 text-amber-900 border-amber-200'
                }`}>
                  {viewingBooking.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono self-end">Registered: {new Date(viewingBooking.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button onClick={() => setViewingBooking(null)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
