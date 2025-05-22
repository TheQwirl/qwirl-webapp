"use client";
import React from "react";
import { motion } from "framer-motion";
import EngagementBreakdown from "@/components/qwirl-details/engegement-breakdown";
import QuestionInsights from "@/components/qwirl-details/question-insights";
import HistoricalTrends from "@/components/qwirl-details/historical-trends";
import Suggestions from "@/components/qwirl-details/suggestions";
import Footer from "@/components/qwirl-details/footer";

const PrimaryQwirlDetails = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* <Header /> */}
      <EngagementBreakdown />
      <QuestionInsights />
      <HistoricalTrends />
      <Suggestions />
      <Footer />
    </motion.div>
  );
};

export default PrimaryQwirlDetails;
