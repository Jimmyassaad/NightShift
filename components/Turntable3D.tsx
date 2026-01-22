import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const Turntable3D = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for the tilt
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["20deg", "-20deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-20deg", "20deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[500px] flex items-center justify-center perspective-1000 cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-[320px] h-[320px] md:w-[450px] md:h-[360px] bg-night-800 rounded-xl border border-slate-700 shadow-2xl"
      >
        {/* Turntable Base Thickness */}
        <div 
          className="absolute inset-0 bg-night-900 rounded-xl translate-z-[-20px] border border-slate-800"
          style={{ transform: "translateZ(-20px)" }}
        />
        
        {/* Platter */}
        <div 
          style={{ transform: "translateZ(10px)" }}
          className="absolute top-6 left-6 bottom-6 w-[272px] md:w-[312px] rounded-full bg-zinc-800 border border-zinc-700 shadow-inner flex items-center justify-center"
        >
           {/* Vinyl Record */}
           <div className="relative w-[95%] h-[95%] rounded-full bg-black border border-zinc-800 animate-spin-slow shadow-xl">
              {/* Grooves */}
              <div className="absolute inset-2 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="absolute inset-12 rounded-full border border-white/5" />
              <div className="absolute inset-16 rounded-full border border-white/5" />
              <div className="absolute inset-20 rounded-full border border-white/5" />
              
              {/* Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-blue rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
           </div>
        </div>

        {/* Controls / Tonearm Area */}
        <div 
           style={{ transform: "translateZ(20px)" }}
           className="absolute top-0 bottom-0 right-0 w-[80px] md:w-[110px] flex flex-col items-center py-8"
        >
           {/* Tonearm Base */}
           <div className="w-16 h-16 rounded-full bg-zinc-700 border border-zinc-600 shadow-lg mb-4 relative">
              {/* Tonearm */}
              <div className="absolute top-1/2 left-1/2 w-48 h-3 bg-zinc-400 origin-left -translate-y-1/2 rotate-[25deg] rounded-full shadow-xl border border-zinc-300">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-5 bg-black rounded" />
              </div>
           </div>

           {/* Tempo Slider */}
           <div className="w-8 h-32 bg-black rounded-full border border-slate-700 relative mt-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-8 bg-zinc-600 rounded shadow-lg border-t border-white/20 cursor-grab" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/20" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/20" />
           </div>

           {/* Start/Stop Button */}
           <div className="mt-8 w-12 h-12 bg-zinc-700 rounded shadow-lg border border-white/10 flex items-center justify-center active:scale-95 transition-transform cursor-pointer">
             <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-green-400 border-b-[6px] border-b-transparent ml-1" />
           </div>
        </div>
        
        {/* Reflections/Lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-xl pointer-events-none" style={{ transform: "translateZ(30px)" }} />
      </motion.div>
    </div>
  );
};

export default Turntable3D;