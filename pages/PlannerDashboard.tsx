import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { BookingStatus } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

const PlannerDashboard: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  const bookings = MockDB.getBookingsForPlanner(currentUser?.id || '');
  
  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
  
  const totalSpend = confirmedBookings.reduce((acc, curr) => acc + curr.agreedFee + curr.platformFee, 0);

  // Chart Data
  const data = [
    { name: 'Aug', spend: 1200 },
    { name: 'Sep', spend: 2100 },
    { name: 'Oct', spend: 800 },
    { name: 'Nov', spend: totalSpend }, // Current
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {currentUser?.name}</h1>
           <p className="text-slate-400">Here's what's happening at your venues.</p>
        </div>
        <div className="hidden md:block">
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                PRO PLAN ACTIVE
            </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltCard>
            <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-purple/20 rounded-xl text-neon-purple">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase">This Month</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{confirmedBookings.length + pendingBookings.length}</div>
                <div className="text-slate-400 text-sm">Total Bookings</div>
            </div>
        </TiltCard>

        <TiltCard>
            <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-blue/20 rounded-xl text-neon-blue">
                        <Clock className="w-6 h-6" />
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase">Action Needed</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{pendingBookings.length}</div>
                <div className="text-slate-400 text-sm">Pending Requests</div>
            </div>
        </TiltCard>

        <TiltCard>
            <div className="bg-night-900/50 border border-slate-700 p-6 rounded-2xl h-full backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neon-pink/20 rounded-xl text-neon-pink">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-slate-500 text-xs font-bold uppercase">Spend (Est)</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">${totalSpend}</div>
                <div className="text-slate-400 text-sm">Confirmed Spend</div>
            </div>
        </TiltCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / List */}
        <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-slate-500 text-center py-8 border border-dashed border-slate-800 rounded-xl">No bookings yet.</div>
                ) : (
                    bookings.slice(0, 4).map(booking => {
                         const venue = MockDB.getVenue(booking.venueId);
                         const dj = MockDB.getDJProfile(booking.djId);
                         return (
                            <div key={booking.id} className="group bg-night-900/40 border border-slate-800 hover:border-slate-600 p-4 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={dj?.imageUrl} alt={dj?.stageName} className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <h3 className="font-bold text-white">{dj?.stageName}</h3>
                                        <p className="text-sm text-slate-400">{venue?.name} • {format(parseISO(booking.date), 'MMM d, yyyy')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase 
                                        ${booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 
                                          booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 
                                          'bg-slate-700 text-slate-400'}`}>
                                        {booking.status}
                                    </div>
                                    <span className="font-mono text-slate-300">${booking.agreedFee}</span>
                                </div>
                            </div>
                         );
                    })
                )}
            </div>
        </div>

        {/* Simple Chart */}
        <div className="bg-night-900/30 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Spend Overview</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        />
                        <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 3 ? '#a855f7' : '#334155'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerDashboard;