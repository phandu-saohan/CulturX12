'use client';
import React from 'react';
import { Enquiry } from '@/lib/initialData';

interface InboxTabProps {
  enquiries: Enquiry[];
  onUpdateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  onDeleteEnquiry: (id: string) => void;
  showToast: (msg: string) => void;
}

export default function InboxTab({ enquiries, onUpdateEnquiryStatus, onDeleteEnquiry, showToast }: InboxTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-widest font-display">Communication Mailroom Inbox</h2>
        <p className="text-xs text-slate-500">Observe client question transceiver elements deposited from footer contact sheets.</p>
      </div>

      {enquiries.length === 0 ? (
        <div className="py-12 border border-slate-205 border-slate-200 bg-slate-50 rounded-2xl text-center text-slate-500 font-sans text-xs">
          Your mailbox registry is empty. Test message submit on public page to verify contact elements.
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div 
              key={enq.id}
              className={`p-5 rounded-2xl border transition-all shadow-xs ${
                enq.status === 'unread' 
                  ? 'bg-indigo-50/40 border-indigo-230 border-indigo-200' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${enq.status === 'unread' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-400'}`}></span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase font-sans">{enq.clientName}</h4>
                    <span className="text-[10.5px] text-slate-550 tracking-wider">Representative Email: <strong className="text-slate-800">{enq.clientEmail}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[10px]">
                  <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-2.5 py-1 rounded font-bold uppercase font-sans">
                    {enq.enquiryType}
                  </span>
                  <span className="text-slate-400 font-bold">{enq.createdAt.split('T')[0]}</span>
                </div>
              </div>

              <div className="py-4 text-xs font-sans text-slate-700 leading-relaxed max-w-4xl whitespace-pre-line">
                {enq.message}
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px]">
                <span className="text-slate-405 text-slate-400 font-mono tracking-widest">ENQUIRY ID: {enq.id}</span>
                <div className="flex space-x-2">
                  {enq.status === 'unread' ? (
                    <button
                      onClick={() => {
                        onUpdateEnquiryStatus(enq.id, 'read');
                        showToast("Marked communication as Handled");
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-md uppercase cursor-pointer text-[10px]"
                    >
                      Mark Handled / Read
                    </button>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 font-bold">✔️ Read Verified</span>
                  )}
                  <button
                    onClick={() => {
                      onDeleteEnquiry(enq.id);
                      showToast("Enquiry message purged.");
                    }}
                    className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-805 rounded transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
