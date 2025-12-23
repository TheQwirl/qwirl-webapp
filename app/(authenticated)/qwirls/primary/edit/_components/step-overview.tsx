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
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none border border-secondary/30 bg-secondary/50 text-secondary-foreground dark:border-secondary/40 dark:bg-secondary/10 dark:text-secondary-foreground",
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

  // Split cards into setup steps (first 2) and main action (last one)
  const setupCards = stepCards.slice(0, 2);
  const mainCard = stepCards[2];

  return (
    <section
      aria-labelledby="qwirl-editor-intro"
      className="space-y-6 p-6 lg:p-8"
    >
      {mainCard && <FeaturedStepCard card={mainCard} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {setupCards.map((card) => (
          <CompactStepCard key={card.key} card={card} />
        ))}
      </div>
    </section>
  );
};

// Compact cards for supporting setup (Cover + Socials)
const CompactStepCard = ({ card }: { card: StepCardState }) => {
  const statusVisual = STATUS_CONFIG[card.statusType];

  return (
    <Link
      href={card.href}
      className="group relative flex h-full w-full flex-col rounded-xl border border-border/60 bg-background p-4 text-left shadow-sm transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge
          variant="secondary"
          className="rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-semibold text-foreground"
        >
          {card.stepLabel}
        </Badge>
        <span className={statusVisual?.badgeClass}>{card.statusLabel}</span>
      </div>
      <p className="text-sm font-semibold text-foreground">{card.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
      <p className="mt-3 text-xs text-muted-foreground">{card.statusDetail}</p>
    </Link>
  );
};

// Featured card for the primary action (Questions)
const FeaturedStepCard = ({ card }: { card: StepCardState }) => {
  const statusVisual = STATUS_CONFIG[card.statusType];

  return (
    <Link
      href={card.href}
      className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background p-6 text-left shadow-lg shadow-primary/10 transition hover:border-primary/45 hover:shadow-xl hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] sm:p-8"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <Badge
          variant="secondary"
          className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary"
        >
          {card.stepLabel}
        </Badge>
        <span className={statusVisual?.badgeClass}>{card.statusLabel}</span>
      </div>

      {/* Title & Description */}
      <div className="mb-4 space-y-2">
        <h3
          id="qwirl-editor-intro"
          className="text-2xl font-bold text-foreground sm:text-3xl"
        >
          {card.title}
        </h3>
        <p className="text-sm text-muted-foreground sm:text-base">
          Questions define your voice. Add your own prompts or pull from curated
          sets to assemble a Qwirl that feels unmistakably you.
        </p>
      </div>

      {/* Status Detail */}
      <p className="mb-6 text-sm font-medium text-foreground/80">
        {card.statusDetail}
      </p>

      {/* CTA Button */}
      <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md transition group-hover:shadow-lg">
          {card.statusType === "complete" ? "View questions" : "Add questions"}
          <ArrowRight className="h-4 w-4 transition" />
        </span>
        <span className="text-xs text-muted-foreground">
          You can edit the cover + socials anytime.
        </span>
      </div>

      {/* Decorative element */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
    </Link>
  );
};
