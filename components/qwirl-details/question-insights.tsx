import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const questions = [
  { id: "q1", text: "What is your favorite color?" },
  { id: "q2", text: "How often do you exercise?" },
  { id: "q3", text: "What is your preferred music genre?" },
];

const answerData = {
  q1: [
    { name: "Blue", value: 40 },
    { name: "Red", value: 30 },
    { name: "Green", value: 20 },
    { name: "Yellow", value: 10 },
  ],
  q2: [
    { name: "Daily", value: 25 },
    { name: "2-3 times/week", value: 40 },
    { name: "Once a week", value: 20 },
    { name: "Rarely", value: 15 },
  ],
  q3: [
    { name: "Pop", value: 35 },
    { name: "Rock", value: 30 },
    { name: "Hip Hop", value: 20 },
    { name: "Classical", value: 15 },
  ],
};

export default function QuestionInsights() {
  const [selectedQuestion, setSelectedQuestion] =
    useState<keyof typeof answerData>("q1");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="mb-4 text-2xl font-bold text-purple-800">
        Question Insights
      </h2>
      <Card className="overflow-hidden bg-white/80 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-400 to-purple-400 p-3">
          <CardTitle className="text-sm font-medium text-white">
            Question Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Select
            onValueChange={(value: keyof typeof answerData) =>
              setSelectedQuestion(value)
            }
            defaultValue={selectedQuestion}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a question" />
            </SelectTrigger>
            <SelectContent>
              {questions.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={answerData?.[selectedQuestion]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Skipped Rate: 5%</p>
            <p className="text-sm text-gray-600">Wavelength Impact: Positive</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
