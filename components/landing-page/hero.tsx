"use client";

import React from "react";
import { motion } from "framer-motion";
import PollAnimation from "../poll-animation";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Wand2, Users, Share2, Gauge } from "lucide-react";
import Link from "next/link";
import Wrapper from "./wrapper";

function Hero() {
  return (
    <Wrapper>
      <div className="relative overflow-hidden min-h-screen w-screen flex items-center justify-center">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              y: [0, 50, 0],
              x: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/10 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              y: [0, -50, 0],
              x: [0, 50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: 5,
            }}
          />
        </motion.div>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-x-12 gap-y-16 items-center">
            {/* Left Content */}
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Badge
                className="mb-4 rounded-full px-4 py-1 text-sm"
                variant="secondary"
              >
                Private beta
              </Badge>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
              >
                Find{" "}
                <span className="text-primary font-permanentMarker text-7xl">
                  your people
                </span>
                . Fast.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
              >
                Qwirl is a bundle of defining polls that reveal who you are—your
                beliefs, quirks, tastes, and hot takes. Share yours, answer
                others, and instantly see your <strong>wavelength</strong> with
                anyone.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Button
                  size="lg"
                  className="rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link href="/auth" className="flex items-center gap-2">
                    Build your Qwirl <Wand2 className="size-4" />
                  </Link>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full w-full sm:w-auto"
                  asChild
                >
                  <Link href="#demo" className="flex items-center gap-2">
                    Try the demo <MousePointerClick className="size-4" />
                  </Link>
                </Button> */}
              </motion.div>

              <motion.div
                className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {[
                  {
                    icon: <Users className="size-4 text-primary" />,
                    label: "Discover your tribe",
                  },
                  {
                    icon: <Share2 className="size-4 text-accent" />,
                    label: "One link, instant vibes",
                  },
                  {
                    icon: (
                      <Gauge className="size-4 text-secondary-foreground" />
                    ),
                    label: "Wavelength score",
                  },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center whitespace-nowrap gap-2 bg-muted/40 border border-border/50 rounded-full px-3 py-2 justify-center sm:justify-start"
                  >
                    {f.icon}
                    <span className="hidden sm:inline">{f.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-md mx-auto relative"
            >
              <div className="p-2 z-10">
                <PollAnimation />
              </div>
              <div className="absolute blur-3xl -z-10 top-0 left-0 w-full h-full bg-gradient-to-t from-primary/30 to-primary/80 rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Hero;
