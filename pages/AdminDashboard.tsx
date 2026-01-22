import React from 'react';
import { MockDB } from '../services/mockDb';
import { Users, Music, Home, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const allBookings = MockDB.getAllBookings();
  const allDJs = MockDB.getAllDJs();
  
  const totalRevenue = allBookings
    .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    .reduce((acc, b) => acc + b.platformFee, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Platform Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-night-900 border border-slate-800 p-6 rounded-xl">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <Music className="w-4 h-4" /> Active DJs
            </div>
            <div className="text-3xl font-bold text-white">{allDJs.length}</div>
        </div>
        <div className="bg-night-900 border border-slate-800 p-6 rounded-xl">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Bookings
            </div>
            <div className="text-3xl font-bold text-white">{allBookings.length}</div>
        </div>
        <div className="bg-night-900 border border-slate-800 p-6 rounded-xl">
            <div className="text-slate-500 text-xs font-bold uppercase mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Platform Revenue
            </div>
            <div className="text-3xl font-bold text-green-400">${totalRevenue}</div>
        </div>
      </div>

      <div className="bg-night-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">System Health</h2>
        <p className="text-slate-400 text-sm">All systems operational. Database connection active.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;