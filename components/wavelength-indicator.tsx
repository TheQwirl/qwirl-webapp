"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Heart, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface WavelengthIndicatorProps {
  wavelength: number;
  userName: string;
}

const WavelengthIndicator = ({
  wavelength,
  userName,
}: WavelengthIndicatorProps) => {
  const getWavelengthColor = (value: number) => {
    if (value >= 80) return "from-pink-500 via-red-500 to-orange-500";
    if (value >= 60) return "from-purple-500 via-pink-500 to-red-500";
    if (value >= 40) return "from-blue-500 via-purple-500 to-pink-500";
    if (value >= 20) return "from-green-500 via-blue-500 to-purple-500";
    return "from-gray-400 via-gray-500 to-gray-600";
  };

  const getWavelengthText = (value: number) => {
    if (value >= 90) return "Soulmates";
    if (value >= 80) return "Best Friends";
    if (value >= 70) return "Close Friends";
    if (value >= 60) return "Good Friends";
    if (value >= 50) return "Friends";
    if (value >= 40) return "Getting Close";
    if (value >= 30) return "Acquaintances";
    if (value >= 20) return "Just Met";
    return "Strangers";
  };

  const getIcon = (value: number) => {
    if (value >= 80) return Heart;
    if (value >= 60) return Star;
    if (value >= 40) return Sparkles;
    return Zap;
  };

  const Icon = getIcon(wavelength);
  const colorClass = getWavelengthColor(wavelength);
  const relationshipText = getWavelengthText(wavelength);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`relative overflow-hidden bg-gradient-to-r ${colorClass} border-0 shadow-lg`}
      >
        <div className="absolute inset-0 bg-black/10" />
        <CardContent className="relative p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium opacity-90">
                  Wavelength with {userName}
                </div>
                <div className="text-lg font-bold">
                  {wavelength}% • {relationshipText}
                </div>
              </div>
            </div>

            {/* Wavelength Meter */}
            <div className="flex flex-col items-end">
              <div className="text-2xl font-bold mb-1">{wavelength}</div>
              <div className="w-20 h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${wavelength}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
          </div>

          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 bg-white/10 rounded-[20px]"
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

export default WavelengthIndicator;
