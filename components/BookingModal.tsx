import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, DollarSign, Music, Info } from 'lucide-react';
import { DJProfile, Venue, Booking, BookingStatus } from '../types';
import { MockDB } from '../services/mockDb';
import { MOCK_VENUES } from '../constants';
import { parseISO, getDay, getMonth } from 'date-fns';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dj: DJProfile;
  plannerId: string;
  onConfirm: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, dj, plannerId, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [selectedVenueId, setSelectedVenueId] = useState<string>(MOCK_VENUES.filter(v => v.plannerId === plannerId)[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('22:00');
  const [offer, setOffer] = useState(dj.baseRate);
  const [notes, setNotes] = useState('');
  const [priceBreakdown, setPriceBreakdown] = useState<string>('');

  const platformFee = 15; // Flat fee mock

  // Calculation Logic
  useEffect(() => {
    if (!date || !dj.detailedRates) return;

    const dateObj = parseISO(date);
    const dayOfWeek = getDay(dateObj); // 0 = Sun, 6 = Sat
    const month = getMonth(dateObj); // 0 = Jan

    let calculatedRate = dj.detailedRates.weekday;
    let breakdown = 'Weekday Rate';

    // 1. Weekend Check (Fri, Sat, Sun)
    if (dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6) {
        calculatedRate = dj.detailedRates.weekend;
        breakdown = 'Weekend Rate';
    }

    // 2. Holiday Check (Mock logic for NYE)
    const isNYE = date.endsWith('-12-31');
    if (isNYE) {
        calculatedRate = dj.detailedRates.holiday;
        breakdown = 'Holiday Rate (NYE)';
    }

    // 3. Peak Season Multiplier (June, July, Aug)
    if (month >= 5 && month <= 7) {
        if (dj.detailedRates.peakMultiplier > 1) {
            calculatedRate = Math.round(calculatedRate * dj.detailedRates.peakMultiplier);
            breakdown += ` + Peak Season (x${dj.detailedRates.peakMultiplier})`;
        }
    }
    
    // 4. Travel (Mock: Assume some standard travel fee is needed if not 0)
    if (dj.detailedRates.travelBaseFee > 0) {
       // In a real app, we'd calc distance between venue and DJ city
       // For now, just hint at it or include base
       // We won't add it to the offer automatically to let them negotiate, but we'll show it in breakdown text
    }

    setOffer(calculatedRate);
    setPriceBreakdown(breakdown);

  }, [date, dj.detailedRates]);

  const handleBook = () => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      plannerId,
      djId: dj.id,
      venueId: selectedVenueId,
      date,
      timeStart: time,
      durationHours: 4,
      status: BookingStatus.PENDING,
      agreedFee: offer,
      platformFee,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MockDB.createBooking(newBooking);
    onConfirm();
    onClose();
    // Reset
    setStep(1);
    setNotes('');
    setDate('');
    setPriceBreakdown('');
  };

  const myVenues = MOCK_VENUES.filter(v => v.plannerId === plannerId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-1000">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, rotateX: 45, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
            exit={{ opacity: 0, rotateX: -45, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-lg glass-panel rounded-xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-night-800/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-neon-pink" />
                Book {dj.stageName}
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 text-slate-200">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Select Venue</label>
                    <select 
                      value={selectedVenueId}
                      onChange={(e) => setSelectedVenueId(e.target.value)}
                      className="w-full bg-night-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                    >
                      {myVenues.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Date</label>
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-night-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Start Time</label>
                      <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full bg-night-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                      />
                    </div>
                  </div>
                  
                  {priceBreakdown && (
                     <div className="flex items-start gap-2 p-3 bg-neon-purple/10 border border-neon-purple/20 rounded-lg text-xs text-neon-purple">
                        <Info className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <span className="font-bold">Suggested Rate Updated:</span> {priceBreakdown}
                        </div>
                     </div>
                  )}

                  <div className="flex justify-end mt-6">
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!date}
                      className="bg-neon-purple hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50"
                    >
                      Next: Offer
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Your Offer ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="number" 
                        value={offer}
                        onChange={(e) => setOffer(Number(e.target.value))}
                        className="w-full bg-night-900 border border-slate-700 rounded p-2 pl-9 text-sm focus:ring-2 focus:ring-neon-purple outline-none"
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        {priceBreakdown ? `Based on: ${priceBreakdown}` : `Base rate: $${dj.baseRate}`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-1">Event Notes / Vibe</label>
                    <textarea 
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="E.g. Black tie event, minimal techno only..."
                      className="w-full bg-night-900 border border-slate-700 rounded p-2 text-sm focus:ring-2 focus:ring-neon-purple outline-none resize-none"
                    />
                  </div>

                  {dj.detailedRates && dj.detailedRates.travelBaseFee > 0 && (
                      <div className="bg-slate-800/50 p-2 rounded border border-slate-700 text-xs text-slate-400">
                         <span className="font-bold text-slate-300">Travel Policy:</span> Base travel fee of ${dj.detailedRates.travelBaseFee} + ${dj.detailedRates.travelRatePerKm}/km applies for distance > {dj.travelRadiusKm}km.
                      </div>
                  )}

                  <div className="bg-night-900/50 p-3 rounded border border-slate-700 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">DJ Fee</span>
                      <span>${offer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Platform Fee</span>
                      <span>${platformFee}</span>
                    </div>
                    <div className="border-t border-slate-700 my-1 pt-1 flex justify-between font-bold text-neon-blue">
                      <span>Total</span>
                      <span>${offer + platformFee}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-slate-400 hover:text-white px-4 py-2 transition-colors"
                    >
                      Back
                    </button>
                    <button 
                      onClick={handleBook}
                      className="bg-neon-blue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg shadow-blue-900/20 transition-all"
                    >
                      Confirm Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;