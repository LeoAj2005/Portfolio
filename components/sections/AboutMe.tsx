"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import React from "react";

// --- BYPASS TS CHECK FOR ION-ICON ---
const IonIcon = "ion-icon" as any;

// --- TYPES ---
interface MediaItem {
  id: string;
  title: string;
  poster: string;
  type: string;
}

// --- CONSTANTS ---
const OMDB_API_KEY = "8d2f5143"; //

const WATCH_LIST = [
  "Drive",
  "Dark",
  "Avengers: Endgame",
  "Iron Man"
];

// Fallback data in case API limit is reached
const FALLBACK_MEDIA: MediaItem[] = [
  { id: "tt0780504", title: "Drive", poster: "https://m.media-amazon.com/images/M/MV5BZjY5ZjQyMjMtMmEwOC00Nzc2LTllYTItNmU2NzE5YzNkZjIyXkEyXkFqcGc@._V1_SX300.jpg", type: "movie" },
  { id: "tt5753856", title: "Dark", poster: "https://m.media-amazon.com/images/M/MV5BMTRmYzNmOTctZjMwOS00ODZlLWJiZGQtNDg5NDY5NjRiOGExXkEyXkFqcGc@._V1_SX300.jpg", type: "series" },
  { id: "tt4154796", title: "Avengers: Endgame", poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg", type: "movie" },
  { id: "tt0371746", title: "Iron Man", poster: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg", type: "movie" },
];

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AboutMe = () => {
  const [media, setMedia] = useState<MediaItem[]>(FALLBACK_MEDIA);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // --- FETCH LOGIC (OMDb) ---
  const getMovies = useCallback(async () => {
    const results: MediaItem[] = [];

    await Promise.all(WATCH_LIST.map(async (title) => {
      try {
        // Using 't=' parameter for title search
        const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();

        if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
          results.push({
            id: data.imdbID,
            title: data.Title,
            poster: data.Poster, // OMDb returns full URL
            type: data.Type
          });
        }
      } catch {
        // Silent catch
      }
    }));
    
    return results;
  }, []);

  useEffect(() => {
    let isMounted = true;
    getMovies().then((results) => {
      if (isMounted && results.length > 0) {
        setMedia(results);
      }
    });
    return () => { isMounted = false; };
  }, [getMovies]);

  return (
    <section className="relative w-full min-h-screen z-40 px-6 py-24 bg-[#e5e5e5] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-4">
            Beyond the Code.
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl">
            A glimpse into my world. What I watch, what I listen to, and who I am.
          </p>
        </div>

        {/* BENTO GRID */}
        <motion.div 
          variants={containerVar}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-200"
        >
          
          {/* 1. PHOTO CARD */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-2 relative rounded-4xl overflow-hidden group min-h-75">
            <Image 
              src="/profile/Group 29.png" 
              alt="Ajay Portrait"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl font-bold">Ajay</h3>
              <p className="text-white/80">Chennai, India 🇮🇳</p>
            </div>
          </motion.div>

          {/* 2. BIO CARD */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-white rounded-4xl p-8 flex flex-col justify-between shadow-xs min-h-50">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hi, I'm Ajay 👋</h3>
              <p className="text-gray-600">
                Shoot me a message, and let's grab a virtual coffee. I'm always down to discuss AI, Design, or FC Barcelona's latest match.
              </p>
            </div>
            <div className="mt-6 relative">
              <input type="text" placeholder="Send a message..." className="w-full bg-gray-100 rounded-full py-4 px-6 pr-12 text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500" />
              <button className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform">➜</button>
            </div>
          </motion.div>

          {/* 3. SPOTIFY CARD */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-black rounded-4xl overflow-hidden relative shadow-lg min-h-50 flex items-center justify-center">
             <iframe 
               data-testid="embed-iframe" 
               src="https://open.spotify.com/embed/playlist/7KRMKI1bsYOiR3IzbRDkg1?utm_source=generator&theme=0" 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               allowFullScreen 
               allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
               loading="lazy"
               className="w-full h-full rounded-xl"
             />
          </motion.div>

          {/* 4. MOVIES CARD (OMDb Data) */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-black rounded-4xl overflow-hidden relative group min-h-50">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Favorites</span>
              </div>
            </div>
            
            <div className="flex h-full items-center gap-4 px-6 overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
               <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
               
               <div className="flex gap-4 w-full justify-around">
                 {media.slice(0, 4).map((item, i) => (
                   <div key={`${item.id}-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden border border-white/20 opacity-80 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:z-20">
                     <Image 
                        src={item.poster} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        unoptimized 
                     />
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* 5. SOCIAL DOCK */}
          <motion.div 
            variants={itemVar} 
            className="md:col-span-2 md:row-span-1 bg-white rounded-4xl p-6 flex flex-col justify-center items-center shadow-xs min-h-30"
            onMouseLeave={() => setHoveredSocial(null)}
          >
             <div className="flex items-end gap-6 h-20">
               {[
                 { id: 'github', icon: 'logo-github', color: 'text-black' },
                 { id: 'linkedin', icon: 'logo-linkedin', color: 'text-[#0077b5]' },
                 { id: 'twitter', icon: 'logo-twitter', color: 'text-[#1da1f2]' },
                 { id: 'instagram', icon: 'logo-instagram', color: 'text-pink-600' }
               ].map((social) => {
                 const isHovered = hoveredSocial === social.id;
                 const isAnyHovered = hoveredSocial !== null;
                 
                 return (
                   <motion.div 
                    key={social.id}
                    onMouseEnter={() => setHoveredSocial(social.id)}
                    animate={{ 
                      scale: isHovered ? 1.4 : (isAnyHovered ? 0.85 : 1),
                      y: isHovered ? -10 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group cursor-pointer flex flex-col items-center"
                   >
                     <div className={`text-5xl ${social.color} transition-colors duration-300`}>
                        <IonIcon name={social.icon}></IonIcon>
                     </div>
                     <span className={`
                       absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider text-gray-400 transition-opacity duration-200
                       ${isHovered ? 'opacity-100' : 'opacity-0'}
                     `}>
                       {social.id}
                     </span>
                   </motion.div>
                 );
               })}
             </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};