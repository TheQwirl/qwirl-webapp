import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const HorizontalBarGraph = () => {
  const chartData = [
    { category: "Sports", questions: 2 },
    { category: "Philosophy", questions: 6 },
    { category: "Professional", questions: 10 },
    { category: "Business", questions: 10 },
    { category: "Politics", questions: 10 },
    { category: "History", questions: 10 },
    { category: "Geography", questions: 10 },
    { category: "Entertainment", questions: 10 },
  ];
  const chartConfig = {
    questions: {
      label: "Questions",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer className="w-48 h-48" config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <XAxis type="number" dataKey="questions" hide />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="questions" fill="hsl(var(--primary))" radius={10} />
      </BarChart>
    </ChartContainer>
  );
};

export default HorizontalBarGraph;
