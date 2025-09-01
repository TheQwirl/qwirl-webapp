import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ProgressVariant = "default" | "success" | "warning" | "error" | "info";
type ProgressSize = "sm" | "md" | "lg" | "xl";

interface ProgressBarProps {
  /** Current value (optional when indeterminate is true) */
  value?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Minimum value (default: 0) */
  min?: number;
  /** Visual variant */
  variant?: ProgressVariant;
  /** Size of the progress bar */
  size?: ProgressSize;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Show value text (e.g., "25/100") */
  showValue?: boolean;
  /** Custom label */
  label?: string;
  /** Show label */
  showLabel?: boolean;
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Disable animations */
  disableAnimation?: boolean;
  /** Show striped pattern */
  striped?: boolean;
  /** Animate stripes */
  animateStripes?: boolean;
  /** Custom colors */
  customColors?: {
    background?: string;
    fill?: string;
    text?: string;
  };
  /** Additional CSS classes */
  className?: string;
  /** Indeterminate progress (loading state) */
  indeterminate?: boolean;
  /** Custom format function for displayed text */
  formatText?: (value: number, max: number, percentage: number) => string;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Show glow effect */
  showGlow?: boolean;
  /** Gradient fill */
  gradient?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  min = 0,
  variant = "default",
  size = "md",
  showPercentage = false,
  showValue = false,
  label,
  showLabel = false,
  animationDuration = 0.5,
  disableAnimation = false,
  striped = false,
  animateStripes = false,
  customColors,
  className = "",
  indeterminate = false,
  formatText,
  onAnimationComplete,
  showGlow = false,
  gradient = false,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Clamp value between min and max
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  useEffect(() => {
    if (!disableAnimation) {
      setIsAnimating(true);
      const startValue = value; // Changed from displayValue to value
      const targetValue = clampedValue;
      const duration = animationDuration * 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easeOut;

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onAnimationComplete?.();
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayValue(clampedValue);
    }
  }, [
    clampedValue,
    animationDuration,
    disableAnimation,
    onAnimationComplete,
    value,
  ]);

  // Variant styles
  const variantStyles = {
    default: {
      background: "bg-gray-200 dark:bg-gray-700",
      fill: gradient
        ? "bg-gradient-to-r from-blue-500 to-blue-600"
        : "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      glow: "shadow-blue-500/50",
    },
    success: {
      background: "bg-gray-200 dark:bg-gray-700",
      fill: gradient
        ? "bg-gradient-to-r from-green-500 to-green-600"
        : "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      glow: "shadow-green-500/50",
    },
    warning: {
      background: "bg-gray-200 dark:bg-gray-700",
      fill: gradient
        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
        : "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400",
      glow: "shadow-yellow-500/50",
    },
    error: {
      background: "bg-gray-200 dark:bg-gray-700",
      fill: gradient
        ? "bg-gradient-to-r from-red-500 to-red-600"
        : "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      glow: "shadow-red-500/50",
    },
    info: {
      background: "bg-gray-200 dark:bg-gray-700",
      fill: gradient
        ? "bg-gradient-to-r from-cyan-500 to-blue-500"
        : "bg-cyan-500",
      text: "text-cyan-600 dark:text-cyan-400",
      glow: "shadow-cyan-500/50",
    },
  };

  // Size styles
  const sizeStyles = {
    sm: { height: "h-1", text: "text-xs", padding: "px-2 py-1" },
    md: { height: "h-2", text: "text-sm", padding: "px-3 py-1.5" },
    lg: { height: "h-3", text: "text-base", padding: "px-4 py-2" },
    xl: { height: "h-4", text: "text-lg", padding: "px-5 py-2.5" },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  // Generate display text
  const getDisplayText = () => {
    if (formatText) {
      return formatText(displayValue, max, (displayValue / max) * 100);
    }

    if (showValue && showPercentage) {
      return `${Math.round(displayValue)}/${max} (${Math.round(percentage)}%)`;
    }

    if (showValue) {
      return `${Math.round(displayValue)}/${max}`;
    }

    if (showPercentage) {
      return `${Math.round(percentage)}%`;
    }

    return "";
  };

  const displayText = getDisplayText();
  const displayPercentage = indeterminate ? 100 : percentage;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      <AnimatePresence>
        {showLabel && label && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex justify-between items-center mb-2 ${currentSize.text}`}
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
            {displayText && (
              <span className={`font-medium ${currentVariant.text}`}>
                {displayText}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar Container */}
      <div
        className={`
          relative overflow-hidden rounded-full
          ${currentVariant.background}
          ${currentSize.height}
          ${showGlow ? `shadow-lg ${currentVariant.glow}` : ""}
        `}
        style={{
          backgroundColor: customColors?.background,
        }}
      >
        {/* Progress Fill */}
        <motion.div
          className={`
            h-full rounded-full relative overflow-hidden
            ${currentVariant.fill}
            ${striped ? "bg-stripes" : ""}
            ${showGlow ? "shadow-lg" : ""}
          `}
          style={{
            backgroundColor: customColors?.fill,
          }}
          initial={{ width: 0 }}
          animate={{
            width: indeterminate ? "100%" : `${displayPercentage}%`,
            x: indeterminate ? ["-100%", "100%"] : 0,
          }}
          transition={{
            width: disableAnimation
              ? { duration: 0 }
              : {
                  duration: animationDuration,
                  ease: "easeOut",
                },
            x: indeterminate
              ? {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }
              : { duration: 0 },
          }}
          onAnimationComplete={() => {
            if (!indeterminate) {
              onAnimationComplete?.();
            }
          }}
        >
          {/* Striped Pattern */}
          {striped && (
            <div
              className={`
                absolute inset-0 opacity-30
                bg-gradient-to-r from-transparent via-white to-transparent
                ${animateStripes ? "animate-pulse" : ""}
              `}
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`,
              }}
            />
          )}

          {/* Shimmer Effect */}
          {isAnimating && !indeterminate && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </motion.div>

        {/* Indeterminate overlay */}
        {indeterminate && (
          <motion.div
            className={`absolute inset-0 ${currentVariant.fill} opacity-30`}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            style={{ width: "50%" }}
          />
        )}
      </div>

      {/* Bottom Text */}
      {displayText && !showLabel && (
        <motion.div
          className={`mt-2 text-center ${currentSize.text} ${currentVariant.text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: customColors?.text }}
        >
          {displayText}
        </motion.div>
      )}
    </div>
  );
};

export default ProgressBar;
