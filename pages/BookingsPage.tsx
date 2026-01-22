import React, { useContext } from 'react';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import { format, parseISO } from 'date-fns';

const BookingsPage: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  
  const bookings = currentUser?.role === 'PLANNER' 
    ? MockDB.getBookingsForPlanner(currentUser.id)
    : currentUser?.role === 'DJ' 
      ? MockDB.getBookingsForDJ(currentUser.id)
      : []; // Admin sees stats in admin dash

  const sortedBookings = [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">All Bookings</h1>
      
      <div className="bg-night-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-night-800 text-slate-200 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">{currentUser?.role === 'PLANNER' ? 'DJ' : 'Venue'}</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedBookings.map(b => {
                const otherParty = currentUser?.role === 'PLANNER' 
                    ? MockDB.getDJProfile(b.djId)?.stageName 
                    : MockDB.getVenue(b.venueId)?.name;
                
                return (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">
                            {format(parseISO(b.date), 'MMM d, yyyy')}
                            <div className="text-xs text-slate-500 font-normal">{b.timeStart}</div>
                        </td>
                        <td className="px-6 py-4">{otherParty}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border
                                ${b.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                  b.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                  b.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                  'bg-slate-700/50 text-slate-400 border-slate-600'}`}>
                                {b.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-mono">
                            ${b.agreedFee}
                        </td>
                    </tr>
                );
            })}
            {sortedBookings.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No bookings found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsPage;