import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Star } from "lucide-react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

interface WavelengthProgressProps {
  currentValue: number;
  newValue: number;
  maxValue?: number;
  duration?: number;
  title?: string;
  subtitle?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showNumbers?: boolean;
  onAnimationComplete?: () => void;
}

export const progressContainer = cva(
  "relative bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
  {
    variants: {
      size: {
        sm: "p-3 min-w-[200px]",
        md: "p-4 min-w-[250px]",
        lg: "p-6 min-w-[300px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const progressText = cva(
  "font-semibold text-gray-900 dark:text-gray-100",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const progressNumber = cva("font-mono font-bold", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const WavelengthProgress: React.FC<WavelengthProgressProps> = ({
  currentValue,
  newValue,
  maxValue = 100,
  duration = 2000,
  title = "Wavelength Progress",
  subtitle = "Keep it up!",
  className = "",
  size = "md",
  showNumbers = true,
  onAnimationComplete,
}) => {
  const [animatedValue, setAnimatedValue] = useState(currentValue);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentPercent = Math.min((currentValue / maxValue) * 100, 100);
  //   const newPercent = Math.min((newValue / maxValue) * 100, 100);
  const animatedPercent = Math.min((animatedValue / maxValue) * 100, 100);

  useEffect(() => {
    if (currentValue !== newValue) {
      setIsAnimating(true);
      const startTime = Date.now();
      const startValue = currentValue;
      const valueChange = newValue - currentValue;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentAnimatedValue = startValue + valueChange * easeOutQuart;

        setAnimatedValue(currentAnimatedValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimatedValue(newValue);
          setIsAnimating(false);
          onAnimationComplete?.();
        }
      };

      requestAnimationFrame(animate);
    }
  }, [currentValue, newValue, duration, onAnimationComplete]);

  const containerVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      y: 20,
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const sparkleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
        ease: "easeOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={progressContainer({ size, className })}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isAnimating ? pulseVariants.pulse : {}}
            className="relative"
          >
            <Zap className="h-5 w-5 text-blue-500" />
            {isAnimating && (
              <motion.div
                variants={sparkleVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-1 -right-1"
              >
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
              </motion.div>
            )}
          </motion.div>
          <div>
            <h3 className={progressText({ size })}>{title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        {showNumbers && (
          <div className="text-right">
            <motion.div
              key={Math.floor(animatedValue)}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={clsx(
                progressNumber({ size }),
                "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              )}
            >
              {Math.floor(animatedValue)}
            </motion.div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              / {maxValue}
            </div>
          </div>
        )}
      </div>

      {/* Progress bar container */}
      <div className="relative">
        {/* Background track */}
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Current progress (static) */}
          <motion.div
            className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"
            initial={{ width: `${currentPercent}%` }}
            style={{ width: `${currentPercent}%` }}
          />

          {/* Animated progress overlay */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
            initial={{ width: `${currentPercent}%` }}
            animate={{ width: `${animatedPercent}%` }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: isAnimating ? Infinity : 0,
                ease: "easeInOut",
              }}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-60" />
          </motion.div>
        </div>

        {/* Progress indicator particles */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `${animatedPercent}%` }}
              initial={{ x: "-50%" }}
              animate={{ x: "-50%" }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 15],
                    y: [0, (i - 1) * -10],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Achievement indicator */}
      {newValue > currentValue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex items-center gap-1 text-green-600 dark:text-green-400"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">
            +{Math.floor(newValue - currentValue)} gained!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WavelengthProgress;
