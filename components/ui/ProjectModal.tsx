"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

// --- PROJECT DATA ---
const PROJECT_DETAILS: Record<number, {
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  image: string;
  link: string;
}> = {
  1: {
    title: "Tweaiy",
    subtitle: "A Simple AI Prompt Organizer Search Bar",
    description: "A personal side project built for my studies to explore Chrome Extension development, Shadow DOM isolation, and AI prompt optimization. Tweaiy provides a native-feel UI that anchors directly to your favorite AI tools.",
    features: [
      "Native-Feel UI: Anchors directly beneath the search bars on ChatGPT and Gemini.",
      "Draggable Command Bar: Move the UI anywhere on the screen.",
      "Study Personas: Quick-toggle between Professional, Student, Casual, and Storytelling modes.",
      "Real-time Metrics: Live token counting to manage prompt efficiency."
    ],
    image: "https://cdn.arstechnica.net/wp-content/uploads/2025/08/github_logo_invertocat_dark_5-1152x648-1754938613.jpeg",
    link: "https://github.com/LeoAj2005/tweaiy"
  },
  2: {
    title: "OCR_Tool",
    subtitle: "Simple OCR using Tesseract 5.5.1",
    description: "This is a high-performance, command-line OCR tool that uses the Tesseract 5.5.1 engine to extract text from images and PDFs. It can read from a live camera feed or uploaded files and saves the extracted text to an Excel (.xlsx) file.",
    features: [
      "Two Input Modes: Capture live from camera or upload files (PNG, JPG, PDF).",
      "Accurate OCR: Powered by the latest Tesseract 5 engine.",
      "PDF Support: Automatically converts PDF pages into images for processing.",
      "Excel Export: Saves all extracted text into a single-cell .xlsx file.",
      "Safe File Saving: Includes overwrite protection flags."
    ],
    image: "https://cdn.arstechnica.net/wp-content/uploads/2025/08/github_logo_invertocat_dark_5-1152x648-1754938613.jpeg",
    link: "https://github.com/LeoAj2005/OCR_Tool"
  },
  3: {
    title: "Moviz",
    subtitle: "Your free alternative to Netflix",
    description: "Moviz is a streaming platform currently in development offering a wide variety of movies and shows. It aims to provide a free alternative to major streaming services with a focus on user experience and content accessibility.",
    features: [
      "Wide Variety: Access to a vast library of movies and shows.",
      "Open Source: Contribute to the project on GitHub.",
      "In Development: Stay tuned for regular updates and new features."
    ],
    image: "https://cdn.arstechnica.net/wp-content/uploads/2025/08/github_logo_invertocat_dark_5-1152x648-1754938613.jpeg",
    link: "https://github.com/LeoAj2005/Moviz"
  },
  4: {
    title: "Code_Tutor",
    subtitle: "Learn to code, one line at a time",
    description: "CodeTutor is a VS Code extension that uses AI to provide interactive, visual, and multi-level explanations of your code. Whether you're a beginner trying to understand a new concept or an expert reviewing unfamiliar code, CodeTutor is your personal AI-powered coding assistant.",
    features: [
      "AI-Powered Explanations: Select any block of code for a breakdown.",
      "Deep Insights: Understand 'Why' and 'How', not just 'What'.",
      "Visual Flowcharts: Automatically generates Mermaid.js flowcharts.",
      "Inline Teaching Mode: Toggle annotations directly in your editor.",
      "Multi-Provider Support: Works with Gemini, OpenAI, Anthropic, or Local Ollama."
    ],
    image: "https://cdn.arstechnica.net/wp-content/uploads/2025/08/github_logo_invertocat_dark_5-1152x648-1754938613.jpeg",
    link: "https://github.com/LeoAj2005/Code_Tutor"
  }
};

interface ProjectModalProps {
  project: { id: number; color?: string };
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const details = PROJECT_DETAILS[project.id];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!details) return null;

  return (
    // FIX: Changed z-[100] to z-50 (standard tailwind highest)
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div 
        layoutId={`project-${project.id}`}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
        style={{ pointerEvents: "auto" }}
      >
        {/* Close Button - FIX: Added aria-label and replaced icon with SVG */}
        <button 
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
        >
          {/* Simple X SVG (No external dependency needed) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-black"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* LEFT: Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
           <Image 
             src={details.image} 
             alt={details.title}
             fill
             className="object-cover"
             unoptimized // Ensure external images load without config changes
           />
           {/* Overlay Gradient */}
           <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent md:bg-linear-to-r" />
           
           <div className="absolute bottom-6 left-6 text-white">
             <h2 className="text-3xl font-bold mb-1">{details.title}</h2>
             <p className="text-white/80 text-sm">{details.subtitle}</p>
           </div>
        </div>

        {/* RIGHT: Content */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Project Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              {details.description}
            </p>
          </div>

          {details.features && (
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Key Features</h3>
              <ul className="space-y-3">
                {details.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                    <span className="mt-1 text-blue-500">●</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-gray-100">
             <a 
               href={details.link}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
             >
               View Project ↗
             </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
};