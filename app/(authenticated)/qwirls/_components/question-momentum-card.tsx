"use client";

import React, { useMemo } from "react";
import CollapsibleCard from "@/components/collapsible-card";
import { Badge } from "@/components/ui/badge";
import { QwirlItem } from "@/types/qwirl";
import { ClipboardList, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionMomentumCardProps {
  polls: QwirlItem[] | undefined;
}

const stageGuidance = (
  pollCount: number
): {
  badge: string;
  tone: "start" | "build" | "refine" | "celebrate";
  title: string;
  tips: string[];
} => {
  if (pollCount === 0) {
    return {
      badge: "Start here",
      tone: "start",
      title: "Kick off with your signature opener",
      tips: [
        "Lead with the question you ask every new collaborator or friend.",
        "Follow with something playful to keep respondents leaning in.",
      ],
    };
  }

  if (pollCount > 0 && pollCount < 5) {
    return {
      badge: "Build momentum",
      tone: "build",
      title: "Curate a balanced opening set",
      tips: [
        "Mix introspective, mission-driven, and light-hearted prompts.",
        "Borrow from the library, then tailor the language to sound like you.",
      ],
    };
  }

  if (pollCount >= 5 && pollCount < 15) {
    return {
      badge: "Almost there",
      tone: "refine",
      title: "Layer in depth and surprise",
      tips: [
        "Add a wildcard about passions outside of work or niche obsessions.",
        "Use one values-driven question to spark meaningful replies.",
      ],
    };
  }

  return {
    badge: "Ready to share",
    tone: "celebrate",
    title: "Polish the sequencing before you go live",
    tips: [
      "Scan for duplicate vibes—swap one prompt if two feel too similar.",
      "Pin your own answer on at least a few questions to guide tone.",
    ],
  };
};

const QuestionMomentumCard: React.FC<QuestionMomentumCardProps> = ({
  polls,
}) => {
  const pollCount = polls?.length ?? 0;

  const summary = useMemo(() => {
    if (!polls || polls.length === 0) {
      return {
        lastQuestion: null as string | null,
        averageOptions: 0,
        ownerAnswers: 0,
        duplicateCount: 0,
      };
    }

    const lastQuestion = polls[polls.length - 1]?.question_text ?? null;
    const averageOptions =
      polls.reduce((total, poll) => total + (poll.options?.length ?? 0), 0) /
      polls.length;
    const ownerAnswers = polls.filter(
      (poll) => poll.owner_answer !== null && poll.owner_answer !== undefined
    ).length;

    const uniqueQuestions = new Set(
      polls.map((poll) => poll.question_text.trim().toLowerCase())
    );
    const duplicateCount = polls.length - uniqueQuestions.size;

    return {
      lastQuestion,
      averageOptions: Number.isFinite(averageOptions) ? averageOptions : 0,
      ownerAnswers,
      duplicateCount,
    };
  }, [polls]);

  const guidance = stageGuidance(pollCount);

  return (
    <CollapsibleCard
      title={
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ClipboardList className="h-4 w-4 text-primary" />
          Question momentum
        </div>
      }
      defaultOpen
      className="border shadow-sm"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Badge
            variant="secondary"
            className="rounded-full bg-primary/10 text-primary"
          >
            {guidance.badge}
          </Badge>
          <span>{guidance.title}</span>
        </div>
        <ul className="ml-5 list-disc space-y-1 text-xs text-muted-foreground">
          {guidance.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border bg-muted/60 p-3">
            <p className="text-[11px] text-muted-foreground uppercase">
              Total questions
            </p>
            <p className="text-sm font-semibold text-foreground">{pollCount}</p>
          </div>
          <div className="rounded-lg border bg-muted/60 p-3">
            <p className="text-[11px] text-muted-foreground uppercase">
              Avg. options
            </p>
            <p className="text-sm font-semibold text-foreground">
              {summary.averageOptions ? summary.averageOptions.toFixed(1) : "—"}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground uppercase">
              Pinned answers
            </p>
            <p className="text-sm font-semibold text-foreground">
              {pollCount ? `${summary.ownerAnswers}/${pollCount}` : "—"}
            </p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-[11px] text-muted-foreground uppercase">
              Duplicates
            </p>
            <p
              className={cn("text-sm font-semibold", {
                "text-amber-600": summary.duplicateCount > 0,
              })}
            >
              {summary.duplicateCount > 0
                ? `${summary.duplicateCount} to review`
                : "None"}
            </p>
          </div>
        </div>

        {summary.lastQuestion ? (
          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Recent addition
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              “{summary.lastQuestion}”
            </p>
          </div>
        ) : null}
      </div>
    </CollapsibleCard>
  );
};

export default QuestionMomentumCard;
