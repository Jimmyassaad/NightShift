import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { MockDB } from '../services/mockDb';
import { Genre, DJProfile } from '../types';
import { Save, X, Camera, Music, MapPin, DollarSign, Instagram, Link, CalendarDays, Sun, Car } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { currentUser } = useContext(AppContext);
  const navigate = useNavigate();
  const djId = currentUser?.id || '';

  const [profile, setProfile] = useState<DJProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<DJProfile>>({});

  useEffect(() => {
    const p = MockDB.getDJProfile(djId);
    if (p) {
      setProfile(p);
      setFormData(p);
    }
    setLoading(false);
  }, [djId]);

  const handleChange = (field: keyof DJProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRateChange = (field: keyof DJProfile['detailedRates'], value: number) => {
    setFormData(prev => ({
      ...prev,
      detailedRates: {
        ...prev.detailedRates!,
        [field]: value
      }
    }));
  };

  const handleSocialChange = (platform: 'soundcloud' | 'instagram', value: string) => {
    setFormData(prev => ({
        ...prev,
        socials: {
            ...prev.socials,
            [platform]: value
        }
    }));
  };

  const handleGenreToggle = (genre: Genre) => {
    const currentGenres = formData.genres || [];
    if (currentGenres.includes(genre)) {
      handleChange('genres', currentGenres.filter(g => g !== genre));
    } else {
      handleChange('genres', [...currentGenres, genre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Update baseRate to equal weekday rate for sorting purposes
    if (formData.detailedRates) {
        formData.baseRate = formData.detailedRates.weekday;
    }

    // Simulate API delay
    setTimeout(() => {
      MockDB.updateDJProfile(djId, formData);
      setSaving(false);
      navigate('/dashboard');
    }, 800);
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!profile) return <div className="p-8 text-white">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
          <div className="bg-night-900 border border-slate-800 rounded-xl p-6 text-center">
            <div className="relative w-40 h-40 mx-auto mb-4 group cursor-pointer">
              <img 
                src={formData.imageUrl} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-4 border-slate-800 group-hover:border-neon-purple transition-colors" 
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-2">Click to upload new photo (simulated)</p>
            <input 
              type="text" 
              value={formData.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full bg-night-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-neon-purple outline-none"
              placeholder="Image URL..."
            />
          </div>

          <div className="bg-night-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-neon-blue" /> Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(Genre).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenreToggle(g)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase border transition-all ${
                    formData.genres?.includes(g)
                      ? 'bg-neon-purple text-white border-neon-purple shadow-lg shadow-purple-900/20'
                      : 'bg-night-950 text-slate-500 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-night-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Stage Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.stageName || ''}
                  onChange={(e) => handleChange('stageName', e.target.value)}
                  className="w-full bg-night-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">City / Base</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    required
                    value={formData.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full bg-night-950 border border-slate-700 rounded-lg p-3 pl-9 text-white focus:ring-2 focus:ring-neon-purple outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Bio</label>
              <textarea 
                rows={4}
                required
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full bg-night-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-purple outline-none transition-all resize-none"
                placeholder="Tell planners about your style, experience, and vibe..."
              />
            </div>
          </div>

          {/* Advanced Pricing Section */}
          <div className="bg-night-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                 <h3 className="font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" /> Pricing & Rates
                 </h3>
                 <select 
                  value={formData.rateType || 'FLAT'}
                  onChange={(e) => handleChange('rateType', e.target.value)}
                  className="bg-night-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:ring-2 focus:ring-neon-purple outline-none"
                >
                  <option value="FLAT">Flat Fee (Per Gig)</option>
                  <option value="HOURLY">Hourly Rate</option>
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Weekday Rate</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-3 h-3 text-slate-500" />
                        <input 
                            type="number" 
                            value={formData.detailedRates?.weekday || 0}
                            onChange={(e) => handleRateChange('weekday', Number(e.target.value))}
                            className="w-full bg-night-950 border border-slate-700 rounded p-2 pl-8 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Mon-Thu base price</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1 text-neon-purple">Weekend Rate</label>
                    <div className="relative">
                        <CalendarDays className="absolute left-3 top-2.5 w-3 h-3 text-neon-purple" />
                        <input 
                            type="number" 
                            value={formData.detailedRates?.weekend || 0}
                            onChange={(e) => handleRateChange('weekend', Number(e.target.value))}
                            className="w-full bg-night-950 border border-slate-700 rounded p-2 pl-8 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Fri-Sat-Sun price</p>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase mb-1 text-yellow-400">Holiday Rate</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 w-3 h-3 text-yellow-400" />
                        <input 
                            type="number" 
                            value={formData.detailedRates?.holiday || 0}
                            onChange={(e) => handleRateChange('holiday', Number(e.target.value))}
                            className="w-full bg-night-950 border border-slate-700 rounded p-2 pl-8 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">NYE, Special Events</p>
                </div>
            </div>

            <div className="border-t border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                     <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                        <Sun className="w-3 h-3 text-orange-400" /> Peak Season Multiplier
                     </label>
                     <input 
                        type="number" 
                        step="0.1"
                        min="1.0"
                        value={formData.detailedRates?.peakMultiplier || 1.0}
                        onChange={(e) => handleRateChange('peakMultiplier', Number(e.target.value))}
                        className="w-full bg-night-950 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                     />
                     <p className="text-[10px] text-slate-500 mt-1">Applied Jun-Aug (e.g. 1.2 = +20%)</p>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                         <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Car className="w-3 h-3 text-slate-400" /> Travel Base Fee
                         </label>
                         <div className="relative">
                             <span className="absolute left-3 top-2 text-xs text-slate-500">$</span>
                             <input 
                                type="number" 
                                value={formData.detailedRates?.travelBaseFee || 0}
                                onChange={(e) => handleRateChange('travelBaseFee', Number(e.target.value))}
                                className="w-full bg-night-950 border border-slate-700 rounded p-2 pl-6 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                             />
                         </div>
                    </div>
                    <div>
                         <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                            <Car className="w-3 h-3 text-slate-400" /> Travel $/km
                         </label>
                         <div className="relative">
                             <span className="absolute left-3 top-2 text-xs text-slate-500">$</span>
                             <input 
                                type="number" 
                                value={formData.detailedRates?.travelRatePerKm || 0}
                                onChange={(e) => handleRateChange('travelRatePerKm', Number(e.target.value))}
                                className="w-full bg-night-950 border border-slate-700 rounded p-2 pl-6 text-sm text-white focus:ring-1 focus:ring-green-500 outline-none"
                             />
                         </div>
                    </div>
                </div>
            </div>
            
            <div>
               <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Travel Radius Limit (km)</label>
               <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10"
                  value={formData.travelRadiusKm || 0}
                  onChange={(e) => handleChange('travelRadiusKm', Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-purple"
                />
                <div className="text-right text-xs text-slate-400 mt-1">{formData.travelRadiusKm} km</div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-night-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <Link className="w-4 h-4 text-neon-pink" /> Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                          <Instagram className="w-3 h-3" /> Instagram Handle
                      </label>
                      <input 
                          type="text" 
                          value={formData.socials?.instagram || ''}
                          onChange={(e) => handleSocialChange('instagram', e.target.value)}
                          className="w-full bg-night-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-pink outline-none transition-all placeholder-slate-600"
                          placeholder="@username"
                      />
                  </div>
                  <div>
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-1 flex items-center gap-1">
                          <Music className="w-3 h-3" /> SoundCloud Username
                      </label>
                      <input 
                          type="text" 
                          value={formData.socials?.soundcloud || ''}
                          onChange={(e) => handleSocialChange('soundcloud', e.target.value)}
                          className="w-full bg-night-950 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder-slate-600"
                          placeholder="username"
                      />
                  </div>
              </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-lg text-slate-400 hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold shadow-lg shadow-purple-900/20 hover:scale-105 hover:shadow-purple-900/40 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;