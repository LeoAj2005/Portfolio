"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface Project {
  id: number;
  title: string;
  color: string;
  height: string;
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // FIX: Changed bg-black/50 to bg-black/40 for 60% transparency
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`project-${project.id}`}
        // FIX: Increased max-width from max-w-4xl to max-w-6xl
        className="relative w-full max-w-6xl bg-[#f5f3ee] rounded-[2rem] overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
        // Using a slightly looser spring for a smoother morph
        transition={{ type: "spring", stiffness: 250, damping: 30 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
        >
          ✕
        </button>

        {/* Header Image - morphs from tile */}
        <div className="relative h-96">
          <motion.div
            layoutId={`image-${project.id}`}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundColor: project.color,
              backgroundImage: `url(https://placehold.co/1200x800/${project.color.replace('#', '')}/FFFFFF/png?text=${encodeURIComponent(project.title)})`
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
            <p className="text-white/80 font-medium mb-2 tracking-wider text-sm uppercase">Case Study</p>
            <motion.h2 
              layoutId={`title-${project.id}`}
              className="text-4xl md:text-6xl font-bold text-white max-w-2xl leading-tight"
            >
              {project.title}: rethinking the digital experience.
            </motion.h2>
          </div>
        </div>

        {/* Content Section - Fades in AFTER the morph is complete */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            // FIX: Added a delay so content appears after the modal expands
            transition: { delay: 0.3, duration: 0.4 } 
          }}
          className="p-8 md:p-12 bg-white"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Project Overview</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              The {project.title} was designed to visually present key performance indicators (KPIs) more effectively, aligning data with user needs. This project involved extensive user research, iterative prototyping, and a focus on creating an intuitive and engaging interface.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-12">
              We tackled challenges related to data visualization, accessibility, and performance to deliver a robust solution that scales. The final product has seen a 40% increase in user engagement since launch.
            </p>
            
            <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-105 transition-transform">
              VIEW CASE STUDY
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};