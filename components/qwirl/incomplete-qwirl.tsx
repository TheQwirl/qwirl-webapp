"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Construction, Clock, Coffee, Zap, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
interface IncompleteQwirlProps {
  ownerName: string;
  ownerUsername: string;
  ownerAvatar?: string;
  pollCount?: number;
  onGoBack?: () => void;
  onNotifyWhenReady?: () => void;
}

const playfulMessages = [
  "is still putting the finishing touches on their qwirl! ✨",
  "got distracted by cat videos while making this qwirl 🐱",
  "is probably overthinking the perfect questions right now 🤔",
  "left this qwirl half-baked like cookies in the oven 🍪",
  "is taking their sweet time crafting the perfect qwirl ⏰",
  "might have fallen asleep while creating this masterpiece 😴",
  "is channeling their inner perfectionist with this qwirl 🎨",
];

const IncompleteQwirl = ({
  ownerName,
  pollCount = 0,
  onGoBack,
  onNotifyWhenReady,
}: IncompleteQwirlProps) => {
  const randomMessage =
    playfulMessages[Math.floor(Math.random() * playfulMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border-2 p-4 "
    >
      <div className="space-y-6 p-8 text-center">
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 3,
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <Construction className="h-16 w-16 text-orange-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute -top-2 -right-2"
            >
              <Zap className="h-6 w-6 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Playful Message */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            Qwirl Under Construction!
          </h2>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-medium">{ownerName}</span> {randomMessage}
          </p>
        </div>

        {/* Status Info */}
        <div className="flex items-center justify-center gap-4 p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700">Work in Progress</span>
          </div>
          {pollCount > 0 && (
            <>
              <div className="w-1 h-1 bg-orange-400 rounded-full" />
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-700 text-xs"
              >
                {pollCount} question{pollCount !== 1 ? "s" : ""} so far
              </Badge>
            </>
          )}
        </div>

        {/* Encouragement */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Meanwhile...
            </span>
          </div>
          <p className="text-xs text-yellow-700">
            Why not grab a coffee and check back later? Great qwirls are worth
            the wait! ☕️
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={onNotifyWhenReady}
            icon={Zap}
            iconPlacement="left"
            className=""
          >
            Notify Me When Ready
          </Button>

          {onGoBack && (
            <Button
              variant="outline"
              onClick={onGoBack}
              className="w-full bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>

        {/* Fun Footer */}
        <div className="text-xs text-gray-500 italic">
          &quot;Rome wasn&apos;t built in a day, and neither are great
          qwirls!&quot; 🏛️
        </div>
      </div>
    </motion.div>
  );
};

export default IncompleteQwirl;
