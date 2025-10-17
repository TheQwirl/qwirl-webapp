import React, { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import UserBadge from "@/components/user-badge";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name?: string | null;
  username: string;
  avatar?: string | null;
};

type Responder = {
  user?: User | null;
};

interface BasePollOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  option: string;
  optionNumber: number;
}

interface DisplayVariantProps extends BasePollOptionProps {
  variant: "display";
  isSelected?: boolean;
  isMyChoice?: boolean;
}

interface SelectableVariantProps extends BasePollOptionProps {
  variant: "selectable";
  isSelected: boolean;
  isMyChoice?: boolean;
}

interface ResultsVariantProps extends BasePollOptionProps {
  variant: "results";
  isMyChoice: boolean;
  isOwnerChoice?: boolean;
  responders: Responder[];
  percentage?: number;
  userName?: string | null;
}

interface InteractiveVariantProps extends BasePollOptionProps {
  variant: "interactive";
  isSelected?: boolean;
  isOwnerChoice?: boolean;
  onSelect: () => void;
  disabled?: boolean;
  percentage?: number;
  showPercentage?: boolean;
  userName?: string | null;
}

export type PollOptionProps =
  | DisplayVariantProps
  | SelectableVariantProps
  | ResultsVariantProps
  | InteractiveVariantProps;

const PollOption = forwardRef<HTMLDivElement, PollOptionProps>((props, ref) => {
  const { option, optionNumber, variant, className } = props;

  const isSelected = "isSelected" in props ? props.isSelected : false;
  const isMyChoice = "isMyChoice" in props ? props.isMyChoice : false;
  const isOwnerChoice = "isOwnerChoice" in props ? props.isOwnerChoice : false;
  const onSelect = "onSelect" in props ? props.onSelect : undefined;
  const disabled = "disabled" in props ? props.disabled : false;
  const responders = "responders" in props ? props.responders : [];
  const percentage = "percentage" in props ? props.percentage : 0;
  const showPercentage =
    "showPercentage" in props ? props.showPercentage : false;
  const userName = "userName" in props ? props.userName : null;

  const isHighlighted = isSelected || isMyChoice;

  const getVariantStyles = () => {
    const baseStyles = {
      highlighted: "bg-primary/5 border-primary/20 shadow-sm",
      normal: "bg-muted/40",
      hover: "hover:bg-gray-100",
      disabled: "opacity-60 cursor-not-allowed",
    };

    switch (variant) {
      case "display":
        return cn(baseStyles.normal, {
          [baseStyles.highlighted]: isHighlighted,
        });
      case "selectable":
        return cn(baseStyles.normal, {
          [baseStyles.highlighted]: isHighlighted,
        });
      case "interactive":
        return cn(
          "cursor-pointer hover:shadow-md transition-all duration-200",
          baseStyles.normal,
          {
            [baseStyles.highlighted]: isHighlighted,
            [baseStyles.hover]: !isHighlighted && !disabled,
            [baseStyles.disabled]: disabled,
          }
        );
      case "results":
        return cn(baseStyles.normal, {
          [baseStyles.highlighted]: isMyChoice,
        });
      default:
        return baseStyles.normal;
    }
  };

  const baseClasses =
    "flex items-start gap-3 rounded-xl border px-3 py-2 relative overflow-hidden";
  const combinedClasses = cn(baseClasses, getVariantStyles(), className);

  const handleClick = () => {
    if (variant === "interactive" && onSelect && !disabled) {
      (onSelect as () => void)();
    }
  };

  const renderBadges = () => {
    const badges = [];

    if (isHighlighted) {
      badges.push(
        <Badge
          key="you"
          variant="outline"
          className="text-xs bg-background rounded-full flex items-center gap-1"
        >
          <div className="rounded-full h-3 w-3 bg-primary" />
          You
        </Badge>
      );
    }

    if (variant === "interactive" && isOwnerChoice && userName) {
      badges.push(
        <Badge
          key="owner"
          variant="outline"
          className="text-xs bg-background rounded-full flex items-center gap-1"
        >
          <div className="rounded-full h-3 w-3 bg-secondary" />
          {userName}
        </Badge>
      );
    }

    if (variant === "results" && isOwnerChoice && userName) {
      badges.push(
        <Badge
          key="owner"
          variant="outline"
          className="text-xs bg-background rounded-full flex items-center gap-1"
        >
          <div className="rounded-full h-3 w-3 bg-secondary" />
          {userName}
        </Badge>
      );
    }

    if (variant === "results" && responders.length > 0) {
      responders.forEach((responder) => {
        if (responder.user) {
          badges.push(
            <UserBadge
              key={responder.user.id}
              user={{
                name: responder.user.name ?? responder.user.username,
                avatar: responder.user.avatar ?? null,
              }}
            />
          );
        }
      });
    }

    return badges;
  };

  return (
    <div
      ref={ref}
      // {...rest}
      className={combinedClasses}
      onClick={handleClick}
      role={variant === "interactive" ? "button" : undefined}
      tabIndex={variant === "interactive" ? 0 : undefined}
      onKeyDown={(e) => {
        if (variant === "interactive" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Background percentage bar */}
      {(variant === "interactive" || variant === "results") &&
        (percentage ?? 0) >= 0 && (
          <div
            className="absolute inset-0 bg-primary/10 transition-all duration-500 ease-out"
            style={{
              width: `${percentage ?? 0}%`,
              borderTopRightRadius:
                (percentage ?? 0) === 100 ? "0.75rem" : "0.5rem",
              borderBottomRightRadius:
                (percentage ?? 0) === 100 ? "0.75rem" : "0.5rem",
            }}
          />
        )}

      {/* Option Number */}
      <div className="relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
        {optionNumber}
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span
          className={cn(
            "font-medium text-sm",

            isHighlighted && variant !== "interactive"
              ? "text-primary"
              : "text-foreground",

            variant === "display" && !isHighlighted && "text-muted-foreground"
          )}
        >
          {option}
        </span>

        {/* Badges and Percentage */}
        <div className="flex items-center gap-2">
          {renderBadges()}

          {/* Show percentage for interactive variant */}
          {variant === "interactive" &&
            showPercentage &&
            (percentage ?? 0) >= 0 && (
              <div className="flex items-center gap-1 text-sm font-semibold bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/20">
                <span className="text-primary">
                  {(percentage ?? 0).toFixed(0)}%
                </span>
              </div>
            )}

          {/* Show percentage for results variant */}
          {variant === "results" && (percentage ?? 0) >= 0 && (
            <div className="flex items-center gap-1 text-sm font-semibold bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/20">
              <span className="text-primary">
                {(percentage ?? 0).toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PollOption.displayName = "PollOption";

interface PollOptionLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  optionNumber: number;
  showBadges?: boolean;
  showPercentage?: boolean;
}

const PollOptionLoading = forwardRef<HTMLDivElement, PollOptionLoadingProps>(
  (
    {
      optionNumber,
      showBadges = false,
      showPercentage = false,
      className,
      // ...rest
    },
    ref
  ) => {
    const baseClasses =
      "flex items-start gap-3 rounded-xl border px-3 py-2 relative overflow-hidden bg-muted/40";
    const combinedClasses = cn(baseClasses, className);

    return (
      <div ref={ref} className={combinedClasses}>
        {/* Option Number */}
        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
          {optionNumber}
        </div>

        {/* Content Area */}
        <div className="relative flex items-center justify-between w-full">
          {/* Option Text Skeleton */}
          <Skeleton className="h-4 w-24 rounded" />

          {/* Badges and Percentage Area */}
          <div className="flex items-center gap-2">
            {showBadges && (
              <>
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </>
            )}

            {showPercentage && <Skeleton className="h-4 w-10 rounded" />}
          </div>
        </div>
      </div>
    );
  }
);

PollOptionLoading.displayName = "PollOptionLoading";

export default PollOption;
export { PollOptionLoading };
