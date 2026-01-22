import React, { useContext } from 'react';
import { AppContext } from '../App';
import { ArrowRight, CheckCircle, Shield, Zap, BarChart3, Calendar, Globe, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Turntable3D from '../components/Turntable3D';

const VenueLogo = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center px-8 opacity-50 hover:opacity-100 transition-opacity duration-300">
    <span className="text-xl font-bold uppercase tracking-widest text-white whitespace-nowrap">{name}</span>
  </div>
);

const LandingPage: React.FC = () => {
  const { login } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-night-950 text-white flex flex-col font-sans overflow-hidden selection:bg-neon-purple selection:text-white">
      
      {/* Nav */}
      <header className="w-full py-6 px-8 flex justify-between items-center z-50 fixed top-0 left-0 right-0 bg-night-950/80 backdrop-blur-md border-b border-white/5">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-purple rounded-full blur-[2px] shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          <span className="relative z-10">NightShift</span>
        </div>
        <div className="flex items-center gap-6">
             <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Platform</button>
             <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Venues</button>
             <button className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">Artists</button>
             <button onClick={() => login('PLANNER')} className="text-sm font-semibold bg-white text-night-950 px-5 py-2 rounded-full hover:bg-slate-200 transition-colors">
                Get Started
             </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 grid-bg pointer-events-none" />
        
        {/* Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-bold uppercase tracking-wide text-neon-cyan mb-6">
                    <Zap className="w-3 h-3" /> v2.0 Enterprise Edition
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                    The Operating System for <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">Nightlife.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed">
                    Automate bookings, simplify payments, and manage artist compliance in one unified workspace. Used by the world's top 100 clubs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => login('PLANNER')}
                        className="group relative px-8 py-4 bg-white text-night-950 rounded-xl font-bold text-lg overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative flex items-center gap-2">
                            Start Booking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <button 
                        onClick={() => login('DJ')}
                        className="px-8 py-4 bg-night-800 border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-night-700 transition-colors flex items-center gap-2"
                    >
                        <Play className="w-4 h-4 fill-current" /> Artist Access
                    </button>
                </div>
                
                <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-night-950 bg-slate-700" style={{ backgroundImage: `url(https://picsum.photos/seed/${i}/100)` , backgroundSize: 'cover'}} />
                        ))}
                    </div>
                    <span>Trusted by 500+ planners worldwide</span>
                </div>
            </motion.div>
            
            <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 className="relative"
            >
                <Turntable3D />
            </motion.div>
        </div>
      </section>

      {/* Logo Marquee */}
      <section className="border-y border-white/5 bg-night-900/30 py-10 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-night-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-night-950 to-transparent z-10" />
        
        <div className="flex animate-marquee w-[200%]">
            {/* Duplicated list for seamless loop */}
            <div className="flex gap-20 items-center min-w-full justify-around">
                {['Pacha', 'Fabric', 'Space', 'Berghain', 'Hakkasan', 'Omnia', 'Printworks', 'Amnesia'].map((name, i) => (
                    <VenueLogo key={i} name={name} />
                ))}
            </div>
             <div className="flex gap-20 items-center min-w-full justify-around">
                {['Pacha', 'Fabric', 'Space', 'Berghain', 'Hakkasan', 'Omnia', 'Printworks', 'Amnesia'].map((name, i) => (
                    <VenueLogo key={`dup-${i}`} name={name} />
                ))}
            </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <br /><span className="text-neon-blue">Run The Show.</span></h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Replace the chaos of WhatsApp, email threads, and spreadsheets with a single, powerful dashboard designed for nightlife professionals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: Smart Availability (Large) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 bg-night-900 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-neon-purple/50 transition-colors"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10 mb-8">
                        <div className="w-12 h-12 bg-neon-purple/20 rounded-xl flex items-center justify-center text-neon-purple mb-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Smart Availability Engine</h3>
                        <p className="text-slate-400 max-w-sm">Real-time syncing with artist calendars. Eliminate double bookings and back-and-forth negotiations instantly.</p>
                    </div>

                    {/* Mock UI */}
                    <div className="bg-night-950 border border-slate-800 rounded-xl p-4 shadow-2xl max-w-md transform group-hover:-translate-y-2 transition-transform duration-500">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                             <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                             </div>
                             <div className="text-[10px] uppercase font-bold text-slate-500">November 2023</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                             {[...Array(14)].map((_, i) => (
                                 <div key={i} className={`h-8 rounded-md flex items-center justify-center text-xs font-medium
                                    ${i === 3 || i === 8 ? 'bg-neon-purple text-white shadow-lg shadow-purple-900/50' : 'bg-slate-800/50 text-slate-500'}
                                 `}>
                                     {15 + i}
                                 </div>
                             ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2 bg-night-900 p-2 rounded border border-slate-800">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                             <div>
                                 <div className="text-xs font-bold text-white">DJ Solomun</div>
                                 <div className="text-[10px] text-green-400">Confirmed • $15k</div>
                             </div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 2: Instant Payouts */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-night-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/50 transition-colors"
                >
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 mb-4 relative z-10">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 relative z-10">Instant Payouts</h3>
                    <p className="text-slate-400 text-sm mb-8 relative z-10">Automated splits and payments upon gig completion.</p>
                    
                    {/* Mock UI */}
                    <div className="relative z-10 bg-night-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 transform group-hover:scale-105 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">Payment Sent</div>
                            <div className="text-xs text-slate-500">Processed in 1.2s</div>
                        </div>
                        <div className="ml-auto font-mono font-bold text-green-400">+$2,400</div>
                    </div>
                </motion.div>

                {/* Card 3: Verified Talent */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     className="bg-night-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                    
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Verified Talent</h3>
                    <p className="text-slate-400 text-sm mb-6">Every artist is vetted. ID verification and portfolio checks standard.</p>

                    <div className="flex -space-x-3 relative z-10">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-night-900 bg-slate-700 relative" style={{ backgroundImage: `url(https://picsum.photos/seed/dj${i}/100)` , backgroundSize: 'cover'}}>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-night-900 flex items-center justify-center">
                                    <CheckCircle className="w-2 h-2 text-white" />
                                </div>
                            </div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-night-900 bg-night-800 flex items-center justify-center text-xs font-bold text-slate-400">
                            +2k
                        </div>
                    </div>
                </motion.div>

                {/* Card 4: Analytics (Col-span-2) */}
                <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.3 }}
                     className="md:col-span-2 bg-night-900 border border-slate-800 rounded-3xl p-8 overflow-hidden relative group hover:border-neon-pink/50 transition-colors flex flex-col md:flex-row items-center gap-8"
                >
                    <div className="flex-1 relative z-10">
                        <div className="w-12 h-12 bg-neon-pink/20 rounded-xl flex items-center justify-center text-neon-pink mb-4">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Performance Analytics</h3>
                        <p className="text-slate-400">Track spend, artist performance, and venue capacity trends. Data-driven booking decisions.</p>
                    </div>

                    {/* Mock Chart */}
                    <div className="flex-1 w-full h-40 flex items-end gap-2 px-4 pb-4 border-b border-l border-slate-800 bg-night-950/50 rounded-lg">
                        {[30, 50, 45, 70, 60, 90, 65].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-800 rounded-t-sm relative group-hover:bg-neon-pink/50 transition-colors duration-500 overflow-hidden">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${h}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-full bg-neon-pink absolute bottom-0 left-0 right-0"
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/20 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to upgrade your venue?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => login('ADMIN')}
                        className="px-8 py-4 bg-white text-night-950 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                        Start Free Trial
                    </button>
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                        Contact Sales
                    </button>
              </div>
              <p className="mt-6 text-sm text-slate-500">No credit card required for demo access.</p>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-night-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
                <div className="font-bold text-white mb-4">Platform</div>
                <ul className="space-y-2">
                    <li>Planner Dashboard</li>
                    <li>Artist Portal</li>
                    <li>Venue Management</li>
                    <li>Pricing</li>
                </ul>
            </div>
            <div>
                <div className="font-bold text-white mb-4">Company</div>
                <ul className="space-y-2">
                    <li>About Us</li>
                    <li>Careers</li>
                    <li>Blog</li>
                    <li>Press</li>
                </ul>
            </div>
            <div>
                <div className="font-bold text-white mb-4">Resources</div>
                <ul className="space-y-2">
                    <li>Help Center</li>
                    <li>API Documentation</li>
                    <li>Status</li>
                    <li>Security</li>
                </ul>
            </div>
            <div>
                <div className="font-bold text-white mb-4">Legal</div>
                <ul className="space-y-2">
                    <li>Privacy</li>
                    <li>Terms</li>
                    <li>Cookie Policy</li>
                </ul>
            </div>
        </div>
        <div className="text-center border-t border-white/5 pt-8">
            <p>&copy; {new Date().getFullYear()} NightShift Inc. San Francisco, CA.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;