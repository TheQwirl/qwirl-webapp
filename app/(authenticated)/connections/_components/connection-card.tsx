import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Infinity,
  MessageSquareText,
  UserCheck2,
} from "lucide-react";

import { UserAvatar } from "@/components/user-avatar";
import WavelengthIndicator from "@/components/wavelength-indicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { components } from "@/lib/api/v1-client-side";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

interface ConnectionCardProps {
  connection: components["schemas"]["UserFollowerResponse"];
  variant: "in-sync" | "you-reached-out" | "they-reached-out";
}

const VARIANT_META: Record<
  ConnectionCardProps["variant"],
  {
    label: string;
    highlight: string;
    badgeClassName: string;
    icon: React.ElementType;
  }
> = {
  "in-sync": {
    label: "In Sync",
    highlight: "You both answered each other's qwirls.",
    badgeClassName:
      "border-sidebar-primary/40 bg-sidebar-primary/15 hover:bg-sidebar-primary/15 text-sidebar-primary",
    icon: Infinity,
  },
  "they-reached-out": {
    label: "They Reached Out",
    highlight: "Reply to their qwirl to sync wavelengths and unlock insights.",
    badgeClassName:
      "border-secondary/40 bg-secondary/25 hover:bg-secondary/25 text-secondary-foreground",
    icon: Activity,
  },
  "you-reached-out": {
    label: "You Reached Out",
    highlight: "You're awaiting a response to complete the sync.",
    badgeClassName:
      "border-primary/30 bg-primary/20 hover:bg-primary/20 text-primary",
    icon: UserCheck2,
  },
};

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  variant,
}) => {
  const connectionName = connection?.name ?? connection?.username;
  const meta = VARIANT_META[variant];
  const qwirlHref = connection?.username
    ? `/qwirl/${connection.username}`
    : undefined;
  const responderAnswersHref = connection?.id
    ? `/qwirls/primary/responses?responder=${connection.id}`
    : undefined;
  const VariantIcon = meta.icon;

  const renderActionButton = ({
    label,
    href,
    icon,
    iconPlacement = "left",
    variant: buttonVariant = "default",
  }: {
    label: string;
    href?: string;
    icon: React.ElementType;
    iconPlacement?: "left" | "right";
    variant?: "default" | "outline" | "secondary";
  }) => {
    const content = (
      <Button
        iconPlacement={iconPlacement}
        icon={icon}
        className="w-full"
        variant={buttonVariant}
        disabled={!href}
        {...(href ? { asChild: true } : {})}
      >
        {href ? <Link href={href}>{label}</Link> : label}
      </Button>
    );

    return content;
  };

  return (
    <Card className="h-full flex flex-col border-border/70">
      <CardHeader className="flex gap-4 pb-2 flex-row items-start justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <UserAvatar
            size="lg"
            ringed
            image={connection?.avatar ?? undefined}
            name={connectionName ?? undefined}
          />
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg leading-tight">
              {connectionName ?? "Unnamed Explorer"}
            </CardTitle>
            <Badge
              className={clsx(
                meta.badgeClassName,
                "flex items-center gap-1 w-fit"
              )}
            >
              <VariantIcon className="h-4 w-4" />
              {meta.label}
            </Badge>
          </div>
        </div>
        <WavelengthIndicator
          wavelength={connection.wavelength}
          variant="badge"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm ">{meta.highlight}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto w-full">
        {variant === "in-sync" ? (
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {renderActionButton({
              label: "View answers",
              href: responderAnswersHref,
              icon: MessageSquareText,
              variant: "secondary",
            })}
            {renderActionButton({
              label: "Visit their qwirl",
              href: qwirlHref,
              icon: ArrowUpRight,
              iconPlacement: "right",
            })}
          </div>
        ) : variant === "they-reached-out" ? (
          <div className="w-full">
            {renderActionButton({
              label: "View their answers",
              href: responderAnswersHref,
              icon: MessageSquareText,
            })}
          </div>
        ) : (
          <div className="w-full">
            {renderActionButton({
              label: "View their qwirl",
              href: qwirlHref,
              icon: ArrowUpRight,
              iconPlacement: "right",
            })}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export const ConnectionCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col border-border/70">
      <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full items-start gap-3 sm:items-center">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <div className="flex w-full justify-start sm:w-auto sm:justify-end">
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="mt-auto w-full">
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ConnectionCard;
