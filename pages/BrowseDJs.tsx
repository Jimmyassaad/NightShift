import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import { DJProfile, Genre } from '../types';
import TiltCard from '../components/TiltCard';
import BookingModal from '../components/BookingModal';
import { Search, MapPin, Music, Star, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowseDJs: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDJ, setSelectedDJ] = useState<DJProfile | null>(null);

  const djs = MockDB.getAllDJs();

  const filteredDJs = djs.filter(dj => {
    const matchesSearch = dj.stageName.toLowerCase().includes(searchTerm.toLowerCase()) || dj.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || dj.genres.includes(selectedGenre as Genre);
    return matchesSearch && matchesGenre;
  });

  const handleRequestBooking = (dj: DJProfile) => {
    setSelectedDJ(dj);
    setBookingModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <h1 className="text-3xl font-bold text-white">Find Talent</h1>
        
        {/* Filter Bar */}
        <div className="flex gap-4 w-full md:w-auto bg-night-900/80 p-2 rounded-xl border border-slate-800">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search DJs or Cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:ring-0 pl-9 h-9"
              />
           </div>
           <div className="h-9 w-px bg-slate-700" />
           <select 
             value={selectedGenre}
             onChange={(e) => setSelectedGenre(e.target.value)}
             className="bg-transparent border-none text-sm text-slate-300 focus:ring-0 cursor-pointer"
           >
              <option value="All">All Genres</option>
              {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDJs.map(dj => (
          <TiltCard key={dj.id} className="h-full">
            <motion.div 
               layoutId={`dj-card-${dj.id}`}
               className="bg-night-900 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col group hover:border-neon-purple/50 transition-colors shadow-lg"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={dj.imageUrl} alt={dj.stageName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-night-900 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <h2 className="text-xl font-bold text-white drop-shadow-lg">{dj.stageName}</h2>
                   <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-400 border border-white/10">
                     <Star className="w-3 h-3 fill-yellow-400" /> {dj.rating}
                   </div>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-3">
                   <MapPin className="w-3 h-3" /> {dj.city}
                   <span className="w-1 h-1 rounded-full bg-slate-600" />
                   <span className="text-neon-cyan">
                        {dj.detailedRates 
                            ? `From $${dj.detailedRates.weekday}${dj.rateType === 'HOURLY' ? '/hr' : ''}`
                            : `$${dj.baseRate}${dj.rateType === 'HOURLY' ? '/hr' : ''}`
                        }
                   </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {dj.genres.slice(0, 3).map(g => (
                    <span key={g} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold tracking-wide border border-slate-700">
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{dj.bio}</p>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent tilt card click if necessary
                    handleRequestBooking(dj);
                  }}
                  className="w-full bg-slate-800 hover:bg-neon-purple hover:text-white text-slate-200 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Request Booking
                </button>
              </div>
            </motion.div>
          </TiltCard>
        ))}
      </div>

      {selectedDJ && currentUser && (
        <BookingModal 
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          dj={selectedDJ}
          plannerId={currentUser.id}
          onConfirm={() => {
              // Maybe show a toast notification
              console.log("Booking confirmed");
          }}
        />
      )}
    </div>
  );
};

export default BrowseDJs;