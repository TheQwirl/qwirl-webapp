"use client";

import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useFormContext } from "react-hook-form";
import { Lightbulb, Plus, X } from "lucide-react";
import { QwirlPollData } from "./schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const QUESTION_MAX_LENGTH = 160;
const OPTION_MAX_LENGTH = 80;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

interface PollComposerFormProps {
  showTips?: boolean;
}

const PollComposerForm: React.FC<PollComposerFormProps> = ({
  showTips = false,
}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<QwirlPollData>();

  const questionText = watch("question_text") ?? "";
  const options = watch("options") ?? [];
  const ownerAnswerIndex = watch("owner_answer_index") ?? 0;

  const canAddMore = options.length < MAX_OPTIONS;
  const questionAtLimit = questionText.length >= QUESTION_MAX_LENGTH;

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
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {showTips ? (
          <motion.div
            key="poll-tips"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex rounded-full bg-primary/20 p-2 text-primary">
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
          </motion.div>
        ) : null}
      </AnimatePresence>
      <section className="space-y-3">
        <Label htmlFor="poll-question" className="text-sm font-medium">
          Question
        </Label>
        <motion.div
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Controller
            name="question_text"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                id="poll-question"
                type="text"
                autoComplete="off"
                maxLength={QUESTION_MAX_LENGTH}
                value={field.value ?? ""}
                placeholder="What’s something your audience would love to answer?"
                className={cn(
                  "h-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/30",
                  errors.question_text && "border-destructive"
                )}
              />
            )}
          />
        </motion.div>
        {errors.question_text && (
          <p className="text-xs text-destructive">
            {errors.question_text.message}
          </p>
        )}
        {!errors.question_text && questionAtLimit && (
          <p className="text-xs text-muted-foreground">
            You’ve reached the {QUESTION_MAX_LENGTH}-character limit.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <Label className="text-sm font-medium">Options</Label>
            <span className="text-xs text-muted-foreground">
              Tap the circle to mark the answer you’d choose
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
            const optionAtLimit = currentOption.length >= OPTION_MAX_LENGTH;

            return (
              <motion.div
                key={`option-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="space-y-1"
              >
                <div>
                  <div className="flex gap-2 items-center sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 320 }}
                      className="sm:mt-0.5"
                    >
                      <Checkbox
                        checked={isOwnerAnswer}
                        onCheckedChange={() => {
                          if (!isOwnerAnswer) {
                            handleSelectOwnerAnswer(index);
                          }
                        }}
                        aria-label={`Mark option ${index + 1} as your pick`}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <Controller
                        name={`options.${index}` as const}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            autoComplete="off"
                            maxLength={OPTION_MAX_LENGTH}
                            placeholder={`Option ${index + 1}`}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30"
                          />
                        )}
                      />
                    </div>
                    <div className="">
                      {options.length > MIN_OPTIONS && (
                        <X
                          className="h-4 w-4 opacity-60 transition-opacity hover:opacity-100"
                          onClick={() => handleRemoveOption(index)}
                          aria-label={`Remove option ${index + 1}`}
                        />

                        // <Button
                        //   type="button"
                        //   variant="ghost"
                        //   size="icon"
                        //   onClick={() => handleRemoveOption(index)}
                        //   aria-label={`Remove option ${index + 1}`}
                        // >
                        // </Button>
                      )}
                    </div>
                  </div>
                </div>
                {optionError ? (
                  <p className="pl-8 text-xs text-destructive sm:pl-10">
                    {optionError}
                  </p>
                ) : null}
                {!optionError && optionAtLimit ? (
                  <p className="pl-8 text-xs text-muted-foreground sm:pl-10">
                    Limit reached — keep it within {OPTION_MAX_LENGTH}
                    characters.
                  </p>
                ) : null}
              </motion.div>
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
