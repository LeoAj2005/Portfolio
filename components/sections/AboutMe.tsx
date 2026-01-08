"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

// --- TYPES ---
interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  type: 'movie' | 'tv';
}

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: string;
}

// --- CONSTANTS ---
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

const WATCH_HISTORY = [
  "Interstellar", "Inception", "The Dark Knight", "Breaking Bad", "Arcane", 
  "Mr. Robot", "Spider-Man: Across the Spider-Verse", "Avengers: Endgame",
  "Dark", "Stranger Things", "Fight Club", "Se7en", "The Matrix",
  "Iron Man", "Loki", "The Batman", "Oppenheimer", "Arrival", 
  "Ex Machina", "Parasite", "Joker", "Whiplash", "Daredevil", "WandaVision"
];

const FALLBACK_MEDIA: MediaItem[] = [
  { id: 157336, title: "Interstellar", poster_path: "/gEU2QniL6E8ahDaX0ODbj06WOHG.jpg", type: "movie" },
  { id: 27205, title: "Inception", poster_path: "/9gk7admal4zl241lKjwF6Xy75k6.jpg", type: "movie" },
  { id: 155, title: "The Dark Knight", poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", type: "movie" },
  { id: 1399, title: "Game of Thrones", poster_path: "/1XS1qyZpm2BZk3Cjrty9A0j66t.jpg", type: "tv" },
  { id: 66732, title: "Stranger Things", poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", type: "tv" },
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
  const [isShuffling, setIsShuffling] = useState(true);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  // --- FETCH LOGIC ---
  const getNewMovies = useCallback(async () => {
    const shuffled = [...WATCH_HISTORY].sort(() => 0.5 - Math.random()).slice(0, 10);
    const results: MediaItem[] = [];

    await Promise.all(shuffled.map(async (rawTitle) => {
      try {
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(rawTitle)}&page=1`
        );
        const data = await searchRes.json();

        if (data.results && data.results.length > 0) {
          const hit = data.results.find((r: TMDBResult) => r.media_type === 'movie' || r.media_type === 'tv') || data.results[0];
          
          if (hit.poster_path) {
            results.push({
              id: hit.id,
              title: hit.title || hit.name || "Unknown",
              poster_path: hit.poster_path,
              type: hit.media_type as 'movie' | 'tv'
            });
          }
        }
      } catch {
        // Silent catch
      }
    }));
    return results;
  }, []);

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    getNewMovies().then((results) => {
      if (isMounted && results.length > 0) {
        setMedia(results);
        setIsShuffling(false);
      }
    });
    return () => { isMounted = false; };
  }, [getNewMovies]);

  // Shuffle Button
  const handleShuffle = async () => {
    setIsShuffling(true);
    const results = await getNewMovies();
    if (results.length > 0) {
      setMedia(results);
    }
    setIsShuffling(false);
  };

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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hi, I&apos;m Ajay 👋</h3>
              <p className="text-gray-600">
                Shoot me a message, and let&apos;s grab a virtual coffee. I&apos;m always down to discuss AI, Design, or FC Barcelona&apos;s latest match.
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
               title="Spotify"
               src="https://open.spotify.com/embed/playlist/37i9dQZF1EIXt8rF3i0000?utm_source=generator&theme=0" 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               allowFullScreen 
               allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
               className="w-full h-full rounded-xl"
             />
          </motion.div>

          {/* 4. MOVIES CARD */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-black rounded-4xl overflow-hidden relative group min-h-50">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Watched</span>
              </div>
              <button 
                onClick={handleShuffle}
                disabled={isShuffling}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
              >
                <span className={`text-sm transform transition-transform ${isShuffling ? "animate-spin" : ""}`}>🔄</span>
              </button>
            </div>
            
            <div className="flex h-full items-center gap-4 px-6 overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
               <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
               
               <div className={`flex gap-4 ${media.length > 5 ? "animate-scroll hover:pause" : ""}`}>
                 {[...media, ...media].map((item, i) => (
                   <div key={`${item.id}-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden border border-white/20 opacity-70 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:z-20">
                     <Image 
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
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

          {/* 5. SOCIAL DOCK (Ionicons Carousel) */}
          <motion.div 
            variants={itemVar} 
            className="md:col-span-2 md:row-span-1 bg-white rounded-4xl p-6 flex flex-col justify-center items-center shadow-xs min-h-30"
            onMouseLeave={() => setHoveredSocial(null)}
          >
             <div className="flex items-end gap-6 h-20">
               {[
                 { id: 'github', icon: 'logo-github', color: 'text-black' },
                 { id: 'linkedin', icon: 'logo-linkedin', color: 'text-[#0077b5]' },
                 //{ id: 'twitter', icon: 'logo-twitter', color: 'text-[#1da1f2]' },
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
                     {/* IONICON */}
                     <div className={`text-5xl ${social.color} transition-colors duration-300`}>
                        <ion-icon name={social.icon}></ion-icon>
                     </div>
                     
                     {/* Tooltip */}
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