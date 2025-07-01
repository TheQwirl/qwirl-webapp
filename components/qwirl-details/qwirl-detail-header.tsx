import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Edit } from "lucide-react";

const metrics = [
  { title: "Total Participants", value: "1,234" },
  { title: "Completion Rate", value: "78%" },
  { title: "Avg. Completion Time", value: "3m 45s" },
  { title: "Most Popular Question", value: "Q3: Your favorite color?" },
];

export default function QwirlDetailHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-6 text-4xl font-extrabold text-purple-800">
        Qwirl Insights: The Color Spectrum
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="overflow-hidden bg-white/80 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <CardHeader className="bg-gradient-to-r from-purple-400 to-pink-400 p-3">
              <CardTitle className="text-sm font-medium text-white">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        <Button className="bg-purple-500 hover:bg-purple-600">
          <Share className="mr-2 h-4 w-4" /> Encourage More Participants
        </Button>
        <Button
          variant="outline"
          className="border-purple-500 text-purple-500 hover:bg-purple-100"
        >
          <Edit className="mr-2 h-4 w-4" /> Revise Qwirl Questions
        </Button>
      </div>
    </motion.div>
  );
}
