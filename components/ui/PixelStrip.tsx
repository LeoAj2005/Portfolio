"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

const COLORS = [
  "#ef4444", "#f97316", "#facc15", "#4ade80", 
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", 
  "#06b6d4", "#14b8a6", "#f5f3ee",
];

const ROWS = 4;
const COLS = 48; 
const TOTAL_PIXELS = ROWS * COLS;

export const PixelStrip = ({ isLoading }: { isLoading: boolean }) => {
  const [mounted, setMounted] = useState(false);
  const [pixelColors, setPixelColors] = useState<string[]>([]);

  const generateColors = useCallback(() => {
    return Array.from({ length: TOTAL_PIXELS }).map(
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setPixelColors(generateColors());
    }, 0);
    return () => clearTimeout(timer);
  }, [generateColors]);

  useEffect(() => {
    if (!mounted || isLoading) return;
    const intervalId = setInterval(() => {
      setPixelColors(generateColors());
    }, 2000);
    return () => clearInterval(intervalId);
  }, [mounted, isLoading, generateColors]);

  if (!mounted) return <div className="w-full h-16 md:h-24 bg-[#f5f3ee]" />;

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        // Fixed: w-screen is the canonical class for w-[100vw]
        className="grid min-w-full w-screen"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, clamp(16px, 2.5vw, 28px))`, 
        }}
      >
        {pixelColors.map((color, i) => (
          <motion.div
            key={i}
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: isLoading ? 1 : 0.85, 
              backgroundColor: isLoading ? [color, "#f5f3ee", color] : color,
            }}
            transition={{
              scale: { duration: 0.5, delay: i * 0.002 },
              opacity: { duration: 0.5 },
              backgroundColor: { duration: 1.5, ease: "easeInOut" },
              layout: { duration: 1.5, ease: "easeInOut" }
            }}
            className="w-full h-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};