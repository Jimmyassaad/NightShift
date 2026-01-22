import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { CalendarOff } from 'lucide-react';

const DJAvailability: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  const djId = currentUser?.id || '';
  
  // We use state to force re-renders when mock data changes
  const [bookings] = useState(MockDB.getBookingsForDJ(djId));
  const [profile, setProfile] = useState(MockDB.getDJProfile(djId));

  const handleToggleDate = (date: string) => {
    MockDB.toggleBlockDate(djId, date);
    setProfile(prev => {
        const updated = MockDB.getDJProfile(djId);
        return updated ? { ...updated } : prev; 
    });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-neon-purple/10 rounded-xl text-neon-purple border border-neon-purple/20">
                <CalendarOff className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white">Availability Management</h1>
                <p className="text-slate-400 text-sm">Click dates to block or unblock them for bookings.</p>
            </div>
        </div>
        
        <div className="flex-1 bg-night-900/20 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <AvailabilityCalendar 
                bookings={bookings}
                blockedDates={profile?.blockedDates || []}
                onToggleDate={handleToggleDate}
            />
        </div>
    </div>
  );
};

export default DJAvailability;