"use client";
import React from "react";
import { motion } from "framer-motion";

const PrimaryQwirlDetails = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl space-y-8"
    >
      <Header />
      <EngagementBreakdown />
      <QuestionInsights />
      <HistoricalTrends />
      <Suggestions />
      <Footer />
    </motion.div>
  );
};

export default PrimaryQwirlDetails;
