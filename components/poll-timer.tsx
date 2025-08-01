import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

interface PollTimerProps {
  duration: number;
  createdAt: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  className?: string;
  onExpire?: () => void;
  expiredMessage?: string;
  warningThreshold?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "warning" | "success" | "danger";
}

export const timerContainer = cva(
  "flex items-center rounded-md border transition-all duration-200 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border",
        warning:
          "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
        success:
          "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
        danger:
          "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        expired: "bg-muted text-muted-foreground border-muted",
        lowTime: "bg-destructive/10 text-destructive border-destructive/20",
      },
      size: {
        sm: "px-2 py-1 text-xs gap-1 ",
        md: "px-6 py-3 text-base gap-1.5",
        lg: "px-8 py-2.5 text-lg gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const timerText = cva("tabular-nums", {
  variants: {
    variant: {
      default: "text-foreground",
      warning: "text-yellow-700 dark:text-yellow-300",
      success: "text-green-700 dark:text-green-300",
      danger: "text-red-700 dark:text-red-300",
      expired: "text-muted-foreground",
      lowTime: "text-destructive",
    },
    size: {
      sm: "text-xs font-semibold",
      md: "text-sm font-semibold",
      lg: "text-lg font-bold",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export const timerUnit = cva("", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
});

export const timerIcon = cva("", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
});

const PollTimer: React.FC<PollTimerProps> = ({
  duration,
  createdAt,
  showDays = true,
  showHours = true,
  showMinutes = true,
  className = "",
  onExpire,
  expiredMessage = "Poll ended",
  warningThreshold = 300,
  size = "md",
  variant = "default",
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);
  const timerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timerRef, {
    once: false,
    margin: "0px 0px -100px 0px",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expiryTime = createdTime + duration * 1000;
      const currentTime = Date.now();
      return Math.max(0, expiryTime - currentTime) / 1000;
    };

    const updateTimer = () => {
      const remaining = Math.floor(calculateTimeLeft());
      setTimeLeft(remaining);
      if (remaining === 0 && !hasExpired) {
        setIsExpired(true);
        setHasExpired(true);
        onExpire?.();
      }
    };

    updateTimer();
    const remaining = calculateTimeLeft();
    if (remaining > 0) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [duration, createdAt, onExpire, hasExpired]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return { days, hours, minutes, seconds: secs };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const shouldShowDays = showDays && (days > 0 || duration >= 86400);
  const shouldShowHours =
    showHours && (hours > 0 || days > 0 || duration >= 3600);
  const shouldShowMinutes =
    showMinutes && (minutes > 0 || hours > 0 || days > 0 || duration >= 60);

  const effectiveVariant = isExpired
    ? "expired"
    : timeLeft <= warningThreshold
    ? "lowTime"
    : variant;

  const containerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const numberVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { y: 10, opacity: 0, transition: { duration: 0.1 } },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const renderTimeUnit = (value: number, unit: string, show: boolean) => {
    if (!show) return null;
    return (
      <div className="flex flex-col items-center bg-white p-1 rounded-md w-7">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            variants={numberVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={clsx("", timerText({ variant: effectiveVariant, size }))}
          >
            {value.toString().padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span
          className={clsx(
            "text-muted-foreground uppercase text-[7px] font-semibold leading-none",
            timerUnit({ size })
          )}
        >
          {unit}
        </span>
      </div>
    );
  };

  const renderSeparator = () => (
    <motion.span
      className=""
      animate={
        timeLeft <= warningThreshold && timeLeft > 0 && isInView
          ? { opacity: [0.6, 1, 0.6] }
          : {}
      }
      transition={{ duration: 1, repeat: Infinity }}
    >
      :
    </motion.span>
  );

  if (isExpired) {
    return (
      <motion.div
        ref={timerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={timerContainer({
          variant: effectiveVariant,
          size,
          className,
        })}
      >
        <CheckCircle className={timerIcon({ size })} />
        <span className={`${timerUnit({ size })} font-medium`}>
          {expiredMessage}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={timerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={timerContainer({ variant: effectiveVariant, size, className })}
    >
      <motion.div
        animate={
          timeLeft <= warningThreshold && isInView ? pulseVariants.pulse : {}
        }
      >
        {timeLeft <= warningThreshold ? (
          <AlertTriangle
            className={clsx("text-primary", timerIcon({ size }))}
          />
        ) : (
          <Clock className={`${timerIcon({ size })} text-primary`} />
        )}
      </motion.div>

      <motion.div className="flex items-center gap-[1.5px]">
        {renderTimeUnit(days, "days", shouldShowDays)}
        {shouldShowDays &&
          (shouldShowHours || shouldShowMinutes) &&
          renderSeparator()}
        {renderTimeUnit(hours, "hours", shouldShowHours)}
        {shouldShowHours && shouldShowMinutes && renderSeparator()}
        {renderTimeUnit(minutes, "min", shouldShowMinutes)}
        {shouldShowMinutes && renderSeparator()}
        {renderTimeUnit(seconds, "sec", true)}
      </motion.div>
    </motion.div>
  );
};

export default PollTimer;
