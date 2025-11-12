"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSnapScroll } from "@/hooks/useSnapScroll";

const ScrollIndicator = () => {
  const { currentSection, scrollToSection, totalSections } = useSnapScroll();

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col space-y-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => scrollToSection(index)}
          className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
            currentSection === index
              ? "bg-primary border-primary scale-125"
              : "bg-transparent border-white/30 hover:border-white/60"
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ScrollIndicator;
