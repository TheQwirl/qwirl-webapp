"use client";

import { motion, useTransform, animate, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

interface WavelengthBlobProps {
  percent: number;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
  className?: string;
}

// Generate sine wave path with dynamic properties based on wavelength score
const generateSineWavePath = (
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  phase: number = 0
): string => {
  const points: string[] = [];
  const steps = width * 2; // More points for smoother curves

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      height / 2 +
      Math.sin((i / steps) * frequency * Math.PI * 2 + phase) * amplitude;

    if (i === 0) {
      points.push(`M ${x} ${y}`);
    } else {
      points.push(`L ${x} ${y}`);
    }
  }

  return points.join(" ");
};

export const WavelengthBlob = ({
  percent,
  size = "md",
  rounded = false,
  className,
}: WavelengthBlobProps) => {
  const percentM = useMotionValue(percent);
  const ref = useRef<HTMLParagraphElement>(null);

  // Dynamic wave properties based on wavelength score
  const waveProperties = useMemo(() => {
    const normalizedPercent = Math.max(0, Math.min(100, percent));

    // Amplitude: Low scores = flat wave, high scores = dramatic wave
    const amplitude = (normalizedPercent / 100) * 25 + 5; // 5-30 range

    // Frequency: Low scores = slow/sparse, high scores = fast/dense
    const frequency = (normalizedPercent / 100) * 3 + 0.5; // 0.5-3.5 range

    // Animation speed: Low scores = slow, high scores = fast
    const animationSpeed = (normalizedPercent / 100) * 2 + 0.5; // 0.5-2.5 range

    // Turbulence: High for low scores, none for high scores
    const turbulence = Math.max(0, (50 - normalizedPercent) / 50) * 0.02; // 0-0.02 range

    return { amplitude, frequency, animationSpeed, turbulence };
  }, [percent]);

  // Dynamic color based on wavelength ranges - subtle, connection-focused colors
  const waveColor = useTransform(
    percentM,
    [0, 30, 31, 70, 71, 100],
    [
      "hsl(210, 15%, 60%)", // Low: Neutral cool gray - distant
      "hsl(200, 25%, 65%)", // Low-mid: Soft blue-gray - getting acquainted
      "hsl(180, 35%, 55%)", // Mid: Gentle teal - building connection
      "hsl(160, 40%, 50%)", // Mid-high: Soft sage green - good harmony
      "hsl(140, 35%, 55%)", // High: Warm sage - strong connection
      "hsl(120, 30%, 60%)", // Very high: Gentle green - deep understanding
    ]
  );

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case "sm":
        return {
          width: 120,
          height: 60,
          textSize: "text-lg",
          wrapper: rounded ? "w-20 h-20" : "w-32 h-20",
          strokeWidth: 2,
        };
      case "lg":
        return {
          width: 300,
          height: 150,
          textSize: "text-5xl",
          wrapper: rounded ? "w-48 h-48" : "w-80 h-48",
          strokeWidth: 4,
        };
      default: // md
        return {
          width: 200,
          height: 100,
          textSize: "text-3xl",
          wrapper: rounded ? "w-32 h-32" : "w-56 h-32",
          strokeWidth: 3,
        };
    }
  }, [size, rounded]);

  // Animate percentage counter
  useEffect(() => {
    const controls = animate(percentM, percent, {
      duration: 1.5,
      ease: "easeInOut",
      onUpdate: (latest: number) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(latest)}%`;
        }
      },
    });
    return controls.stop;
  }, [percent, percentM]);

  const containerShape = rounded ? "rounded-full" : "rounded-2xl";
  const textBgShape = rounded ? "rounded-full" : "rounded-xl";

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100",
        containerShape,
        sizeConfig.wrapper,
        className
      )}
    >
      {/* Sine Wave Background */}
      <div className="absolute inset-0">
        <motion.svg
          width={sizeConfig.width}
          height={sizeConfig.height}
          viewBox={`0 0 ${sizeConfig.width} ${sizeConfig.height}`}
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            {/* Turbulence filter for low wavelength scores */}
            <filter id={`turbulence-${size}`}>
              <motion.feTurbulence
                baseFrequency={waveProperties.turbulence}
                numOctaves="2"
                result="turbulence"
                animate={{
                  baseFrequency: waveProperties.turbulence,
                }}
                transition={{ duration: 0.8 }}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="2"
              />
            </filter>

            {/* Gradient for the wave */}
            <linearGradient
              id={`waveGradient-${size}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <motion.stop
                offset="0%"
                stopColor={waveColor}
                stopOpacity="0.6"
              />
              <motion.stop
                offset="50%"
                stopColor={waveColor}
                stopOpacity="0.8"
              />
              <motion.stop
                offset="100%"
                stopColor={waveColor}
                stopOpacity="0.6"
              />
            </linearGradient>
          </defs>

          {/* Background wave (lighter) */}
          <motion.path
            stroke={`url(#waveGradient-${size})`}
            strokeWidth={sizeConfig.strokeWidth + 1}
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
            filter={
              waveProperties.turbulence > 0.005
                ? `url(#turbulence-${size})`
                : undefined
            }
            animate={{
              d: [
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.7,
                  waveProperties.frequency,
                  0
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.7,
                  waveProperties.frequency,
                  Math.PI
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.7,
                  waveProperties.frequency,
                  Math.PI * 2
                ),
              ],
            }}
            transition={{
              duration: 3 / waveProperties.animationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Main wave */}
          <motion.path
            stroke={waveColor}
            strokeWidth={sizeConfig.strokeWidth}
            fill="none"
            strokeLinecap="round"
            opacity="0.8"
            filter={
              waveProperties.turbulence > 0.005
                ? `url(#turbulence-${size})`
                : undefined
            }
            animate={{
              d: [
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude,
                  waveProperties.frequency,
                  0
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude,
                  waveProperties.frequency,
                  Math.PI
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude,
                  waveProperties.frequency,
                  Math.PI * 2
                ),
              ],
            }}
            transition={{
              duration: 2 / waveProperties.animationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Accent wave (faster, thinner) */}
          <motion.path
            stroke={waveColor}
            strokeWidth={Math.max(1, sizeConfig.strokeWidth - 1)}
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
            animate={{
              d: [
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.5,
                  waveProperties.frequency * 1.5,
                  Math.PI / 4
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.5,
                  waveProperties.frequency * 1.5,
                  Math.PI * 1.25
                ),
                generateSineWavePath(
                  sizeConfig.width,
                  sizeConfig.height,
                  waveProperties.amplitude * 0.5,
                  waveProperties.frequency * 1.5,
                  Math.PI * 2.25
                ),
              ],
            }}
            transition={{
              duration: 1.5 / waveProperties.animationSpeed,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.svg>
      </div>

      {/* Text Container with Background */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          className={cn(
            "px-4 py-2 background-glass backdrop-blur-sm border border-white/50 shadow-sm",
            textBgShape,
            rounded && "p-3"
          )}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.p
            ref={ref}
            className={cn(
              "font-bold text-center leading-none",
              sizeConfig.textSize
            )}
            style={{ color: waveColor }}
          >
            {`${Math.round(percent)}%`}
          </motion.p>
          {!rounded && (
            <p className="text-xs text-slate-500 text-center mt-1 font-medium">
              wavelength
            </p>
          )}
        </motion.div>
      </div>

      {/* Subtle glow effect for high wavelengths */}
      {percent > 70 && (
        <motion.div
          className={cn("absolute inset-0 pointer-events-none", containerShape)}
          style={{
            background: `radial-gradient(circle at center, ${waveColor} 0%, transparent 70%)`,
            opacity: 0.1,
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
};
