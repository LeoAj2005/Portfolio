"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from "framer-motion";

// --- DATA ---
// Verified Devicon Slugs & Types
const ROW_1 = [
  { name: "Python", slug: "python", type: "original" },
  { name: "TypeScript", slug: "typescript", type: "original" },
  { name: "React", slug: "react", type: "original" },
  { name: "Next.js", slug: "nextjs", type: "original" },
  { name: "Tailwind", slug: "tailwindcss", type: "original" },
  { name: "Flutter", slug: "flutter", type: "original" },
  { name: "Dart", slug: "dart", type: "original" },
  { name: "Node.js", slug: "nodejs", type: "original-wordmark" },
  { name: "Figma", slug: "figma", type: "original" },
  { name: "HTML5", slug: "html5", type: "original" },
];

const ROW_2 = [
  { name: "TensorFlow", slug: "tensorflow", type: "original" },
  { name: "PyTorch", slug: "pytorch", type: "original" },
  { name: "Docker", slug: "docker", type: "original" },
  { name: "Git", slug: "git", type: "original" },
  { name: "Firebase", slug: "firebase", type: "plain" },
  { name: "VS Code", slug: "vscode", type: "original" },
  { name: "C", slug: "c", type: "original" },
  { name: "Java", slug: "java", type: "original" },
  { name: "Supabase", slug: "supabase", type: "original" },
  { name: "PostgreSQL", slug: "postgresql", type: "original" },
];

// --- COMPONENTS ---

const ToolIcon = ({ name, slug, type }: { name: string; slug: string; type: string }) => {
  return (
    <div className="group relative flex flex-col items-center justify-center mx-8 cursor-pointer">
      {/* Icon Wrapper */}
      <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:border-gray-200">
        <Image
          // Added version param to force cache refresh
          src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${type}.svg?v=1.0`}
          alt={name}
          width={40}
          height={40}
          // Starts grayscale/transparent, blooms to full color on hover
          className="opacity-50 grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
          unoptimized
        />
      </div>
      
      {/* Tooltip - Absolute positioned below */}
      <span className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
        {name}
      </span>
    </div>
  );
};

const MarqueeRow = ({ items, baseVelocity }: { items: typeof ROW_1, baseVelocity: number }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate items for seamless infinite loop
  const marqueeItems = [...items, ...items, ...items, ...items];
  
  const baseX = useMotionValue(0);

  // Physics-based animation loop
  useAnimationFrame((t, delta) => {
    // 1. Strict Pause Logic: If hovered, do not increment X
    if (isPaused) return;

    // 2. Slow Down Logic: 
    // Divide delta (ms) by 1000 to get seconds. 
    // baseVelocity becomes "pixels per second".
    const moveBy = baseVelocity * (delta / 10000); 

    if (baseVelocity > 0) {
      baseX.set(baseX.get() + moveBy);
    } else {
      baseX.set(baseX.get() + moveBy);
    }
  });

  // Wrap position (-50% to 0%)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  return (
    <div 
      // 3. Spacing Fix: Increased py-12 (48px) to accommodate tooltips without clipping
      className="relative flex overflow-hidden py-12" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left Fade Gradient */}
      <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#f5f3ee] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex"
        style={{ x }}
      >
        {marqueeItems.map((item, idx) => (
          <ToolIcon key={`${item.slug}-${idx}`} {...item} />
        ))}
      </motion.div>

      {/* Right Fade Gradient */}
      <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#f5f3ee] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export const Toolbox = () => {
  return (
    <section className="relative w-full py-32 bg-[#f5f3ee] overflow-hidden flex flex-col justify-center z-30">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
          Tech Stack
        </h2>
        <p className="text-gray-500 text-lg">
          The simple, robust tools I use to build complex things.
        </p>
      </div>

      {/* Marquees */}
      <div className="flex flex-col gap-8">
        {/* Row 1: Moves Left | Speed: 15 pixels/sec (Very Slow) */}
        <MarqueeRow items={ROW_1} baseVelocity={-15} />
        
        {/* Row 2: Moves Right | Speed: 15 pixels/sec (Very Slow) */}
        <MarqueeRow items={ROW_2} baseVelocity={15} />
      </div>

    </section>
  );
};