"use client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import clsx from "clsx";
import { useSmartBackNavigation } from "@/hooks/use-smart-back-navigation";

export interface BackNavigationConfig {
  title?: string;
  subtitle?: string;
  fallbackPath?: string;
  customBackAction?: () => void;
  rightContent?: ReactNode;
  className?: string;
  hideBackButton?: boolean;
  showBorder?: boolean;
}

interface BackNavigationProps {
  title?: string;
  subtitle?: string;
  fallbackPath?: string;
  customBackAction?: () => void;
  rightContent?: ReactNode;
  className?: string;
  hideBackButton?: boolean;
  showBorder?: boolean;
}

export const BackNavigation = ({
  title,
  subtitle,
  fallbackPath,
  customBackAction,
  rightContent,
  className,
  hideBackButton = false,
  showBorder = true,
}: BackNavigationProps) => {
  const { canGoBack, goBack } = useSmartBackNavigation();

  const handleBack = () => {
    if (customBackAction) {
      customBackAction();
    } else {
      goBack(fallbackPath);
    }
  };

  const shouldShowBackButton =
    !hideBackButton && (canGoBack || customBackAction);

  return (
    <div
      className={clsx(
        "sticky top-0 z-50 border-l border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        showBorder && "border-b",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {shouldShowBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 h-auto shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          {(title || subtitle) && (
            <div className="min-w-0 flex-1">
              {title && (
                <h1 className="font-semibold text-base leading-tight truncate">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {rightContent && <div className="shrink-0 ml-3">{rightContent}</div>}
      </div>
    </div>
  );
};
