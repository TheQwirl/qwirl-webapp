"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Heart, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

interface WavelengthIndicatorProps {
  wavelength: number;
  userName: string;
  variant?:
    | "horizontal"
    | "vertical"
    | "compact-horizontal"
    | "compact-vertical"
    | "badge";
}

const WavelengthIndicator = ({
  wavelength,
  variant = "horizontal",
}: // userName,
WavelengthIndicatorProps) => {
  const getWavelengthColor = (value: number) => {
    if (value >= 80) return "bg-destructive";
    if (value >= 60) return "bg-primary";
    if (value >= 40) return "bg-sidebar-primary";
    if (value >= 20) return "bg-secondary";
    return "bg-muted-foreground";
  };

  const getWavelengthTextColor = (value: number) => {
    if (value >= 80) return "text-destructive";
    if (value >= 60) return "text-primary";
    if (value >= 40) return "text-sidebar-primary";
    if (value >= 20) return "text-secondary";
    return "text-muted-foreground";
  };

  const getWavelengthBgLight = (value: number) => {
    if (value >= 80) return "bg-destructive/10";
    if (value >= 60) return "bg-primary/10";
    if (value >= 40) return "bg-sidebar-primary/10";
    if (value >= 20) return "bg-secondary/10";
    return "bg-muted-foreground/10";
  };

  const getWavelengthBgPulse = (value: number) => {
    if (value >= 80) return "bg-destructive/50";
    if (value >= 60) return "bg-primary/50";
    if (value >= 40) return "bg-sidebar-primary/50";
    if (value >= 20) return "bg-secondary/50";
    return "bg-muted-foreground/50";
  };

  const getIcon = (value: number) => {
    if (value >= 80) return Heart;
    if (value >= 60) return Star;
    if (value >= 40) return Sparkles;
    return Zap;
  };

  const Icon = getIcon(wavelength);
  const colorClass = getWavelengthColor(wavelength);
  const textColorClass = getWavelengthTextColor(wavelength);
  const bgLightClass = getWavelengthBgLight(wavelength);
  const bgPulseClass = getWavelengthBgPulse(wavelength);

  // Badge - compact inline badge variant with pulsating icon
  if (variant === "badge") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center gap-3  rounded-full border bg-white backdrop-blur-sm"
      >
        {/* Icon with pulsing effect */}
        <div className={`relative rounded-full ${bgLightClass} p-1`}>
          <motion.div
            className={`absolute inset-0 rounded-full ${bgPulseClass}`}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <Icon className={`h-3 w-3 ${textColorClass} relative z-10`} />
        </div>

        {/* Percentage */}
        <span className="text-xs font-semibold pr-2 ">{wavelength}%</span>
      </motion.div>
    );
  }

  // Compact Vertical - minimalist vertical layout for cards
  if (variant === "compact-vertical") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden border w-full ">
          <CardContent className="relative p-3">
            <div className="flex flex-col items-center gap-2">
              {/* Icon with pulsing effect */}
              <div className={`p-1.5 relative rounded-full ${bgLightClass}`}>
                <motion.div
                  className={`absolute inset-0 rounded-full ${bgPulseClass}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <Icon className={`h-4 w-4 ${textColorClass} relative z-10`} />
              </div>

              {/* Wavelength percentage */}
              <div className="text-base font-bold tabular-nums">
                {wavelength}%
              </div>

              {/* Mini vertical progress bar */}
              {/* <div className="w-1 h-12 rounded-full overflow-hidden bg-muted/50">
                <motion.div
                  className={`w-full rounded-full ${colorClass}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${wavelength}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut",
                  }}
                />
              </div> */}
            </div>

            {/* Subtle background pulse */}
            <motion.div
              className="absolute inset-0 rounded-[calc(var(--radius)*2)] bg-primary/5"
              animate={{
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Compact Horizontal - minimalist horizontal layout for inline display
  if (variant === "compact-horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden border w-full ">
          <CardContent className="relative p-2.5">
            <div className="flex items-center gap-3">
              {/* Icon with pulsing effect */}
              <div
                className={`p-1.5 relative rounded-full ${bgLightClass} flex-shrink-0`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-full ${bgPulseClass}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <Icon className={`h-4 w-4 ${textColorClass} relative z-10`} />
              </div>

              {/* Progress bar and percentage */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted/50">
                  <motion.div
                    className={`h-full rounded-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${wavelength}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <div className="text-sm font-bold tabular-nums whitespace-nowrap">
                  {wavelength}%
                </div>
              </div>
            </div>

            {/* Subtle background pulse */}
            <motion.div
              className="absolute inset-0 rounded-[calc(var(--radius)*2)] bg-primary/5"
              animate={{
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === "vertical") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden border w-full ">
          <CardContent className="relative p-4">
            <div className="flex flex-col items-center gap-3">
              {/* Icon and Title */}
              <div className="uppercase tracking-wider text-xs">Wavelength</div>
              <div className="flex flex-col items-center gap-2">
                <div className={`p-2 relative rounded-full ${bgLightClass}`}>
                  <div
                    className={`animate-ping duration-[2000ms] absolute inset-0 rounded-full ${bgPulseClass}`}
                  ></div>
                  <Icon className={`h-5 w-5 ${textColorClass}`} />
                </div>
              </div>

              {/* Vertical Progress Bar */}
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-bold">{wavelength}%</div>
                <div className="h-32 w-2 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    className={`w-full rounded-full ${colorClass}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${wavelength}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ marginTop: "auto" }}
                  />
                </div>
              </div>
            </div>

            {/* Pulse Animation */}
            <motion.div
              className="absolute inset-0 rounded-[calc(var(--radius)*2)] bg-primary/5"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="overflow-hidden border w-full ">
        <CardContent className="relative p-4">
          <div className="mt-3 md:mt-0 flex items-center md:flex-row flex-col justify-between gap-x-4 gap-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 relative rounded-full ${bgLightClass}`}>
                <div
                  className={`animate-ping duration-[2000ms] absolute inset-0 rounded-full ${bgPulseClass}`}
                ></div>
                <Icon className={`h-5 w-5 ${textColorClass}`} />
              </div>
              <div className="uppercase tracking-wider text-xs hidden lg:block">
                Wavelength
              </div>
            </div>

            {/* Wavelength Meter */}
            <div className="flex flex-col items-center md:items-end">
              <div className="text-2xl font-bold mb-1">{wavelength}%</div>
              <div className="w-20 h-2 rounded-full overflow-hidden bg-muted">
                <motion.div
                  className={`h-full rounded-full ${colorClass}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${wavelength}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 rounded-[calc(var(--radius)*2)] bg-primary/5"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const WavelengthIndicatorLoading = () => {
  return (
    <div className="relative">
      <Card className="overflow-hidden border w-full ">
        <CardContent className="relative p-4">
          <div className="flex items-center justify-between gap-x-4 gap-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 relative rounded-full bg-gray-300 animate-pulse">
                <Zap className="h-5 w-5 text-gray-500" />
              </div>
              <div className="uppercase tracking-wider text-sm hidden lg:block text-gray-500">
                Wavelength
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <Skeleton className="h-6 w-20 mb-1" />
              <Skeleton className="h-2 w-20 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WavelengthIndicator;
