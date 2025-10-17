"use client";
import { motion } from "framer-motion";

import Wrapper from "./wrapper";
import { useRef, useEffect, useState } from "react";
import QwirlCard from "./qwirl-card";

const qwirls = [
  {
    username: "Luna",
    avatar: "https://avatar.iran.liara.run/public/boy?username=Luna",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    categories: ["Art", "Philosophy", "Music"],
  },
  {
    username: "Orion",
    avatar: "https://avatar.iran.liara.run/public/girl?username=Orion",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    categories: ["Sci-Fi", "Tech", "Future"],
  },
  {
    username: "Aria",
    avatar: "https://avatar.iran.liara.run/public/girl?username=Aria",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    categories: ["Travel", "Food", "Culture"],
  },
  {
    username: "Jax",
    avatar: "https://avatar.iran.liara.run/public/boy?username=Jax",
    image:
      "https://images.unsplash.com/photo-1756747646179-d5652667914e?q=80&w=1199&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    categories: ["Gaming", "Humor", "Pop Culture"],
  },
  {
    username: "Elara",
    avatar: "https://avatar.iran.liara.run/public/girl?username=Elara",
    image:
      "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80",
    categories: ["Books", "History", "Poetry"],
  },
  {
    username: "Kael",
    avatar: "https://avatar.iran.liara.run/public/boy?username=Kael",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    categories: ["Fitness", "Health", "Outdoors"],
  },
  {
    username: "Rhea",
    avatar: "https://avatar.iran.liara.run/public/girl?username=Rhea",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    categories: ["Fashion", "Design", "Photography"],
  },
];

export const QwirlShowcase = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const duplicatedQwirls = [...qwirls, ...qwirls, ...qwirls];

  useEffect(() => {
    if (scrollRef.current) {
      const half = scrollRef.current.scrollWidth / 2;
      setScrollWidth(half);
    }
  }, []);

  return (
    <Wrapper className="bg-white">
      <div className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Discover Unique <span className="text-primary">Qwirls</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-lg text-slate-600 mb-12"
          >
            Explore the vibrant personalities and perspectives that make our
            community thrive.
          </motion.p>
        </div>
        <div className="w-full relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex"
            style={{
              width: "max-content",
              animation: scrollWidth
                ? `scroll ${Math.max(40, scrollWidth / 40)}s linear infinite`
                : undefined,
            }}
          >
            {duplicatedQwirls.map((qwirl, index) => (
              <QwirlCard key={index} qwirl={qwirl} />
            ))}
          </div>
        </div>
        <style jsx>{`
          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(
                -${scrollWidth}px
              ); /* move by *original* width, not half */
            }
          }
        `}</style>
      </div>
    </Wrapper>
  );
};
