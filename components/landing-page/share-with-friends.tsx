"use client";

import { motion } from "framer-motion";
import { Share2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Wrapper from "./wrapper";

import { Twitter, Instagram, Linkedin, Globe } from "lucide-react";
import { UserAvatar } from "../user-avatar";

const socialPlatforms = [
  {
    icon: Twitter,
    color: "#1DA1F2",
    position: "top-10 left-16",
    delay: 0,
  },
  {
    icon: Instagram,
    color: "#E4405F",
    position: "top-24 right-10",
    delay: 0.5,
  },
  {
    icon: Linkedin,
    color: "#0A66C2",
    position: "bottom-24 left-10",
    delay: 0.8,
  },
  {
    icon: Globe,
    color: "#333333",
    position: "bottom-10 right-16",
    delay: 0.2,
  },
];

export const ShareWithFriends = () => {
  return (
    <Wrapper className="bg-white grid md:grid-cols-2 gap-12 items-center">
      <div className="relative rounded-2xl flex items-center justify-center h-[500px]">
        {socialPlatforms.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={index}
              className={`absolute p-4 bg-white rounded-full shadow-xl border ${platform.position}`}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + platform.delay,
                ease: "easeOut",
              }}
              animate={{
                y: [0, -10, 0],
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="w-8 h-8" style={{ color: platform.color }} />
            </motion.div>
          );
        })}

        <motion.div
          className="relative w-72 bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <UserAvatar
            name="Alex Ray"
            image="https://avatar.iran.liara.run/public/boy"
            className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-md"
          />
          <h3 className="font-bold text-lg text-slate-800">@alexray</h3>
          <p className="text-sm text-slate-500 mb-6">
            Digital Creator & Thinker
          </p>
          <Button
            icon={LinkIcon}
            iconPlacement="left"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            My Qwirl
          </Button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-muted text-muted-foreground p-10 h-full flex flex-col justify-center"
      >
        <div className="inline-block p-2 bg-card rounded-lg mb-4 w-fit">
          <Share2 className="w-6 h-6" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
          Share Your Vibe,
          <br />
          Instantly.
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Your Qwirl is your digital handshake. Easily share it across your
          social media, in your portfolio, or anywhere you connect online. Let
          people know who you are, right from your bio.
        </p>
        <Button
          icon={LinkIcon}
          iconPlacement="right"
          size="lg"
          className="w-fit"
        >
          Get Your Sharable Link
        </Button>
      </motion.div>
    </Wrapper>
  );
};
