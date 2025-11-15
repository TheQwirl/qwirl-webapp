"use client";

import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Lightbulb, Plus, Trash2, Check } from "lucide-react";
import { QwirlPollData } from "./schema";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QUESTION_MAX_LENGTH = 80;
const OPTION_MAX_LENGTH = 40;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const PollComposerForm: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QwirlPollData>();

  const questionText = watch("question_text") ?? "";
  const options = watch("options") ?? [];
  const ownerAnswerIndex = watch("owner_answer_index") ?? 0;

  const canAddMore = options.length < MAX_OPTIONS;

  const optionErrors = useMemo(() => {
    if (!errors.options) return [] as Array<string | undefined>;
    if (Array.isArray(errors.options)) {
      return errors.options.map(
        (error) => error?.message as string | undefined
      );
    }
    return [];
  }, [errors.options]);

  const generalOptionsError = useMemo(() => {
    if (!errors.options) return undefined;
    if (Array.isArray(errors.options)) return undefined;
    if ("message" in errors.options) {
      return errors.options.message as string | undefined;
    }
    return undefined;
  }, [errors.options]);

  const handleQuestionChange = (value: string) => {
    setValue("question_text", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    setValue(`options.${index}`, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSelectOwnerAnswer = (index: number) => {
    setValue("owner_answer_index", index, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;

    const nextOptions = options.filter((_, i) => i !== index);
    setValue("options", nextOptions, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const nextIndex =
      ownerAnswerIndex === index
        ? Math.max(0, index - 1)
        : ownerAnswerIndex > index
        ? ownerAnswerIndex - 1
        : ownerAnswerIndex;

    setValue(
      "owner_answer_index",
      Math.min(nextIndex, Math.max(nextOptions.length - 1, 0)),
      {
        shouldDirty: true,
        shouldValidate: true,
      }
    );
  };

  const handleAddOption = () => {
    if (!canAddMore) return;
    const placeholder = `Option ${options.length + 1}`;
    setValue("options", [...options, placeholder], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-1 rounded-full bg-primary/20 p-2 text-primary">
            <Lightbulb className="h-4 w-4" />
          </span>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">
              Quick tips for engaging polls
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>Ask one clear question at a time.</li>
              <li>Keep options short, distinct, and mutually exclusive.</li>
              <li>Spotlight the answer you’d personally choose.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="poll-question" className="text-sm font-medium">
            Question
          </Label>
          <span className="text-xs text-muted-foreground">
            {questionText.length}/{QUESTION_MAX_LENGTH}
          </span>
        </div>
        <Input
          id="poll-question"
          type="text"
          maxLength={QUESTION_MAX_LENGTH}
          value={questionText}
          onChange={(event) => handleQuestionChange(event.target.value)}
          placeholder="What’s something your audience would love to answer?"
          className={cn(
            "h-12 rounded-xl border bg-background/80 px-4 text-base shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/30",
            errors.question_text && "border-destructive"
          )}
        />
        {errors.question_text && (
          <p className="text-xs text-destructive">
            {errors.question_text.message}
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <Label className="text-sm font-medium">Options</Label>
            <span className="text-xs text-muted-foreground">
              Tap “Your pick” to highlight your answer
            </span>
          </div>
          {generalOptionsError && (
            <p className="text-xs text-destructive">{generalOptionsError}</p>
          )}
        </div>

        <div className="space-y-2">
          {options.map((optionValue, index) => {
            const currentOption = optionValue ?? "";
            const optionError = optionErrors[index];
            const isOwnerAnswer = ownerAnswerIndex === index;

            return (
              <div key={index} className="space-y-1">
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2 rounded-xl border bg-background px-3 py-3 shadow-sm transition",
                    optionError && "border-destructive"
                  )}
                >
                  <Badge
                    variant="secondary"
                    className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  >
                    {index + 1}
                  </Badge>
                  <Input
                    value={currentOption}
                    maxLength={OPTION_MAX_LENGTH}
                    onChange={(event) =>
                      handleOptionChange(index, event.target.value)
                    }
                    placeholder={`Answer choice ${index + 1}`}
                    className="flex-1 min-w-[110px] rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {currentOption.length}/{OPTION_MAX_LENGTH}
                  </span>
                  <Button
                    type="button"
                    size="xs"
                    variant={isOwnerAnswer ? "secondary" : "outline"}
                    className={cn(
                      "whitespace-nowrap rounded-full px-2 py-1 gap-1",
                      isOwnerAnswer && "border-primary text-primary"
                    )}
                    icon={Check}
                    iconPlacement="left"
                    onClick={() => handleSelectOwnerAnswer(index)}
                  >
                    {isOwnerAnswer ? "Your pick" : "Set pick"}
                  </Button>
                  {options.length > MIN_OPTIONS && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveOption(index)}
                      aria-label={`Remove option ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {optionError && (
                  <p className="pl-10 text-xs text-destructive">
                    {optionError}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={handleAddOption}
          disabled={!canAddMore}
          variant="outline"
          icon={Plus}
          iconPlacement="left"
          className="w-full rounded-xl border-dashed py-4 text-sm shadow-none"
        >
          {canAddMore ? "Add another answer" : "You’ve reached the limit"}
        </Button>
      </section>
    </div>
  );
};

export default PollComposerForm;
