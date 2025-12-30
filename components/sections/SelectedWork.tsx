"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Pre-defined rotations to avoid "Math.random() in render" error
const TAGS = [
  { label: "product designer", color: "bg-blue-500 text-white", rotate: 2 },
  { label: "storyteller", color: "bg-sky-400 text-white", rotate: -1 },
  { label: "ai enthusiast", color: "bg-orange-400 text-white", rotate: 1.5 },
  { label: "creative dev", color: "bg-yellow-400 text-black", rotate: -2 },
  { label: "healthcare optimist", color: "bg-rose-300 text-black", rotate: 1 },
];

const PROJECTS = [
  { id: 1, title: "AR Fitness", color: "#1e1e24", height: "h-64 md:h-96" },
  { id: 2, title: "Fintech Dashboard", color: "#f8fafc", height: "h-64" },
  { id: 3, title: "SPOK Identity", color: "#0f172a", height: "h-64 md:h-80" },
  { id: 4, title: "Living Algorithms", color: "#10b981", height: "h-64" },
];

export const SelectedWork = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen z-20 px-6 md:px-12 py-24 bg-[#f5f3ee]">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        
        {/* --- LEFT COLUMN: Sticky Identity --- */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 flex flex-col gap-8">
            
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                Ajay
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-normal">
                Frontend Architect & Creative Technologist with 5+ years of experience building immersive web experiences. 
                Currently living in <span className="text-black font-semibold">India</span> and building the future of interaction.
              </p>
            </div>

            <div className="flex gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 bg-gray-300 rounded-md animate-pulse" />
              ))}
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-3 font-medium">I am a</p>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.05, rotate: tag.rotate }} // Fixed: Deterministic rotation
                    className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm cursor-default ${tag.color}`}
                  >
                    {tag.label}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-900">Currently</span>
              </div>
              <p className="text-sm text-gray-500">Working on Living Algorithms</p>
              <p className="text-sm text-gray-400 font-mono mt-1">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} IST
              </p>
            </div>

          </div>
        </div>

        {/* --- RIGHT COLUMN: Project Grid --- */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {PROJECTS.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 0.98 }}
                className={`relative group overflow-hidden rounded-3xl ${project.height} ${i % 3 === 0 ? "md:col-span-2" : ""}`}
              >
                {/* Dynamic background images must remain inline, but we use strict formatting */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    backgroundColor: project.color,
                    backgroundImage: `url(https://placehold.co/800x600/${project.color.replace('#','')}/FFFFFF/png?text=${encodeURIComponent(project.title)})`
                  }}
                />
                
                {/* Fixed: Updated 'bg-gradient-to-t' to 'bg-linear-to-t' for Tailwind v4 */}
                <div className="absolute bottom-0 left-0 p-6 w-full bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                </div>
              </motion.div>
            ))}

            <div className="md:col-span-2 h-64 bg-indigo-500 rounded-3xl p-8 flex items-center justify-between text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-2xl font-bold">See all projects</h3>
                  <p className="opacity-80">Explore the archive</p>
               </div>
               <motion.div 
                 className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600"
                 whileHover={{ x: 10 }}
               >
                 →
               </motion.div>
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};