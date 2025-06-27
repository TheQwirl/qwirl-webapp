"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface EmptyProps {
  title?: string;
  description?: string;
  imageSrc?: string; // default to /empty-data.svg
  containerClassName?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  title = "Nothing here yet",
  description = "There's no data to display right now.",
  imageSrc = "/assets//empty-data.svg",
  containerClassName,
  imageClassName,
  children,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        containerClassName
      )}
    >
      <Image
        src={imageSrc}
        alt="Empty state"
        width={160}
        height={160}
        className={clsx("w-40 h-40 mb-2", imageClassName)}
        priority
      />
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default Empty;
