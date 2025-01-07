"use client";

import React from "react";
import { motion } from "framer-motion";
import PollAnimation from "../poll-animation";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Hero = () => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="bg-secondary text-primary-foreground w-full p-10 rounded-[60px] grid grid-cols-1 lg:grid-cols-2"
      >
        <motion.div
          variants={itemVariants}
          className="col-span-1 flex flex-col items-center justify-center text-center lg:text-left text-4xl lg:text-8xl uppercase tracking-wider font-extralight"
        >
          Discover yourself through questions.
        </motion.div>
        <motion.div variants={itemVariants} className="col-span-1 mt-8 lg:mt-0">
          <PollAnimation />
        </motion.div>
      </motion.div>
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4"
      >
        <motion.div
          variants={itemVariants}
          className="col-span-1 bg-secondary-foreground text-primary rounded-[40px] p-10 text-4xl font-semibold"
        >
          Compare Perspectives
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="col-span-1 bg-secondary-foreground text-primary rounded-[40px] p-10 text-4xl font-semibold"
        >
          Break ice with questions, not small talk.
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="col-span-1 bg-secondary-foreground text-primary rounded-[40px] p-10 text-4xl font-semibold"
        >
          Find people that are just as weird as you.
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
