import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CompatibilityQwirlProgressBarProps {
  /** Progress percentage (0-100) */
  percentage: number;
  /** Custom content to display in the center */
  middleContent?: React.ReactNode;
  /** Whether the wavelength is decreasing (shows sparkling effect) */
  isDecreasing?: boolean;
  /** Color for the filled portion of the arc */
  arcColor?: string;
  /** Color for the unfilled portion of the arc */
  trailColor?: string;
  /** Size of the component in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
}

const WavelengthProgressBar: React.FC<CompatibilityQwirlProgressBarProps> = ({
  percentage,
  middleContent,
  isDecreasing = false,
  arcColor = "#3b82f6",
  trailColor = "#e5e7eb",
  size = 200,
  className = "",
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  // SVG dimensions and calculations
  const radius = (size - 20) / 2; // Account for stroke width and padding
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = 8;

  // Calculate arc path for semi-circle (180 degrees)
  const startAngle = -180; // Start from left
  const endAngle = 0; // End at right
  const totalAngle = endAngle - startAngle; // 180 degrees

  // Convert percentage to angle
  const progressAngle = startAngle + (totalAngle * clampedPercentage) / 100;

  // Helper function to convert angle to coordinates
  const polarToCartesian = useCallback(
    (angle: number, r: number) => {
      const angleInRadians = (angle * Math.PI) / 180;
      return {
        x: centerX + r * Math.cos(angleInRadians),
        y: centerY + r * Math.sin(angleInRadians),
      };
    },
    [centerX, centerY]
  );

  // Generate SVG path for arc
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number
  ) => {
    const start = polarToCartesian(startAngle, radius);
    const end = polarToCartesian(endAngle, radius);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  };

  // Paths for trail and progress arcs
  const trailPath = createArcPath(startAngle, endAngle, radius);
  const progressPath = createArcPath(startAngle, progressAngle, radius);

  // Calculate spark position (end of progress arc)
  const sparkPosition = useMemo(() => {
    if (clampedPercentage === 0) return null;
    return polarToCartesian(progressAngle, radius);
  }, [clampedPercentage, polarToCartesian, progressAngle, radius]);

  // Sparkling animation variants
  const sparkVariants = {
    idle: {
      scale: 1,
      opacity: 0.8,
      rotate: 0,
    },
    sparkling: {
      scale: [1, 1.3, 0.9, 1.2, 1],
      opacity: [0.8, 1, 0.6, 1, 0.8],
      rotate: [0, 90, 180, 270, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size / 2 + 40 }} // Semi-circle height + space for content
    >
      {/* SVG Progress Bar */}
      <svg
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
        className="overflow-visible"
      >
        {/* Background/Trail Arc */}
        <path
          d={trailPath}
          fill="none"
          stroke={trailColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <motion.path
          d={progressPath}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Gradient definition for more visual appeal */}
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={arcColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={arcColor} stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* Enhanced Progress Arc with Gradient */}
        <motion.path
          d={progressPath}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth + 2}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          opacity={0.3}
        />

        {/* Sparkling Spark */}
        <AnimatePresence>
          {isDecreasing && sparkPosition && clampedPercentage > 0 && (
            <motion.g
              variants={sparkVariants}
              initial="idle"
              animate="sparkling"
              exit="idle"
            >
              {/* Main spark */}
              <circle
                cx={sparkPosition.x}
                cy={sparkPosition.y}
                r={4}
                fill={arcColor}
                className="drop-shadow-md"
              />

              {/* Spark rays */}
              <g
                transform={`translate(${sparkPosition.x}, ${sparkPosition.y})`}
              >
                <motion.line
                  x1={-6}
                  y1={0}
                  x2={6}
                  y2={0}
                  stroke={arcColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.line
                  x1={0}
                  y1={-6}
                  x2={0}
                  y2={6}
                  stroke={arcColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.line
                  x1={-4}
                  y1={-4}
                  x2={4}
                  y2={4}
                  stroke={arcColor}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
                <motion.line
                  x1={4}
                  y1={-4}
                  x2={-4}
                  y2={4}
                  stroke={arcColor}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.6 }}
                />
              </g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Central Content Area */}
      <div
        className="absolute inset-x-0 flex flex-col items-center justify-center"
        style={{
          top: size / 4,
          height: size / 2,
        }}
      >
        {/* Percentage Display */}
        <motion.div
          className="text-2xl font-bold mb-2"
          style={{ color: arcColor }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          key={clampedPercentage} // Re-animate when percentage changes
        >
          {Math.round(clampedPercentage)}%
        </motion.div>

        {/* Middle Content */}
        <AnimatePresence mode="wait">
          {middleContent && (
            <motion.div
              className="flex items-center justify-center text-center px-4 max-w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {middleContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WavelengthProgressBar;
