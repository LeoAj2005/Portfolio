"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
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
const OMDB_API_KEY = "8d2f5143";

const INITIAL_LIST = [
  "Iron Man",
  "Avengers: Endgame",
  "Drive",
  "Dark"
];

const WATCH_LIST_POOL = [
  "(500) Days of Summer", "12 Angry Men", "1917", "A Quiet Place", "Ant-Man", "Anyone But You", 
  "Arrival", "Avengers: Infinity War", "Baby Driver", "Ballerina", "Beetlejuice Beetlejuice", 
  "Big Hero 6", "Black Panther", "Black Panther: Wakanda Forever", "Blade Runner 2049", 
  "Borat Subsequent Moviefilm", "Bullet Train", "Captain America: Brave New World", 
  "Captain America: Civil War", "Captain Marvel", "Cars", "Cars 2", "Casino", "Catch Me If You Can", 
  "Caught Stealing", "Cloudy with a Chance of Meatballs", "Coco", "Collateral", "Crazy, Stupid, Love.", 
  "Deadpool & Wolverine", "Deadpool", "Deadpool 2", "Despicable Me 3", "Despicable Me 4", 
  "Django Unchained", "Doctor Strange", "Doctor Strange in the Multiverse of Madness", "Due Date", 
  "Dunkirk", "Eternal Sunshine of the Spotless Mind", "Everything Everywhere All at Once", "Ex Machina", 
  "Extraction", "Extraction 2", "F1", "Fight Club", "Final Destination Bloodlines", "Ford v Ferrari", 
  "Forrest Gump", "Frankenstein", "Free Guy", "Fury", "Geostorm", "Glass Onion: A Knives Out Mystery", 
  "Godzilla Minus One", "Godzilla x Kong: The New Empire", "Gone Baby Gone", "Gone Girl", "GoodFellas", 
  "Green Book", "Greenland", "Guardians of the Galaxy", "Guardians of the Galaxy Vol. 2", 
  "Guardians of the Galaxy Volume 3", "Hacksaw Ridge", "Heat", "Hit Man", "Home Alone", 
  "Hotel Transylvania", "Hotel Transylvania 3: Summer Vacation", "How to Train Your Dragon", "Ice Age", 
  "Inception", "Incredibles 2", "Inglourious Basterds", "Interstellar", "Iron Man 3", "John Wick", 
  "John Wick: Chapter 2", "John Wick: Chapter 3 - Parabellum", "John Wick: Chapter 4", "Joker", 
  "Jumanji: Welcome to the Jungle", "Jurassic World Rebirth", "Justice League", "Klaus", "Knives Out", 
  "Kong: Skull Island", "Kung Fu Panda", "La La Land", "Lars and the Real Girl", "Logan", "Madagascar", 
  "Man of Steel", "Materialists", "Megamind", "Memento", "Midsommar", "Mission: Impossible - Fallout", 
  "Mission: Impossible - Ghost Protocol", "Mission: Impossible - The Final Reckoning", "Monsters University", 
  "Monsters, Inc.", "Mulholland Drive", "Nightcrawler", "No Country for Old Men", "Nobody", "Nobody 2", 
  "Nocturnal Animals", "Novocaine", "Pacific Rim", "Parasite", "Pirates of the Caribbean: At World's End", 
  "Pirates of the Caribbean: Dead Man's Chest", "Pirates of the Caribbean: Dead Men Tell No Tales", 
  "Pirates of the Caribbean: The Curse of the Black Pearl", "Predestination", "Prisoners", "Prometheus", 
  "Ratatouille", "Ready Player One", "Real Steel", "Reservoir Dogs", "Se7en", "Shang-Chi and the Legend of the Ten Rings", 
  "Shazam!", "Sherlock Holmes", "Shutter Island", "Source Code", "Spider-Man 2", "Spider-Man: Across the Spider-Verse", 
  "Spider-Man: Homecoming", "Spider-Man: Into the Spider-Verse", "Spider-Man: No Way Home", "Suicide Squad", 
  "Superman", "Taxi Driver", "Terrifier", "The Adventures of Tintin", "The Amazing Spider-Man", "The Avengers", 
  "The Bad Guys 2", "The Batman", "The Boss Baby", "The Butterfly Effect", "The Conjuring", "The Conjuring: Last Rites", 
  "The Curious Case of Benjamin Button", "The Dark Knight", "The Dark Knight Rises", "The Departed", "The Dictator", 
  "The Fall Guy", "The Fantastic 4: First Steps", "The Game", "The Grinch", "The Imitation Game", "The Incredibles", 
  "The Life of Chuck", "The Martian", "The Mitchells vs. the Machines", "The Nice Guys", "The Prestige", 
  "The Secret Life of Pets", "The Shawshank Redemption", "The Shining", "The Silence of the Lambs", "The Suicide Squad", 
  "The Truman Show", "The Usual Suspects", "The Wolf of Wall Street", "Thor", "Thor: Ragnarok", "Thunderbolts*", 
  "Top Gun: Maverick", "Tourist Family", "Toy Story 2", "Toy Story 3", "Transformers", "Twisters", "Venom", 
  "Venom: The Last Dance", "WALL·E", "Wake Up Dead Man: A Knives Out Mystery", "Weapons", "Wonder Woman", 
  "World War Z", "Wreck-It Ralph", "X-Men: Apocalypse", "X-Men: Days of Future Past", "X-Men: First Class", 
  "Your Name.", "Zodiac", "Zootopia",
  "Alien: Earth", "All of Us Are Dead", "Arcane", "Attack on Titan", "Breaking Bad", "Daredevil: Born Again", 
  "Hawkeye", "Ironheart", "Loki", "Marvel Zombies", "Marvel's Daredevil", "Monster", "Moon Knight", 
  "Mr. Robot", "Squid Game", "WandaVision", "What If...?"
];

// Fallback data
const FALLBACK_MEDIA: MediaItem[] = [
  { id: "tt0371746", title: "Iron Man", poster: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg", type: "movie" },
  { id: "tt4154796", title: "Avengers: Endgame", poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg", type: "movie" },
  { id: "tt0780504", title: "Drive", poster: "https://m.media-amazon.com/images/M/MV5BZjY5ZjQyMjMtMmEwOC00Nzc2LTllYTItNmU2NzE5YzNkZjIyXkEyXkFqcGc@._V1_SX300.jpg", type: "movie" },
  { id: "tt5753856", title: "Dark", poster: "https://m.media-amazon.com/images/M/MV5BMTRmYzNmOTctZjMwOS00ODZlLWJiZGQtNDg5NDY5NjRiOGExXkEyXkFqcGc@._V1_SX300.jpg", type: "series" },
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
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- API FETCH HELPER ---
  const fetchMoviesByTitles = useCallback(async (titles: string[]) => {
    const results: MediaItem[] = [];
    await Promise.all(titles.map(async (title) => {
      try {
        const cleanTitle = title.replace(/\(\d{4}\)/, "").trim(); // Remove year like (2009)
        const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=${OMDB_API_KEY}`);
        const data = await res.json();
        if (data.Response === "True" && data.Poster && data.Poster !== "N/A") {
          results.push({
            id: data.imdbID,
            title: data.Title,
            poster: data.Poster,
            type: data.Type
          });
        }
      } catch { /* Silent catch */ }
    }));
    return results;
  }, []);

  // --- ENDLESS SCROLL LOGIC ---
  const loadMoreRandomMovies = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    // Pick 5 random movies
    const shuffled = [...WATCH_LIST_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
    const newMovies = await fetchMoviesByTitles(shuffled);

    setMedia(prev => {
      // Filter out duplicates
      const existingIds = new Set(prev.map(m => m.id));
      const uniqueNew = newMovies.filter(m => !existingIds.has(m.id));
      return [...prev, ...uniqueNew];
    });

    setLoadingMore(false);
  }, [loadingMore, fetchMoviesByTitles]);

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const fixedMovies = await fetchMoviesByTitles(INITIAL_LIST);
      // Load initial batch of randoms
      const shuffled = [...WATCH_LIST_POOL].sort(() => 0.5 - Math.random()).slice(0, 8);
      const randomMovies = await fetchMoviesByTitles(shuffled);
      
      if (isMounted) {
        const combined = [...fixedMovies, ...randomMovies];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        if (unique.length > 0) setMedia(unique);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [fetchMoviesByTitles]);

  // --- SCROLL HANDLER ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

        // CHECK ENDLESS SCROLL TRIGGER
        // If we are near the end of the list (within 600px), load more!
        if (current.scrollWidth - (current.scrollLeft + current.clientWidth) < 600) {
           loadMoreRandomMovies();
        }
      }
    }
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
              alt="Ajay D Portrait"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-3xl font-bold">Ajay D</h3>
              <p className="text-white/80">Chennai, India 🇮🇳</p>
            </div>
          </motion.div>

          {/* 2. BIO CARD */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-white rounded-4xl p-8 flex flex-col justify-between shadow-xs min-h-50">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hi, I'm Ajay D 👋</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Motivated AI/ML student skilled in Java, Python, full-stack, and generative AI.
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

          {/* 4. MOVIES CARD (True Endless Scroll + Arrows) */}
          <motion.div variants={itemVar} className="md:col-span-2 md:row-span-1 bg-black rounded-4xl overflow-hidden relative group min-h-50">
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Favorites</span>
              </div>
              {loadingMore && (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
            </div>

            {/* ARROWS */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10 opacity-0 group-hover:opacity-100"
              aria-label="Scroll Left"
            >
              <IonIcon name="chevron-back" suppressHydrationWarning></IonIcon>
            </button>

            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10 opacity-0 group-hover:opacity-100"
              aria-label="Scroll Right"
            >
              <IonIcon name="chevron-forward" suppressHydrationWarning></IonIcon>
            </button>
            
            <div className="flex h-full items-center gap-4 px-6 overflow-hidden relative">
               {/* Gradients */}
               <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/50 to-transparent z-20 pointer-events-none" />
               <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/50 to-transparent z-20 pointer-events-none" />
               
               {/* SCROLL CONTAINER: "no-scrollbar" class added */}
               <div 
                 ref={scrollRef}
                 className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth items-center h-full w-full z-10 px-12"
               >
                 {media.map((item, i) => (
                   <div key={`${item.id}-${i}`} className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden border border-white/20 opacity-80 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 hover:z-20 cursor-pointer">
                     <Image 
                        src={item.poster} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        unoptimized 
                     />
                     <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center p-2 transition-opacity">
                        <p className="text-white text-[10px] font-bold text-center">{item.title}</p>
                     </div>
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
                        <IonIcon name={social.icon} suppressHydrationWarning></IonIcon>
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