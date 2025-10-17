"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";

interface CollapsibleCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  isZeroPadding?: boolean;
}

const CollapsibleCard = ({
  title,
  icon,
  children,
  defaultOpen = true,
  className,
  isZeroPadding = false,
}: CollapsibleCardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card
      className={clsx("overflow-hidden", className, isZeroPadding && "p-0")}
    >
      <CardHeader
        className="cursor-pointer select-none flex items-center gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <CardTitle
          className={clsx(
            "flex w-full items-center gap-2 text-lg",
            isZeroPadding && "p-0"
          )}
        >
          {icon}
          {title}
          <motion.span
            initial={false}
            animate={{ rotate: open ? 90 : 0 }}
            className="ml-auto"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.span>
        </CardTitle>
      </CardHeader>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            <CardContent className={clsx(isZeroPadding && "p-0")}>
              {children}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleCard;
