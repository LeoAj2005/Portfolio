"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// --- Data: Principles ---
const PRINCIPLES = [
  {
    title: "LEAD KINDLY",
    text: "I’m pretty direct, focusing on the most crucial topics to help people succeed. Kindness is key to trustful bonds.",
    color: "bg-orange-500",
    icon: "🧡" 
  },
  {
    title: "STEADY GROWTH",
    text: "I lead start-ups and teams that scale with resilience over change by honing: Toolsets, skillsets, and mindsets.",
    color: "bg-yellow-400",
    icon: "📈"
  },
  {
    title: "DESIGN IMPACT",
    text: "I’m pragmatic to focus Design efforts reducing costs and increasing revenue. Success aligns outcomes to metrics.",
    color: "bg-indigo-400",
    icon: "🎯"
  }
];

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  color?: string;
  image?: string; // New Image Prop
  height: string;
}

interface SelectedWorkProps {
  projects: Project[];
  onSelect: (id: number) => void;
}

export const SelectedWork = ({ projects, onSelect }: SelectedWorkProps) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // --- Live Time Logic ---
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'Asia/Kolkata' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen z-20 px-6 md:px-12 py-24 bg-[#f5f3ee]">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* --- LEFT COLUMN: Sticky Identity & Principles --- */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar flex flex-col gap-8 pr-4">
            
            {/* Header */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                Ajay
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-normal">
                Frontend Architect & Creative Technologist. I live in VS Code and think in Motion.
              </p>
            </div>

            {/* Location & Time */}
            <div className="flex flex-col gap-1 border-l-2 border-gray-200 pl-4">
               <div className="flex items-center gap-2">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">Chennai, India</span>
               </div>
               <p className="text-sm text-gray-400 font-mono font-medium">
                 {time || "--:-- --"} (IST)
               </p>
            </div>

            {/* Principles Section */}
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">My Principles</p>
              
              {PRINCIPLES.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{item.title}</span>
                    <div className={`${item.color} text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm transform rotate-3 group-hover:rotate-0 transition-transform`}>
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>

        {/* --- RIGHT COLUMN: Project Grid --- */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                layoutId={`project-${project.id}`}
                onClick={() => onSelect(project.id)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 0.98 }}
                className={`relative group overflow-hidden rounded-3xl ${project.height} ${i % 3 === 0 ? "md:col-span-2" : ""} cursor-pointer bg-white shadow-sm`}
                style={{ backgroundColor: project.color || '#111' }}
              >
                {/* Image Handling: Uses next/image */}
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">{project.category}</p>
                  <motion.h3 layoutId={`title-${project.id}`} className="text-white text-3xl font-bold">{project.title}</motion.h3>
                  
                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    ↗
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Footer Link */}
            <div className="md:col-span-2 h-48 bg-[#171717] rounded-3xl p-8 flex items-center justify-between text-white relative overflow-hidden group cursor-pointer">
               <div className="relative z-10">
                  <h3 className="text-2xl font-bold">See all projects</h3>
                  <p className="opacity-60 text-sm mt-1">Explore the archive</p>
               </div>
               <motion.div 
                 className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
                 whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.2)" }}
               >
                 →
               </motion.div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};