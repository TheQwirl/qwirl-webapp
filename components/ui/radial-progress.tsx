"use client";

import clsx from "clsx";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface RadialProgressProps {
  current: number;
  total: number;
  title?: string;
  description?: string;
  className?: string;
  percentageClassName?: string;
}

export function RadialProgress({
  current,
  total,
  className,
  percentageClassName,
}: RadialProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const data = [
    { name: "Completed", value: current },
    { name: "Remaining", value: total - current },
  ];

  return (
    <div className={clsx(" relative", className ?? "w-48 h-48")}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="hsl(var(--primary))" />
            <Cell fill="hsl(var(--muted))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className={percentageClassName ?? "text-3xl font-bold"}>
          {percentage}%
        </span>
        <span className="text-sm text-muted-foreground">
          {current} / {total}
        </span>
      </div>
    </div>
  );
}
