import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths, 
  isToday, 
  parseISO,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { ChevronLeft, ChevronRight, Ban, Check, CalendarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking, BookingStatus } from '../types';

interface AvailabilityCalendarProps {
  bookings: Booking[];
  blockedDates: string[];
  onToggleDate: (date: string) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ bookings, blockedDates, onToggleDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Helpers to get status
  const getBookingForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.find(b => b.date === dateStr && b.status === BookingStatus.CONFIRMED);
  };

  const getPendingBookingForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.find(b => b.date === dateStr && b.status === BookingStatus.PENDING);
  };

  const isBlocked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return blockedDates.includes(dateStr);
  };

  return (
    <div className="bg-night-900/30 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-slate-800 bg-night-900/50">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <CalendarOff className="w-5 h-5 text-neon-purple" />
            Manage Availability
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-slate-200 min-w-[100px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days Grid Header */}
      <div className="grid grid-cols-7 bg-night-900/30 border-b border-slate-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] uppercase font-bold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {calendarDays.map((day, dayIdx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const booked = getBookingForDate(day);
          const pending = getPendingBookingForDate(day);
          const blocked = isBlocked(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          // Determine styles based on state
          let bgClass = 'bg-transparent hover:bg-slate-800/50';
          let textClass = isCurrentMonth ? 'text-slate-300' : 'text-slate-700';
          let cursorClass = 'cursor-pointer';
          let statusIcon = null;

          if (booked) {
            bgClass = 'bg-neon-purple/20 border-neon-purple/30 shadow-[inset_0_0_10px_rgba(168,85,247,0.2)]';
            textClass = 'text-white font-semibold';
            cursorClass = 'cursor-not-allowed';
          } else if (blocked) {
            bgClass = 'bg-red-900/10 hover:bg-red-900/20 pattern-diagonal-lines';
            textClass = 'text-slate-500';
          } else if (pending) {
            bgClass = 'bg-yellow-500/10 border-yellow-500/30';
            textClass = 'text-yellow-200';
          }

          return (
            <div 
              key={dateStr}
              onClick={() => {
                if (!booked) onToggleDate(dateStr);
              }}
              className={`
                relative min-h-[80px] p-2 border-r border-b border-slate-800/50 transition-colors
                ${bgClass} ${textClass} ${cursorClass}
                ${!isCurrentMonth ? 'bg-night-950/50' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-medium ${isTodayDate ? 'bg-neon-blue text-white px-1.5 rounded-full' : ''}`}>
                    {format(day, 'd')}
                </span>
                {blocked && <Ban className="w-3 h-3 text-red-500" />}
                {booked && <Check className="w-3 h-3 text-neon-purple" />}
              </div>

              <div className="mt-2">
                {booked && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] leading-tight bg-neon-purple/20 text-neon-purple px-1 py-0.5 rounded border border-neon-purple/20 truncate"
                  >
                    GIG
                  </motion.div>
                )}
                {pending && (
                   <div className="text-[9px] leading-tight bg-yellow-500/20 text-yellow-400 px-1 py-0.5 rounded border border-yellow-500/20 truncate">
                    REQ
                  </div>
                )}
                {blocked && (
                  <div className="text-[9px] text-center mt-1 font-medium text-red-500/50 select-none">
                    BLOCKED
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-3 border-t border-slate-800 bg-night-900/50 text-xs text-slate-500 flex gap-4">
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-purple"></div> Booked
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Pending
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-700 border border-slate-600"></div> Available
        </div>
        <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border border-red-500/50 bg-red-900/20"></div> Blocked
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;