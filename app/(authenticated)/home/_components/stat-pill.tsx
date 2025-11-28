"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatPillProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  tone: "light" | "dark";
}

export default function StatPill({
  label,
  value,
  icon: Icon,
  tone,
}: StatPillProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm",
        tone === "dark"
          ? "border-white/15 bg-white/5 text-white"
          : "border-border/40 bg-background/70"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            tone === "dark" ? "text-white/80" : "text-muted-foreground"
          )}
        />
      )}
      <div className="min-w-0">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-wide",
            tone === "dark" ? "text-white/60" : "text-muted-foreground"
          )}
        >
          {label}
        </p>
        <p className="text-base font-semibold leading-tight truncate">
          {value}
        </p>
      </div>
    </div>
  );
}
