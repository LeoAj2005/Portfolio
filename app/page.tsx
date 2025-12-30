"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { PixelStrip } from "../components/ui/PixelStrip";
import { SelectedWork } from "../components/sections/SelectedWork";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref for the hero section to track scroll
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // PARALLAX LOGIC:
  // 1. y: Moves the hero text down slightly slower than scroll (0.5 speed)
  // 2. opacity: Fades out the hero as you scroll past
  // 3. scale: Shrinks the hero slightly to create "depth" (it looks further away)
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full font-google-sans bg-[#f5f3ee]">
      
      {/* ================= HERO SECTION (STICKY PARALLAX) ================= */}
      {/* h-[110vh] ensures we have enough scroll room for the effect to play out */}
      <div ref={heroRef} className="relative h-screen sticky top-0 z-0 overflow-hidden">
        
        {/* Animated Wrapper for Parallax Effect */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="w-full h-full flex flex-col justify-between pt-8 pb-0 origin-top"
        >
          {/* Navbar */}
          <motion.nav 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
            className="flex justify-between items-center w-full z-50 h-16 px-6 md:px-12"
          >
            <div className="w-8"></div> 
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-black transition-colors">My Work</a>
              <a href="#" className="hover:text-black transition-colors">Skills</a>
              <a href="#" className="hover:text-black transition-colors">Articles</a>
            </div>
            <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-lg">
              Resume
            </button>
          </motion.nav>

          {/* Hero Content */}
          <section className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-5xl mx-auto px-6">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  key="intro-loader"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-50"
                >
                  <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                      <motion.div
                          key={i}
                          animate={{
                          backgroundColor: [
                              "#ef4444", "#3b82f6", "#eab308", "#f5f3ee"
                          ].sort(() => Math.random() - 0.5),
                          }}
                          transition={{
                          duration: 0.2,
                          repeat: Infinity,
                          repeatType: "mirror",
                          }}
                          className="w-10 h-10 md:w-16 md:h-16"
                      />
                      ))}
                  </div>
                  <motion.p 
                      animate={{ opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mt-8 text-xs md:text-sm text-gray-400 tracking-widest font-medium"
                  >
                      INITIALIZING...
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {!isLoading && (
              <div className="w-full flex flex-col items-center">
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight tracking-tight text-gray-900 mx-auto max-w-4xl text-center mb-8"
                >
                  I am Ajay, a creator passionate about blending design and technology to shape the future.
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="flex justify-center"
                >
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-full backdrop-blur-sm shadow-sm hover:scale-105 transition-transform cursor-default">
                    <span className="text-lg">⏳</span>
                    <span className="text-sm font-medium text-gray-600">
                      &quot;No amount of money ever brought a second of time.&quot;
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </section>

          {/* Footer Pixel Strip */}
          <footer className="w-full relative mt-auto overflow-hidden">
            <PixelStrip isLoading={isLoading} />
          </footer>
        </motion.div>
      </div>

      {/* ================= PAGE 2: SELECTED WORK ================= */}
      {/* Z-INDEX 10 ensures this slides ON TOP of the sticky hero.
         bg-[#f5f3ee] ensures it's solid and covers the text behind it.
         min-h-screen ensures it takes up full scroll space.
      */}
      {!isLoading && (
        <div className="relative z-10 bg-[#f5f3ee] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-3xl">
          <SelectedWork />
        </div>
      )}

    </main>
  );
}