import React, { forwardRef, memo, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import UserBadge from "@/components/user-badge";
import { cn } from "@/lib/utils";
import { HeartPulseIcon } from "lucide-react";

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
  // isMyChoice?: boolean;
}

interface ResultsVariantProps extends BasePollOptionProps {
  variant: "results";
  isMyChoice: boolean;
  isOwnerChoice?: boolean;
  responders?: Responder[];
  percentage?: number;
  userName?: string | null;
}

interface InteractiveVariantProps extends BasePollOptionProps {
  variant: "interactive";
  onSelect: () => void;
  disabled?: boolean;
  userName?: string | null;
}

export type PollOptionProps =
  | DisplayVariantProps
  | SelectableVariantProps
  | ResultsVariantProps
  | InteractiveVariantProps;

type VariantOptionals = {
  isSelected?: boolean;
  isMyChoice?: boolean;
  isOwnerChoice?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  responders?: Responder[];
  percentage?: number;
  showPercentage?: boolean;
  userName?: string | null;
};

const clampPercentage = (value?: number): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return Math.min(100, Math.max(0, value));
};

const baseContainerClasses =
  "flex items-start gap-3 rounded-xl border px-3 py-2 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

const variantClassNames = {
  display: ({ isHighlighted }: { isHighlighted: boolean }) =>
    cn("bg-muted/40", {
      "bg-primary/5 border-primary/20 shadow-sm": isHighlighted,
    }),
  selectable: ({ isHighlighted }: { isHighlighted: boolean }) =>
    cn("bg-muted/40", {
      "bg-primary/5 border-primary/20 shadow-sm": isHighlighted,
    }),
  interactive: ({
    isHighlighted,
    disabled,
  }: {
    isHighlighted: boolean;
    disabled: boolean;
  }) =>
    cn(
      "cursor-pointer hover:shadow-md transition-all duration-200 bg-muted/40",
      {
        "bg-primary/5 border-primary/20 shadow-sm": isHighlighted,
        "hover:bg-gray-100": !isHighlighted && !disabled,
        "opacity-60 cursor-not-allowed": disabled,
      }
    ),
  results: ({ isHighlighted }: { isHighlighted: boolean }) =>
    cn("bg-muted/40", {
      "bg-primary/5 border-primary/20 shadow-sm": isHighlighted,
    }),
};

const getVariantClassName = (
  variant: PollOptionProps["variant"],
  options: { isHighlighted: boolean; disabled: boolean }
) => {
  const builder = variantClassNames[variant];
  if (!builder) return "bg-muted/40";
  return builder(options);
};

const YouBadge = () => (
  <Badge
    variant="outline"
    className="text-xs bg-background rounded-full flex items-center gap-1"
  >
    <div className="rounded-full h-3 w-3 bg-primary" />
    You
  </Badge>
);

const OwnerBadge = ({ userName }: { userName: string }) => (
  <Badge
    variant="outline"
    className="text-xs bg-background rounded-full flex items-center gap-1"
  >
    <div className="rounded-full h-3 w-3 bg-secondary" />
    {userName}
  </Badge>
);

const BothBadge = () => (
  <Badge variant="default" className="flex items-center gap-0.5">
    <HeartPulseIcon className="w-3 h-3 mr-0.5" />
    Both
  </Badge>
);

const ResponderBadges = memo(({ responders }: { responders: Responder[] }) => (
  <>
    {responders.map((responder) => {
      if (!responder.user) return null;
      return (
        <UserBadge
          key={responder.user.id}
          user={{
            name: responder.user.name ?? responder.user.username,
            avatar: responder.user.avatar ?? null,
          }}
        />
      );
    })}
  </>
));
ResponderBadges.displayName = "ResponderBadges";

const PercentagePill = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1 text-sm font-semibold bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-primary/20">
    <span className="text-primary">{value.toFixed(0)}%</span>
  </div>
);

const PollOptionBase = forwardRef<HTMLDivElement, PollOptionProps>(
  (rawProps, ref) => {
    const props = rawProps as PollOptionProps &
      VariantOptionals &
      React.HTMLAttributes<HTMLDivElement>;

    const {
      option,
      optionNumber,
      variant,
      className,
      isSelected,
      isMyChoice,
      isOwnerChoice,
      onSelect,
      disabled,
      responders,
      percentage,
      showPercentage,
      userName,
      ...htmlAttributes
    } = props;

    const {
      onClick: userOnClick,
      onKeyDown: userOnKeyDown,
      tabIndex: userTabIndex,
      role: userRole,
      ["aria-pressed"]: userAriaPressed,
      ["aria-disabled"]: userAriaDisabled,
      ...restDomProps
    } = htmlAttributes;

    const isInteractive = variant === "interactive";
    const isResults = variant === "results";
    const highlightedSource =
      variant === "results" ? isMyChoice : isSelected || isMyChoice;
    const isHighlighted = Boolean(highlightedSource);
    const normalizedDisabled = isInteractive ? Boolean(disabled) : false;

    const safePercentage = useMemo(
      () =>
        clampPercentage(isInteractive || isResults ? percentage : undefined),
      [isInteractive, isResults, percentage]
    );

    const variantClassName = useMemo(
      () =>
        getVariantClassName(variant, {
          isHighlighted,
          disabled: normalizedDisabled,
        }),
      [variant, isHighlighted, normalizedDisabled]
    );

    const combinedClasses = useMemo(
      () => cn(baseContainerClasses, variantClassName, className),
      [variantClassName, className]
    );

    const responderBadges = useMemo(
      () => (isResults && responders ? responders : []),
      [isResults, responders]
    );

    const hasResponderOverlap = Boolean(
      isResults &&
        isHighlighted &&
        (responderBadges.length > 0 || isOwnerChoice)
    );

    const showOwnerBadge = Boolean(
      (isInteractive || isResults) &&
        isOwnerChoice &&
        userName &&
        !hasResponderOverlap
    );

    const percentageBarStyle = useMemo(() => {
      if (safePercentage === null) return undefined;
      const radius = safePercentage === 100 ? "0.75rem" : "0.5rem";
      return {
        width: `${safePercentage}%`,
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
      } as React.CSSProperties;
    }, [safePercentage]);

    const triggerSelect = useCallback(() => {
      if (!isInteractive || normalizedDisabled || !onSelect) return;
      onSelect();
    }, [isInteractive, normalizedDisabled, onSelect]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (isInteractive && !normalizedDisabled) {
          triggerSelect();
        }
        userOnClick?.(event);
      },
      [isInteractive, normalizedDisabled, triggerSelect, userOnClick]
    );

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          isInteractive &&
          !normalizedDisabled &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          triggerSelect();
        }
        userOnKeyDown?.(event);
      },
      [isInteractive, normalizedDisabled, triggerSelect, userOnKeyDown]
    );

    const showInteractivePercentage = Boolean(
      isInteractive && showPercentage && safePercentage !== null
    );
    const showResultsPercentage = Boolean(isResults && safePercentage !== null);

    return (
      <div
        ref={ref}
        {...restDomProps}
        className={combinedClasses}
        role={isInteractive ? "button" : userRole}
        tabIndex={isInteractive ? userTabIndex ?? 0 : userTabIndex}
        aria-pressed={
          isInteractive ? !!isSelected : userAriaPressed ?? undefined
        }
        aria-disabled={
          isInteractive ? normalizedDisabled : userAriaDisabled ?? undefined
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {(isInteractive || isResults) && safePercentage !== null && (
          <div
            className="absolute inset-0 bg-primary/10 transition-all duration-500 ease-out"
            style={percentageBarStyle}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
          {optionNumber}
        </div>

        <div className="relative z-10 flex items-center gap-1 justify-between w-full">
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

          <div className="flex items-center gap-2">
            {hasResponderOverlap ? (
              <BothBadge />
            ) : (
              isHighlighted && <YouBadge />
            )}
            {showOwnerBadge && userName && <OwnerBadge userName={userName} />}
            {isResults &&
              responderBadges.length > 0 &&
              !hasResponderOverlap && (
                <ResponderBadges responders={responderBadges} />
              )}

            {showInteractivePercentage && safePercentage !== null && (
              <PercentagePill value={safePercentage} />
            )}

            {showResultsPercentage && safePercentage !== null && (
              <PercentagePill value={safePercentage} />
            )}
          </div>
        </div>
      </div>
    );
  }
);
PollOptionBase.displayName = "PollOptionBase";

const PollOption = memo(PollOptionBase);
PollOption.displayName = "PollOption";

interface PollOptionLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  optionNumber: number;
  showBadges?: boolean;
  showPercentage?: boolean;
}

const PollOptionLoadingBase = forwardRef<
  HTMLDivElement,
  PollOptionLoadingProps
>(
  (
    { optionNumber, showBadges = false, showPercentage = false, className },
    ref
  ) => {
    const baseClasses =
      "flex items-start gap-3 rounded-xl border px-3 py-2 relative overflow-hidden bg-muted/40";
    const combinedClasses = cn(baseClasses, className);

    return (
      <div ref={ref} className={combinedClasses}>
        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
          {optionNumber}
        </div>

        <div className="relative flex items-center justify-between w-full">
          <Skeleton className="h-4 w-24 rounded" />

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
PollOptionLoadingBase.displayName = "PollOptionLoadingBase";

const PollOptionLoading = memo(PollOptionLoadingBase);
PollOptionLoading.displayName = "PollOptionLoading";

export default PollOption;
export { PollOptionLoading };
