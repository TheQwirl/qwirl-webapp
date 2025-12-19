"use client";

import { HeartPulseIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

interface WavelengthIndicatorProps {
  wavelength: number;
  variant?: "default" | "badge";
}

type WavelengthState = {
  min: number;
  label: string;
  background: string;
  accent: string;
  iconBg: string;
  glowBg: string;
};

const WAVELENGTH_STATES: WavelengthState[] = [
  {
    min: 90,
    label: "Matching Wavelengths",
    background: "bg-primary/10 border-primary/20",
    accent: "text-primary",
    iconBg: "bg-primary/20 text-primary",
    glowBg: "bg-primary/30",
  },
  {
    min: 75,
    label: "Strongly In Tune",
    background: "bg-sidebar-primary/10 border-sidebar-primary/20",
    accent: "text-sidebar-primary",
    iconBg: "bg-sidebar-primary/20 text-sidebar-primary",
    glowBg: "bg-sidebar-primary/30",
  },
  {
    min: 50,
    label: "Some Resonance",
    background: "bg-secondary/50 border-secondary/20",
    accent: "text-secondary-foreground",
    iconBg: "bg-secondary/50 text-secondary-foreground",
    glowBg: "bg-secondary/40",
  },
  {
    min: 25,
    label: "Faint Resonance",
    background: "bg-muted/40 border-muted",
    accent: "text-muted-foreground",
    iconBg: "bg-muted/60 text-muted-foreground",
    glowBg: "bg-muted/80",
  },
  {
    min: 0,
    label: "Off Frequency",
    background: "bg-muted/60 border-muted/80",
    accent: "text-muted-foreground",
    iconBg: "bg-muted/70 text-muted-foreground",
    glowBg: "bg-muted",
  },
];

const getWavelengthState = (value: number) => {
  return (
    WAVELENGTH_STATES.find((state) => value >= state.min) ??
    WAVELENGTH_STATES.at(-1)!
  );
};

const ripplePulse = {
  scale: [1, 1.5, 1],
  opacity: [0.6, 0, 0.6],
};

const ripplePulseTransition = {
  duration: 2,
  repeat: Number.POSITIVE_INFINITY,
  ease: "easeOut",
  repeatDelay: 0.5,
};

const WavelengthIndicator = ({
  wavelength,
  variant = "default",
}: WavelengthIndicatorProps) => {
  const clampedValue = Math.min(Math.max(wavelength, 0), 100);
  const formattedWavelength = clampedValue.toFixed(0);
  const state = getWavelengthState(clampedValue);

  if (variant === "badge") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${state.background}`}
      >
        <div
          className={`relative flex h-5 w-5 items-center justify-center rounded-full ${state.iconBg}`}
        >
          {/* Static background */}
          <div className={`absolute inset-0 rounded-full ${state.iconBg}`} />
          {/* Pulsating ripple */}
          <motion.span
            className={`absolute inset-0 rounded-full ${state.glowBg}`}
            animate={ripplePulse}
            transition={ripplePulseTransition}
            aria-hidden
          />
          <HeartPulseIcon className="h-4 w-4 relative z-10" />
        </div>
        <span className="tabular-nums">{formattedWavelength}%</span>
        <span
          className={`hidden sm:inline text-[11px] uppercase ${state.accent}`}
        >
          {state.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`border ${state.background} shadow w-fit py-2 px-3 rounded-lg`}
    >
      <div className="flex items-center gap-1 justify-center">
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full ${state.iconBg}`}
        >
          {/* Static background */}
          <div className={`absolute inset-0 rounded-full ${state.iconBg}`} />
          {/* Pulsating ripple */}
          <motion.span
            className={`absolute inset-0 rounded-full ${state.glowBg}`}
            animate={ripplePulse}
            transition={ripplePulseTransition}
            aria-hidden
          />
          <HeartPulseIcon className="h-7 w-7 relative z-10" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-2xl leading-none font-semibold tracking-wide">
            {formattedWavelength}
            <span className="text-muted-foreground text-base">%</span>
          </span>
          <span className={`text-xs leading-none font-medium  ${state.accent}`}>
            {state.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export const WavelengthIndicatorLoading = () => {
  return (
    <div className="border bg-muted/40 shadow-none">
      <div className="flex items-center gap-4 p-4">
        <div className="h-12 w-12 rounded-2xl bg-muted/70 animate-pulse" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
};

export default WavelengthIndicator;
