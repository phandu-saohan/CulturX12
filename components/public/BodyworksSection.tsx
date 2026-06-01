'use client';
import React, { useState } from 'react';
import { HeartPulse, Check, CheckCircle } from 'lucide-react';
import { CulturXData, Booking } from '@/lib/initialData';

interface BodyworksSectionProps {
  siteData: CulturXData;
  onBookTreatment: (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export default function BodyworksSection({ siteData, onBookTreatment }: BodyworksSectionProps) {
  const [selectedTxId, setSelectedTxId] = useState(siteData.bodyworks.treatments[0]?.id || '');
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', hotelName: '', hotelRoom: '', preferredTime: '', therapistProfile: 'Senior Practitioner' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const activeTreatment = siteData.bodyworks.treatments.find(t => t.id === selectedTxId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.hotelName || !bookingForm.preferredTime) {
      alert('Please fill in all required fields marked with (*).');
      return;
    }
    const txObj = siteData.bodyworks.treatments.find(t => t.id === selectedTxId);
    if (!txObj) return;
    onBookTreatment({ treatmentId: txObj.id, treatmentName: txObj.name, costUSD: txObj.costUSD, durationMin: txObj.durationMin, clientName: bookingForm.name, clientEmail: bookingForm.email, clientPhone: bookingForm.phone, hotelName: bookingForm.hotelName, hotelRoom: bookingForm.hotelRoom, preferredTime: bookingForm.preferredTime, therapistProfile: bookingForm.therapistProfile });
    setBookingSuccess(true);
    setBookingForm({ name: '', email: '', phone: '', hotelName: '', hotelRoom: '', preferredTime: '', therapistProfile: 'Senior Practitioner' });
    setTimeout(() => setBookingSuccess(false), 9000);
  };

  return (
    <>
      {/* TREATMENT BODYWORKS & IN-ROOM RECOVERY */}
      <section id="bodyworks" className="bg-[#050505] py-12 px-6 lg:px-24 border-t border-neutral-900 scroll-mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <div className="xl:col-span-7 space-y-6">
            <span className="kicker text-[10px] uppercase tracking-[4px] text-brand-gold font-mono font-bold block">{siteData.bodyworks.kicker}</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-display text-white tracking-wider leading-none">
              {siteData.bodyworks.heading.includes('.') ? (
                <>
                  {siteData.bodyworks.heading.split('.')[0]}.<br />
                  <span className="text-brand-gold">{siteData.bodyworks.heading.split('.').slice(1).join('.')}</span>
                </>
              ) : (
                <span className="text-brand-gold">{siteData.bodyworks.heading}</span>
              )}
            </h2>
            <p className="text-brand-soft text-sm md:text-base italic max-w-xl">
              {siteData.bodyworks.subline}
            </p>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl">
              {siteData.bodyworks.paragraph}
            </p>

            <div className="py-2">
              <span className="text-2xl md:text-4xl font-black uppercase tracking-wider font-display block leading-none text-white">
                {siteData.bodyworks.statement.includes('.') ? (
                  <>
                    {siteData.bodyworks.statement.split('.')[0]}.<br />
                    <span className="text-brand-gold">{siteData.bodyworks.statement.split('.').slice(1).join('.')}</span>
                  </>
                ) : (
                  <span className="text-brand-gold">{siteData.bodyworks.statement}</span>
                )}
              </span>
            </div>

            {/* Core physical text card */}
            <div className="card bg-neutral-950 border border-brand-line/65 rounded-3xl p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold text-brand-gold uppercase tracking-widest font-display flex items-center space-x-2">
                <HeartPulse className="w-4 h-4 text-brand-gold" />
                <span>{siteData.bodyworks.cardTitle}</span>
              </h3>
              {siteData.bodyworks.cardTexts.map((txtStr, idx) => (
                <p key={idx} className="text-xs md:text-sm text-zinc-300 leading-relaxed">
                  {txtStr}
                </p>
              ))}
            </div>

            {/* Treatment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {siteData.bodyworks.treatments.map((tx) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTxId(tx.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTxId === tx.id 
                      ? 'bg-neutral-900 border-brand-gold' 
                      : 'bg-neutral-950 border-brand-line/20 hover:border-brand-line/50'
                  }`}
                >
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase text-white font-display tracking-wider">{tx.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono font-bold uppercase">
                      {tx.durationMin} MIN · <span className="text-brand-gold">${tx.costUSD} USD</span>
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-snug line-clamp-3">
                      {tx.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-neutral-900 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Select Protocol</span>
                    {selectedTxId === tx.id && <Check className="w-4 h-4 text-brand-gold" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Request Form Side */}
          <div className="xl:col-span-5">
            <div className="bg-neutral-950 border border-brand-line p-6 md:p-8 rounded-3xl sticky top-24 shadow-2xl space-y-6">
              
              <div className="space-y-1">
                <span className="text-[10px] text-brand-gold font-mono font-bold tracking-widest block uppercase">RECOVERY CONCIERGE scheduler</span>
                <h3 className="text-lg font-bold font-display text-white uppercase">Instant Hotel Scheduler</h3>
                {activeTreatment && (
                  <p className="text-xs text-zinc-400 mt-1">
                    Book <strong className="text-brand-gold uppercase">{activeTreatment.name}</strong> ({activeTreatment.durationMin} min - ${activeTreatment.costUSD} USD)
                  </p>
                )}
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-950 border border-green-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-md font-bold text-white uppercase tracking-wider font-display">Enquiry Submitted</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Your luxury recovery booking request has been securely recorded into our central CRM coordinator. A therapist lead will contact your phone number to coordinate security clearances.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={bookingForm.name}
                      onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Marcus Aurelius"
                      className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Email Address *</label>
                      <input 
                        type="email" 
                        required
                        value={bookingForm.email}
                        onChange={e => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="marcus@gmail.com"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Phone Number *</label>
                      <input 
                        type="tel" 
                        required
                        value={bookingForm.phone}
                        onChange={e => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+61 411 222 333"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Luxury Hotel Name *</label>
                      <input 
                        type="text" 
                        required
                        value={bookingForm.hotelName}
                        onChange={e => setBookingForm(prev => ({ ...prev, hotelName: e.target.value }))}
                        placeholder="Park Hyatt Melbourne"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Suite / Room No.</label>
                      <input 
                        type="text" 
                        value={bookingForm.hotelRoom}
                        onChange={e => setBookingForm(prev => ({ ...prev, hotelRoom: e.target.value }))}
                        placeholder="Suite 405"
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Preferred Time *</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={bookingForm.preferredTime}
                        onChange={e => setBookingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-gold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-brand-soft uppercase tracking-widest block mb-1">Therapist Profile</label>
                      <select 
                        value={bookingForm.therapistProfile}
                        onChange={e => setBookingForm(prev => ({ ...prev, therapistProfile: e.target.value }))}
                        className="w-full bg-neutral-900 border border-brand-line/40 rounded-xl px-4-2 py-3 text-xs text-white focus:outline-none focus:border-brand-gold"
                      >
                        <option value="Senior Practitioner">Senior Practitioner (Default)</option>
                        <option value="Visceral Specialist">Visceral Gut Specialist</option>
                        <option value="Deep Tissue Therapist">Deep Fascial Specialist</option>
                        <option value="Male Architect preferred">Male Therapist Preferred</option>
                        <option value="Female Architect preferred">Female Therapist Preferred</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 mt-2 bg-gradient-to-r from-brand-gold to-yellow-600 text-brand-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-[1.01] transition duration-200 cursor-pointer text-center"
                  >
                    Transmit Booking Request
                  </button>

                  <p className="text-[10px] text-center text-zinc-500 max-w-xs mx-auto">
                    By submitting this scheduler, you consent to coordinate with verified therapist architects dispatched from the Melb central pool.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
