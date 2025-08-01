"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Heart, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { InfoWidget } from "./info-widget";
import { Skeleton } from "./ui/skeleton";

interface WavelengthIndicatorProps {
  wavelength: number;
  userName: string;
}

const WavelengthIndicator = ({
  wavelength,
}: // userName,
WavelengthIndicatorProps) => {
  const getWavelengthColor = (value: number) => {
    if (value >= 80) return "from-primary via-destructive to-accent";
    if (value >= 60) return "from-primary via-sidebar-primary to-destructive";
    if (value >= 40) return "from-secondary via-primary to-sidebar-primary";
    if (value >= 20) return "from-secondary via-muted to-primary";
    return "from-muted-foreground via-border to-muted";
  };

  // const getWavelengthText = (value: number) => {
  //   if (value >= 90) return "Soulmates";
  //   if (value >= 80) return "Best Friends";
  //   if (value >= 70) return "Close Friends";
  //   if (value >= 60) return "Good Friends";
  //   if (value >= 50) return "Friends";
  //   if (value >= 40) return "Getting Close";
  //   if (value >= 30) return "Acquaintances";
  //   if (value >= 20) return "Just Met";
  //   return "Strangers";
  // };

  const getIcon = (value: number) => {
    if (value >= 80) return Heart;
    if (value >= 60) return Star;
    if (value >= 40) return Sparkles;
    return Zap;
  };

  const getTextColor = (value: number) => {
    if (value >= 60) return "text-primary-foreground";
    if (value >= 40) return "text-foreground";
    return "text-muted-foreground";
  };

  const getBackgroundOpacity = (value: number) => {
    if (value >= 60) return "bg-black/20";
    if (value >= 40) return "bg-black/10";
    return "bg-white/10";
  };

  const Icon = getIcon(wavelength);
  const colorClass = getWavelengthColor(wavelength);
  // const relationshipText = getWavelengthText(wavelength);
  const textColorClass = getTextColor(wavelength);
  const overlayClass = getBackgroundOpacity(wavelength);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <InfoWidget
        position="topLeft"
        size="sm"
        infoTitle="Wavelength"
        className="!top-[1.5px] !left-[1.5px]"
        infoDescription="This shows how close you two are based on your interactions, qwirls, and other stuff."
      />
      <Card
        className={`overflow-hidden bg-gradient-to-r ${colorClass} border-0 w-full`}
      >
        <div className={`absolute inset-0 ${overlayClass}`} />
        <CardContent className="relative p-4">
          <div
            className={`mt-3 md:mt-0 flex items-center md:flex-row flex-col justify-between gap-x-4 gap-y-4 ${textColorClass}`}
          >
            <div className="flex items-center gap-3">
              <div
                className="p-2 relative rounded-full backdrop-blur-sm"
                style={{
                  backgroundColor: "hsl(var(--primary-foreground) / 0.2)",
                }}
              >
                <div className="animate-ping duration-[2000ms] absolute inset-0 rounded-full bg-primary/50"></div>
                <Icon className="h-5 w-5" />
              </div>
              <div className="uppercase tracking-wider text-sm hidden lg:block ">
                Wavelength
              </div>
              {/* <div className="hidden md:block">
                <div className="text-sm font-medium opacity-90">
                  Wavelength with {userName}
                </div>
                <div className="text-lg font-bold">
                  {wavelength}% • {relationshipText}
                </div>
              </div> */}
            </div>

            {/* Wavelength Meter */}
            <div className="flex flex-col items-center md:items-end">
              <div className="text-2xl font-bold mb-1 text-primary-foreground">
                {wavelength}
              </div>
              <div
                className="w-20 h-2 rounded-full overflow-hidden backdrop-blur-sm"
                style={{
                  backgroundColor: "hsl(var(--primary-foreground) / 0.3)",
                }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "hsl(var(--primary-foreground))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${wavelength}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 rounded-[calc(var(--radius)*2)]"
            style={{ backgroundColor: "hsl(var(--primary-foreground) / 0.1)" }}
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
      <InfoWidget
        position="topLeft"
        size="sm"
        infoTitle="Wavelength"
        className="!top-[1.5px] !left-[1.5px]"
        infoDescription="This shows how close you two are based on your interactions, qwirls, and other stuff."
      />
      <Card className="overflow-hidden bg-gray-200 border-0 w-full">
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
