"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
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
  image?: string; 
  height: string;
}

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
}

interface SelectedWorkProps {
  projects: Project[];
  onSelect: (id: number) => void;
}

const GITHUB_FALLBACK_IMG = "https://cdn.arstechnica.net/wp-content/uploads/2025/08/github_logo_invertocat_dark_5-1152x648-1754938613.jpeg";
const CATEGORIES = ["All", "AI", "Python", "Web", "Flutter", "Other"];

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

  // --- GitHub Archive Modal Logic ---
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (isArchiveOpen && repos.length === 0) {
      setLoadingRepos(true);
      fetch('https://api.github.com/users/LeoAj2005/repos?sort=updated&per_page=50')
        .then(res => res.json())
        .then(data => {
          setRepos(data);
          setLoadingRepos(false);
        })
        .catch(err => {
          console.error("Failed to fetch repos", err);
          setLoadingRepos(false);
        });
    }

    // Lock body scroll when modal is open
    if (isArchiveOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isArchiveOpen, repos.length]);

  // Helper to categorize repos
  const getRepoCategory = (repo: GithubRepo) => {
    const lang = repo.language?.toLowerCase() || '';
    const name = repo.name.toLowerCase();
    
    if (name.includes('ai') || name.includes('gpt') || lang === 'jupyter notebook') return 'AI';
    if (lang === 'python') return 'Python';
    if (['html', 'css', 'javascript', 'typescript', 'vue'].includes(lang)) return 'Web';
    if (lang === 'dart') return 'Flutter';
    return 'Other';
  };

  const filteredRepos = repos.filter(repo => {
    if (activeCategory === "All") return true;
    return getRepoCategory(repo) === activeCategory;
  });

  return (
    <>
      <section ref={containerRef} className="relative w-full min-h-screen z-20 px-6 md:px-12 py-24 bg-[#f5f3ee]">
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* --- LEFT COLUMN: Sticky Identity & Principles --- */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar flex flex-col gap-8 pr-4">
              
              {/* Header */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
                  Ajay Doss
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-normal">
                  Motivated AI/ML student skilled in Java, Python, full-stack, generative AI, and app development. Passionate about leveraging technology to create impactful solutions.
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
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">{project.category}</p>
                    <motion.h3 layoutId={`title-${project.id}`} className="text-white text-3xl font-bold">{project.title}</motion.h3>
                    
                    <div className="absolute bottom-6 right-6 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      ↗
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* SEE ALL PROJECTS BUTTON */}
              <div 
                onClick={() => setIsArchiveOpen(true)}
                className="md:col-span-2 h-48 bg-[#171717] rounded-3xl p-8 flex items-center justify-between text-white relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
              >
                 <div className="relative z-10">
                    <h3 className="text-2xl font-bold group-hover:text-blue-400 transition-colors">See all projects</h3>
                    <p className="opacity-60 text-sm mt-1">Explore my GitHub archive</p>
                 </div>
                 <motion.div 
                   className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
                   whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.2)" }}
                 >
                   →
                 </motion.div>
                 
                 {/* Decorative background element */}
                 <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
              </div>

            </motion.div>
          </div>

        </div>
      </section>

      {/* ================= ARCHIVE MODAL (GitHub Repos) ================= */}
      <AnimatePresence>
        {isArchiveOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-xl p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-full max-w-7xl h-full max-h-[90vh] bg-[#111111] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/10"
            >
              
              {/* Modal Header */}
              <div className="p-8 pb-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative shrink-0">
                
                {/* Title */}
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub Archive
                  </h2>
                  <p className="text-gray-400">All my open-source experiments and repositories.</p>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setIsArchiveOpen(false)}
                  className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Glassmorphism Filters */}
              <div className="px-8 py-4 bg-white/5 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
                <div className="flex gap-3 min-w-max">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md ${
                        activeCategory === cat 
                          ? "bg-white text-black shadow-lg" 
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#0a0a0a]">
                {loadingRepos ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredRepos.map((repo, i) => (
                      <motion.a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group relative h-72 rounded-3xl overflow-hidden block border border-white/10 bg-[#111]"
                      >
                        {/* Background Fallback Image */}
                        <Image
                          src={GITHUB_FALLBACK_IMG}
                          alt="GitHub Repo"
                          fill
                          className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                          unoptimized
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="mb-auto flex justify-between items-start">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                              {getRepoCategory(repo)}
                            </span>
                            <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              ↗
                            </div>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                            {repo.name}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                            {repo.description || "No description provided."}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-mono text-gray-500 uppercase">{repo.language || 'Unknown'}</span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                    
                    {filteredRepos.length === 0 && (
                      <div className="col-span-full h-48 flex items-center justify-center text-gray-500">
                        No repositories found for this category.
                      </div>
                    )}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};