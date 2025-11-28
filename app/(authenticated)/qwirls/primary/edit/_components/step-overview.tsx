"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  usePrimaryQwirlEdit,
  StepCardState,
} from "./primary-qwirl-edit-context";
import { StepStatusType } from "./step-config";

const STATUS_CONFIG: Record<
  StepStatusType,
  { badgeClass: string; icon?: React.ReactNode }
> = {
  complete: {
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-primary/30 bg-primary/5 text-primary dark:border-primary/40 dark:bg-primary/10 dark:text-primary-foreground",
  },
  "in-progress": {
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-secondary/30 bg-secondary/5 text-secondary dark:border-secondary/40 dark:bg-secondary/10 dark:text-secondary-foreground",
  },
  "not-started": {
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-border/50 bg-muted/10 text-muted-foreground",
  },
  optional: {
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-primary/30 bg-primary/5 text-primary",
  },
  loading: {
    badgeClass:
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-border/40 bg-muted/20 text-muted-foreground",
  },
};

export const StepOverview = () => {
  const { stepCards } = usePrimaryQwirlEdit();

  return (
    <section aria-labelledby="qwirl-editor-intro" className="space-y-6">
      <div className="w-full bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-6">
        <div className="mb-6 space-y-3">
          <div className="inline-flex items-center gap-2 text-primary">
            <span className="text-xs font-semibold uppercase tracking-wide">
              Primary qwirl
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Follow the steps below to set up your Qwirl, add some personal
            touches, and create a question set that feels like you.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          {stepCards.map((card) => (
            <StepCard key={card.key} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ card }: { card: StepCardState }) => {
  const statusVisual = STATUS_CONFIG[card.statusType];

  return (
    <Link
      href={card.href}
      className="group relative flex h-full w-full flex-col rounded-xl border bg-background p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge
          variant="secondary"
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
        >
          {card.stepLabel}
        </Badge>
        <span className={statusVisual?.badgeClass}>{card.statusLabel}</span>
      </div>
      <p className="flex items-start gap-2 text-sm font-semibold text-foreground">
        {card.title}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
      <p className="mt-3 text-xs text-muted-foreground">{card.statusDetail}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:translate-x-0.5">
        Jump to step
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
};
