import React from "react";
import clsx from "clsx";

export type ViewTypeOption = {
  value: string;
  icon: React.ReactNode;
  label: string;
};

interface ViewToggleProps {
  options: ViewTypeOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center space-x-2 bg-accent p-1 rounded-md text-muted-foreground",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            "p-1 rounded-md",
            value === option.value
              ? "bg-background text-primary"
              : "text-muted-foreground hover:bg-accent"
          )}
          aria-label={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
};
