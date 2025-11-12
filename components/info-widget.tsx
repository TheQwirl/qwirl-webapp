// components/ui/info-widget.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInfoAlert } from "./info-alert-provider";

const infoWidgetVariants = cva(
  "absolute flex items-center justify-center rounded-full z-10 transition-colors bg-accent/50 text-accent-foreground backdrop-blur-sm",
  {
    variants: {
      position: {
        topLeft: "top-2 left-2 sm:top-2 sm:left-2",
        topRight: "top-2 right-2 sm:top-2 sm:right-2",
        bottomLeft: "bottom-2 left-2 sm:bottom-2 sm:left-2",
        bottomRight: "bottom-2 right-2 sm:bottom-2 sm:right-2",
      },
      size: {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      position: "topRight",
      size: "md",
    },
  }
);

const iconVariants = cva("", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface InfoWidgetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infoWidgetVariants> {
  variant?: "hover" | "click";
  infoTitle: React.ReactNode;
  infoDescription: React.ReactNode;
  icon?: React.ElementType;
}

const InfoWidget = React.forwardRef<HTMLDivElement, InfoWidgetProps>(
  (
    {
      className,
      position,
      size,
      variant,
      infoTitle,
      infoDescription,
      icon: Icon = Info,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const { showInfoAlert } = useInfoAlert();
    const effectiveVariant = variant || (isMobile ? "click" : "hover");

    const widgetClasses = cn(infoWidgetVariants({ position, size }), className);
    const iconSizeClass = iconVariants({ size });

    const handleClick = () => {
      showInfoAlert({ title: infoTitle, description: infoDescription });
    };

    if (effectiveVariant === "click") {
      return (
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-label="More information"
          onClick={handleClick}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleClick()
          }
          className={cn(widgetClasses, "cursor-pointer")}
          {...props}
        >
          <Icon className={cn(iconSizeClass)} />
        </div>
      );
    }

    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div ref={ref} className={widgetClasses} {...props}>
            <Icon className={cn(iconSizeClass)} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs p-1">
            <p className="font-semibold">{infoTitle}</p>
            <p className="text-sm">{infoDescription}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }
);
InfoWidget.displayName = "InfoWidget";

export { InfoWidget, infoWidgetVariants };
