import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const participationData = [
  { name: "Week 1", value: 100 },
  { name: "Week 2", value: 300 },
  { name: "Week 3", value: 200 },
  { name: "Week 4", value: 500 },
  { name: "Week 5", value: 400 },
];

const completionRateData = [
  { name: "Week 1", value: 60 },
  { name: "Week 2", value: 70 },
  { name: "Week 3", value: 65 },
  { name: "Week 4", value: 80 },
  { name: "Week 5", value: 75 },
];

export default function HistoricalTrends() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="mb-4 text-2xl font-bold text-purple-800">
        Historical Trends
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="overflow-hidden bg-white/80 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-pink-400 to-red-400 p-3">
            <CardTitle className="text-sm font-medium text-white">
              Participation Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={participationData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="overflow-hidden bg-white/80 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-400 to-amber-400 p-3">
            <CardTitle className="text-sm font-medium text-white">
              Completion Rate Over Time
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={completionRateData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
