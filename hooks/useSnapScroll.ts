"use client";
import { useEffect, useRef, useState } from "react";

export const useSnapScroll = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sections = container.querySelectorAll(".snap-section");
        const containerRect = container.getBoundingClientRect();

        sections.forEach((section, index) => {
          const sectionRect = section.getBoundingClientRect();
          const sectionCenter = sectionRect.top + sectionRect.height / 2;
          const containerCenter = containerRect.height / 2;

          if (
            Math.abs(sectionCenter - containerCenter) <
            containerRect.height / 3
          ) {
            setCurrentSection(index);
          }
        });
      }, 100);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      // Add momentum to scroll for better feel
      const delta = e.deltaY;
      const threshold = 50;

      if (Math.abs(delta) > threshold) {
        isScrollingRef.current = true;

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 800);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollToSection = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll(".snap-section");
    const targetSection = sections[index] as HTMLElement;

    if (targetSection) {
      isScrollingRef.current = true;
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  };

  return {
    containerRef,
    currentSection,
    scrollToSection,
    totalSections: 11, // Update this based on your actual number of sections
  };
};
