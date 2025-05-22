import React from "react";
import { PiWaveSine } from "react-icons/pi";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface WavelengthIndicatorProps {
  wavelength: number;
}

const WavelengthIndicator: React.FC<WavelengthIndicatorProps> = ({
  wavelength,
}) => {
  const normalizedWavelength = Math.max(1, Math.min(100, wavelength));

  const lightness = 80 - (normalizedWavelength - 1) * 0.6; // Adjust multiplier for desired intensity

  // Construct the HSL color string
  const backgroundColor = `hsl(5, 100%, ${lightness}%)`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative inline-flex cursor-pointer">
            <motion.div
              className="absolute inset-0 rounded-full bg-[hsla(12,100%,82%,0.3)]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="relative flex items-center gap-4 pl-2 pr-6 py-1 justify-between  rounded-full"
              style={{ backgroundColor }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="rounded-full p-2 border border-foreground bg-background">
                <PiWaveSine className="text-xl text-[hsla(12,100%,20%,1)]" />
              </div>
              <div className="font-bold text-lg text-[hsla(12,100%,20%,1)]">
                {wavelength}
              </div>
            </motion.div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Wavelength: {wavelength}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WavelengthIndicator;
