import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import { Calendar, DollarSign, Clock, Music, Wallet, CreditCard, CheckCircle, X, TrendingUp, ArrowRight, User } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { BookingStatus } from '../types';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const DJDashboard: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  const djId = currentUser?.id || '';
  
  // We use state for bookings to force re-render on mock updates
  const [bookings, setBookings] = useState(MockDB.getBookingsForDJ(djId));
  
  // Payout Modal State
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutDetailsVerified, setPayoutDetailsVerified] = useState(false);
  const [isSavingPayout, setIsSavingPayout] = useState(false);

  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
  const upcomingBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED && new Date(b.date) > new Date());
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
  
  const upcomingPayouts = upcomingBookings.reduce((acc, curr) => acc + curr.agreedFee, 0);
  const totalEarned = completedBookings.reduce((acc, curr) => acc + curr.agreedFee, 0);
  const pipelineValue = upcomingBookings.reduce((acc, curr) => acc + curr.agreedFee, 0); // Same as upcoming payouts for this context

  const handleAction = (bookingId: string, action: 'ACCEPT' | 'REJECT') => {
    const status = action === 'ACCEPT' ? BookingStatus.CONFIRMED : BookingStatus.REJECTED;
    MockDB.updateBookingStatus(bookingId, status);
    setBookings(MockDB.getBookingsForDJ(djId)); // Refresh local state
  };

  const handleSavePayoutDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayout(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingPayout(false);
      setPayoutDetailsVerified(true);
      setIsPayoutModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 relative">
       <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Hey, {currentUser?.name}</h1>
           <p className="text-slate-400">Your booking pipeline looks healthy.</p>
        </div>
        <div className="flex items-center gap-6">
            <Link to="/profile/edit" className="hidden md:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium">
                <User className="w-4 h-4" /> Edit Profile
            </Link>
            <Link to="/availability" className="hidden md:flex items-center gap-2 text-sm text-neon-cyan hover:text-white transition-colors font-medium">
                Manage Calendar <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <TiltCard>
             <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-blue/20 rounded-xl text-neon-blue">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{upcomingBookings.length}</div>
                <div className="text-slate-400 text-sm">Upcoming Gigs</div>
             </div>
         </TiltCard>
         
         <TiltCard>
             <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-purple/20 rounded-xl text-neon-purple">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{pendingBookings.length}</div>
                <div className="text-slate-400 text-sm">Pending Requests</div>
             </div>
         </TiltCard>

         <TiltCard>
             <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">${pipelineValue}</div>
                <div className="text-slate-400 text-sm">Pipeline Value</div>
             </div>
         </TiltCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Pipeline */}
         <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white">Requests & Bookings</h2>
            
            {pendingBookings.length > 0 && (
                <div className="space-y-4 mb-8">
                    <p className="text-xs font-bold uppercase text-neon-purple tracking-wider">Action Required</p>
                    {pendingBookings.map(booking => {
                        const venue = MockDB.getVenue(booking.venueId);
                        return (
                            <div key={booking.id} className="bg-gradient-to-r from-night-800 to-night-900 border border-neon-purple/30 p-5 rounded-xl shadow-lg shadow-purple-900/10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-neon-purple" />
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{venue?.name}</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4" /> {format(parseISO(booking.date), 'MMMM d, yyyy')} 
                                            <Clock className="w-4 h-4 ml-2" /> {booking.timeStart}
                                        </p>
                                        <p className="text-slate-300 mt-2 text-sm italic">"{booking.notes}"</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right mr-4">
                                            <div className="text-2xl font-bold text-white">${booking.agreedFee}</div>
                                            <div className="text-xs text-slate-500">Offer</div>
                                        </div>
                                        <button 
                                            onClick={() => handleAction(booking.id, 'REJECT')}
                                            className="px-4 py-2 rounded bg-night-700 hover:bg-red-900/50 text-slate-300 hover:text-red-400 text-sm font-semibold transition-colors"
                                        >
                                            Decline
                                        </button>
                                        <button 
                                            onClick={() => handleAction(booking.id, 'ACCEPT')}
                                            className="px-4 py-2 rounded bg-neon-purple hover:bg-purple-600 text-white text-sm font-semibold shadow-lg shadow-purple-900/20 transition-colors"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {upcomingBookings.map(booking => {
                const venue = MockDB.getVenue(booking.venueId);
                 return (
                    <div key={booking.id} className="bg-night-900/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:bg-night-900/60 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-500">
                                <Music className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{venue?.name}</h3>
                                <p className="text-sm text-slate-400">{format(parseISO(booking.date), 'MMM d, yyyy')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase border border-green-500/20">Confirmed</div>
                        </div>
                    </div>
                 )
            })}

            {pendingBookings.length === 0 && upcomingBookings.length === 0 && (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500">
                    No upcoming activity.
                </div>
            )}
         </div>
         
         {/* Right Column */}
         <div className="lg:col-span-1 space-y-6">
            
            {/* Earnings Overview Section - Moved here as standalone */}
            <div className="bg-night-900/30 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 relative z-10">
                    <Wallet className="w-5 h-5 text-green-400" />
                    Earnings Overview
                </h3>

                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center p-3 bg-night-950/50 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-sm">Upcoming Payouts</span>
                        <span className="text-xl font-bold text-white">${upcomingPayouts}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-night-950/50 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-sm">Total Earned</span>
                        <span className="text-xl font-bold text-slate-300">${totalEarned}</span>
                    </div>

                    <div className="pt-2">
                        {payoutDetailsVerified ? (
                            <div className="w-full py-2 px-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Payout Details Verified
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsPayoutModalOpen(true)}
                                className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-700"
                            >
                                <CreditCard className="w-4 h-4" />
                                Confirm Payout Details
                            </button>
                        )}
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Payout Details Modal */}
      <AnimatePresence>
        {isPayoutModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 perspective-1000">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-night-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-10"
                >
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-night-800/50">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-400" />
                            Payout Settings
                        </h2>
                        <button onClick={() => setIsPayoutModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                    <form onSubmit={handleSavePayoutDetails} className="p-6 space-y-4">
                        <p className="text-sm text-slate-400 mb-4">
                            Enter your bank details to receive payouts for completed gigs.
                        </p>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Account Holder Name</label>
                            <input type="text" required className="w-full bg-night-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Bank Name</label>
                            <input type="text" required className="w-full bg-night-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="e.g. Chase" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Account Number</label>
                                <input type="text" required className="w-full bg-night-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="********" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Sort Code / Routing</label>
                                <input type="text" required className="w-full bg-night-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none" placeholder="12-34-56" />
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-3">
                             <button type="button" onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2">Cancel</button>
                             <button 
                                type="submit" 
                                disabled={isSavingPayout}
                                className="bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-6 py-2 rounded-lg shadow-lg shadow-green-900/20 transition-all flex items-center gap-2 disabled:opacity-50"
                             >
                                {isSavingPayout ? 'Verifying...' : 'Save & Verify'}
                             </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DJDashboard;