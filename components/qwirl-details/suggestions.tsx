import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const suggestions = [
  "Replace or revise Question 2 (skipped by 75% of participants).",
  "Consider adding more questions about music to align with user interests.",
  "Encourage participants to complete saved Qwirls (23 incomplete Qwirls exist).",
];

export default function Suggestions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h2 className="mb-4 text-2xl font-bold text-purple-800">
        Suggestions for Improvement
      </h2>
      <Card className="overflow-hidden bg-white/80 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-amber-400 p-3">
          <CardTitle className="text-sm font-medium text-white">
            Actionable Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
