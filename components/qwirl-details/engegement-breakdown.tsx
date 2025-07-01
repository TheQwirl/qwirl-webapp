import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const funnelData = [
  { name: "Started", value: 1000 },
  { name: "Partial", value: 750 },
  { name: "Completed", value: 500 },
];

const skippedData = [
  { name: "Q1", value: 10 },
  { name: "Q2", value: 25 },
  { name: "Q3", value: 5 },
  { name: "Q4", value: 15 },
  { name: "Q5", value: 30 },
];

const wavelengthData = [
  { name: "0-30%", value: 30 },
  { name: "31-60%", value: 45 },
  { name: "61-100%", value: 25 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

export default function EngagementBreakdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="mb-4 text-2xl font-bold text-purple-800">
        Engagement Breakdown
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden bg-white/80 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-400 to-cyan-400 p-3">
            <CardTitle className="text-sm font-medium text-white">
              Participation Funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="overflow-hidden bg-white/80 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-400 to-teal-400 p-3">
            <CardTitle className="text-sm font-medium text-white">
              Skipped Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={skippedData}>
                <XAxis dataKey="name" />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="overflow-hidden bg-white/80 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3">
            <CardTitle className="text-sm font-medium text-white">
              Wavelength Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={wavelengthData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {wavelengthData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
