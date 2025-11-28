import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BaseConnectionCtaCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  icon: LucideIcon;
  badgeText?: string;
};

type ActionHrefProps = BaseConnectionCtaCardProps & {
  actionHref: string;
  onClick?: never;
};

type ActionClickProps = BaseConnectionCtaCardProps & {
  onClick: () => void;
  actionHref?: never;
};

type ConnectionCtaCardProps = ActionHrefProps | ActionClickProps;

const ConnectionCtaCard: React.FC<ConnectionCtaCardProps> = ({
  title,
  description,
  actionLabel,
  icon: Icon,
  badgeText,
  actionHref,
  onClick,
}) => {
  return (
    <Card className="h-full border-dashed bg-muted/20 flex flex-col">
      <CardHeader className="space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {badgeText && (
          <Badge variant="secondary" className="w-fit text-xs">
            {badgeText}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="pt-0">
        {actionHref ? (
          <Button asChild className="w-full" variant="secondary">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button className="w-full" variant="secondary" onClick={onClick}>
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConnectionCtaCard;
