"use client";

import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

export type QwirlLogoIconProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
};

export function QwirlLogoIcon({
  className,
  style,
  size = 20,
}: QwirlLogoIconProps) {
  return (
    <span
      className={cn("relative inline-flex", className)}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      aria-hidden="true"
    >
      <Image
        src="/logos/logo-icon-dark-transparent.svg"
        alt="Qwirl logo icon"
        fill
        sizes="100%"
        className="object-contain"
        priority={false}
      />
    </span>
  );
}
