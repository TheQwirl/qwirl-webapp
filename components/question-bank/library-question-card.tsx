"use client";

import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { components } from "@/lib/api/v1-client-side";
import { categoryMeta } from "@/constants/categories";
import { Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Question = components["schemas"]["QuestionSearchResponse"];

export type LibraryAddPollData = {
  question_text: string;
  options: string[];
  owner_answer_index: number;
  category_id: number;
};

export interface LibraryQuestionCardProps {
  question: Question;
  isActive: boolean;
  onRequestActive: () => void;
  onRequestClose?: () => void;
  onAddPoll: (pollData: LibraryAddPollData) => Promise<void>;
  dimmed?: boolean;
}

/**
 * LibraryQuestionCard implements 3 UX states:
 * - Browse (Passive): compact, read-only, pills preview
 * - Select (Active): expands, radio group, add CTA
 * - Customize (Edit): inputs for question/options + delete X + add option
 */
export function LibraryQuestionCard({
  question,
  isActive,
  onRequestActive,
  onRequestClose,
  onAddPoll,
  dimmed,
}: LibraryQuestionCardProps) {
  // Local working copy (only relevant once you expand/customize)
  const initialOwnerAnswerIndex =
    (question as { owner_answer_index?: number }).owner_answer_index ?? 0;

  const [isEditing, setIsEditing] = useState(false);
  const [questionText, setQuestionText] = useState(question.question_text);
  const [options, setOptions] = useState<string[]>(question.options ?? []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialOwnerAnswerIndex ?? null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep local state synced if card reuses with new data
  useEffect(() => {
    setQuestionText(question.question_text);
    setOptions(question.options ?? []);
    setSelectedIndex(initialOwnerAnswerIndex ?? null);
    setIsEditing(false);
    setErrorMessage(null);
  }, [
    question.id,
    question.question_text,
    question.options,
    initialOwnerAnswerIndex,
  ]);

  // Pro-tip: when active, scroll into view (center)
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isActive) return;
    // next frame so accordion expansion has a chance to layout
    window.requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [isActive]);

  const categoryBadge = useMemo(() => {
    const categoryName = question.category_name;
    if (!categoryName) return null;

    const metaEntry = Object.entries(categoryMeta).find(
      ([key]) => key.toLowerCase() === categoryName.toLowerCase()
    );

    if (!metaEntry) {
      return (
        <Badge variant="secondary" className="text-[10px] font-normal">
          {categoryName}
        </Badge>
      );
    }

    const [label, meta] = metaEntry as [
      string,
      { bg: string; fg: string; icon: React.ElementType }
    ];
    const Icon = meta.icon;

    return (
      <Badge
        variant="secondary"
        className="inline-flex items-center gap-2 text-[10px] font-normal"
        style={{ backgroundColor: meta.bg, color: meta.fg }}
      >
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  }, [question.category_name]);

  const canAdd =
    selectedIndex !== null &&
    selectedIndex >= 0 &&
    selectedIndex < options.length &&
    questionText.trim().length > 0 &&
    options.filter((o) => o.trim().length > 0).length >= 2;

  const handleCardClick = useCallback(() => {
    if (!isActive) onRequestActive();
  }, [isActive, onRequestActive]);

  const handleToggleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleDoneEditing = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsEditing(false);
  }, []);

  const handleAddOption = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (options.length >= 6) return;
      setOptions((prev) => [...prev, "New option"]);
      if (selectedIndex === null) {
        setSelectedIndex(0);
      }
    },
    [options.length, selectedIndex]
  );

  const handleDeleteOption = useCallback((index: number) => {
    setOptions((prev) => {
      if (prev.length <= 2) return prev;
      const next = prev.filter((_, i) => i !== index);

      setSelectedIndex((current) => {
        if (current === null) return null;
        if (current === index) return Math.min(index, next.length - 1);
        if (current > index) return current - 1;
        return current;
      });

      return next;
    });
  }, []);

  const handleAddToQwirl = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      setErrorMessage(null);

      if (!canAdd || selectedIndex === null) return;

      setIsSubmitting(true);
      try {
        const payload: LibraryAddPollData = {
          question_text: questionText.trim(),
          options: options.map((o) => o.trim()).filter(Boolean),
          owner_answer_index: selectedIndex,
          category_id: question.categories_id,
        };

        await onAddPoll(payload);
        setJustAdded(true);
        setIsEditing(false);
        window.setTimeout(() => setJustAdded(false), 2500);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to add poll. Please try again.";
        setErrorMessage(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      canAdd,
      onAddPoll,
      options,
      questionText,
      selectedIndex,
      question.categories_id,
    ]
  );

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
      className="w-full"
    >
      <Card
        ref={cardRef}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        className={cn(
          "w-full rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm transition",
          "hover:border-primary/40 hover:shadow-md",
          isActive && "ring-2 ring-primary",
          dimmed && !isActive && "opacity-60",
          "cursor-pointer"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1 flex-grow">
            {isEditing ? (
              <Input
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="h-8 text-sm font-semibold"
                onClick={(e) => e.stopPropagation()}
                placeholder="Question..."
              />
            ) : (
              <div className="text-sm font-semibold leading-snug text-foreground">
                {questionText}
              </div>
            )}

            <div className="flex items-center gap-2">{categoryBadge}</div>
          </div>

          {isActive ? (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleDoneEditing}
                  className="h-8"
                >
                  Done
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={handleToggleEdit}
                  aria-label="Customize question"
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : null}
        </div>

        {/* Passive state: horizontal pills */}
        {!isActive ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {(options ?? []).slice(0, 6).map((opt, i) => (
              <Badge
                key={`${question.id}-opt-${i}`}
                variant="secondary"
                className="text-xs font-normal"
              >
                {i + 1}. {opt}
              </Badge>
            ))}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mt-4 overflow-hidden"
            >
              <div className="space-y-1">
                {/* Active state: radio group OR edit inputs */}
                {!isEditing ? (
                  <RadioGroup
                    value={
                      selectedIndex === null ? undefined : String(selectedIndex)
                    }
                    onValueChange={(v) => setSelectedIndex(Number(v))}
                    className="space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {options.map((opt, i) => (
                      <label
                        key={`${question.id}-radio-${i}`}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 text-sm transition",
                          selectedIndex === i
                            ? "border-primary bg-primary/10"
                            : "border-border/60 bg-muted/20 hover:bg-muted/30"
                        )}
                      >
                        <RadioGroupItem value={String(i)} />
                        <span className="text-sm text-foreground">{opt}</span>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <RadioGroup
                    value={
                      selectedIndex === null ? undefined : String(selectedIndex)
                    }
                    onValueChange={(v) => setSelectedIndex(Number(v))}
                    className="space-y-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {options.map((opt, i) => (
                      <div
                        key={`${question.id}-edit-${i}`}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border p-2 transition",
                          selectedIndex === i
                            ? "border-primary bg-primary/10"
                            : "border-border/60 bg-muted/20"
                        )}
                      >
                        <RadioGroupItem value={String(i)} />

                        <Input
                          value={opt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptions((prev) => {
                              const next = [...prev];
                              next[i] = val;
                              return next;
                            });
                          }}
                          className="h-8 text-sm"
                          placeholder={`Option ${i + 1}`}
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "h-8 w-8 text-muted-foreground hover:text-foreground",
                            options.length <= 2 &&
                              "opacity-40 pointer-events-none"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOption(i);
                          }}
                          aria-label={`Remove option ${i + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddOption}
                        disabled={options.length >= 6}
                      >
                        + Add Option
                      </Button>
                    </div>
                  </RadioGroup>
                )}

                {errorMessage ? (
                  <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-2 pt-2">
                  {justAdded ? (
                    <span className="text-xs font-semibold text-primary">
                      Added
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(false);
                      onRequestClose?.();
                    }}
                    className="h-8"
                  >
                    Back to list
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    className=""
                    onClick={handleAddToQwirl}
                    disabled={!canAdd || isSubmitting}
                    loading={isSubmitting}
                  >
                    Add to Qwirl
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </Card>
    </motion.div>
  );
}

export function LibraryQuestionCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={cn("flex flex-col animate-pulse", className)}>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-3/4 bg-muted rounded mb-1" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-muted rounded-full" />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <div className="h-8 w-20 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}
