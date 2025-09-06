import { motion } from "framer-motion";

export function WavelengthRing({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const circumference = 2 * Math.PI * 56; // r=56
  const offset = circumference - (percent / 100) * circumference;
  const happy = percent >= 60;
  return (
    <div
      className={
        "relative flex items-center justify-center " + (className ?? "")
      }
    >
      <svg viewBox="0 0 140 140" className="size-36">
        <defs>
          <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={happy ? "#c026d3" : "#fb923c"} />
            <stop offset="100%" stopColor={happy ? "#4f46e5" : "#f43f5e"} />
          </linearGradient>
        </defs>
        <circle
          cx="70"
          cy="70"
          r="56"
          stroke="#e2e8f0"
          strokeWidth="12"
          fill="none"
        />
        <motion.circle
          cx="70"
          cy="70"
          r="56"
          stroke="url(#ring)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          initial={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
          }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black">{percent}%</div>
        <div className="text-xs text-slate-500">match</div>
      </div>
    </div>
  );
}
