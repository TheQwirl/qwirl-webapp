"use client";

import * as React from "react";
import { useCallback, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, AlertCircle, Pencil } from "lucide-react";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import clsx from "clsx";
import { Separator } from "../ui/separator";

export interface CompactQuestionCardEditableRef {
  getFormData: () => QwirlPollData;
  isValid: () => boolean;
  submit: () => Promise<QwirlPollData | null>;
}

interface CompactQuestionCardEditableProps {
  question: string;
  answers: string[];
  selectedAnswer?: string;
  className?: string;
  category?: string;
  tags?: string[];
  maxOptions?: number;
}

export const CompactQuestionCardEditable = React.forwardRef<
  CompactQuestionCardEditableRef,
  CompactQuestionCardEditableProps
>(
  (
    {
      question: initialQuestion,
      answers: initialAnswers,
      selectedAnswer: initialSelectedAnswer,
      className,
      category,
      tags,
      maxOptions = 6,
    },
    ref
  ) => {
    const methods = useForm<QwirlPollData>({
      resolver: zodResolver(QwirlPollSchema),
      defaultValues: {
        question_text: initialQuestion,
        options: [...initialAnswers],
        owner_answer_index: Math.max(
          0,
          initialAnswers.indexOf(
            initialSelectedAnswer || initialAnswers[0] || ""
          )
        ),
      },
      mode: "onChange",
    });

    const {
      watch,
      setValue,
      formState: { errors, isValid },
      handleSubmit,
    } = methods;
    const options = watch("options");
    const ownerAnswerIndex = watch("owner_answer_index");

    // Expose form methods to parent via ref
    useImperativeHandle(ref, () => ({
      getFormData: () => methods.getValues(),
      isValid: () => isValid,
      submit: () => {
        return new Promise<QwirlPollData | null>((resolve) => {
          handleSubmit(
            (data) => resolve(data),
            () => resolve(null)
          )();
        });
      },
    }));

    // Update form when props change
    useEffect(() => {
      methods.reset({
        question_text: initialQuestion,
        options: [...initialAnswers],
        owner_answer_index: Math.max(
          0,
          initialAnswers.indexOf(
            initialSelectedAnswer || initialAnswers[0] || ""
          )
        ),
      });
    }, [initialQuestion, initialAnswers, initialSelectedAnswer, methods]);

    const handleAddOption = useCallback(() => {
      if (options.length < maxOptions) {
        const newOptions = [...options, "New option"];
        setValue("options", newOptions, { shouldValidate: true });
      }
    }, [options, maxOptions, setValue]);

    const handleDeleteOption = useCallback(
      (index: number) => {
        if (options.length > 2) {
          const newOptions = options.filter((_, i) => i !== index);
          const currentIndex = ownerAnswerIndex;

          setValue("options", newOptions, { shouldValidate: true });

          if (currentIndex === index) {
            const fallback = Math.min(index, newOptions.length - 1);
            setValue("owner_answer_index", fallback, { shouldValidate: true });
          } else if (currentIndex > index) {
            setValue("owner_answer_index", currentIndex - 1, {
              shouldValidate: true,
            });
          }
        }
      },
      [options, ownerAnswerIndex, setValue]
    );

    const handleSelectAnswer = useCallback(
      (index: number) => {
        setValue("owner_answer_index", index, { shouldValidate: true });
      },
      [setValue]
    );

    const handleQuestionBlur = useCallback(
      (e: React.FocusEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || "";
        setValue("question_text", text, { shouldValidate: true });
      },
      [setValue]
    );

    const handleOptionBlur = useCallback(
      (index: number, e: React.FocusEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || "";
        const newOptions = [...options];
        newOptions[index] = text;
        setValue("options", newOptions, { shouldValidate: true });
      },
      [options, setValue]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
      },
      []
    );

    return (
      <Card className={clsx("transition-shadow hover:shadow-md", className)}>
        <CardContent className="p-5 md:p-6">
          {category && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {category}
              </Badge>
            </div>
          )}

          {/* Question Section */}
          <div className="mb-4">
            <div className="space-y-1">
              <div className="relative group">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleQuestionBlur}
                  onKeyDown={handleKeyDown}
                  className={clsx(
                    "text-lg font-semibold outline-none rounded-md px-3 py-2 pr-10 transition-all duration-200 min-h-[2rem]",
                    "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
                    errors.question_text
                      ? "border-2 border-destructive"
                      : "border-2 border-transparent hover:border-muted focus:border-primary"
                  )}
                  data-placeholder="Enter your question..."
                  ref={(el) => {
                    if (el) {
                      const elDiv = el as HTMLDivElement & {
                        focusEditor?: () => void;
                      };
                      elDiv.focusEditor = () => {
                        elDiv.focus();
                        // Place cursor at end
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(elDiv);
                        range.collapse(false);
                        sel?.removeAllRanges();
                        sel?.addRange(range);
                      };
                    }
                  }}
                >
                  {initialQuestion}
                </div>
                <Pencil
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer transition-colors hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    const editor = e.currentTarget
                      .previousElementSibling as HTMLDivElement & {
                      focusEditor?: () => void;
                    };
                    editor?.focusEditor?.();
                  }}
                />
              </div>
              {errors.question_text && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.question_text.message}</span>
                </div>
              )}
            </div>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Options Section */}
          <div className="space-y-2 mb-4">
            {options.map((option, index) => (
              <div key={index} className="space-y-1">
                <div
                  className={clsx(
                    "group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                    ownerAnswerIndex === index
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-muted/30 border-muted hover:bg-muted/40"
                  )}
                  onClick={() => handleSelectAnswer(index)}
                >
                  {/* Rounded Checkbox */}
                  <div
                    className={clsx(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                      ownerAnswerIndex === index
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40 bg-background"
                    )}
                  ></div>

                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleOptionBlur(index, e)}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                    className={clsx(
                      "flex-1 text-sm hover:cursor-text outline-none rounded px-2 py-1 transition-all",
                      "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50",
                      errors.options?.[index]
                        ? "bg-destructive/10"
                        : "hover:bg-muted/50 focus:bg-background"
                    )}
                    data-placeholder={`Option ${index + 1}`}
                    ref={(el) => {
                      if (el) {
                        const elDiv = el as HTMLDivElement & {
                          focusEditor?: () => void;
                        };
                        elDiv.focusEditor = () => {
                          el.focus();
                          // Place cursor at end
                          const range = document.createRange();
                          const sel = window.getSelection();
                          range.selectNodeContents(el);
                          range.collapse(false);
                          sel?.removeAllRanges();
                          sel?.addRange(range);
                        };
                      }
                    }}
                  >
                    {option}
                  </div>

                  <Pencil
                    className="h-3.5 w-3.5 text-gray-500 cursor-pointer transition-colors hover:text-foreground flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      const editor = e.currentTarget
                        .previousElementSibling as HTMLDivElement & {
                        focusEditor?: () => void;
                      };
                      editor?.focusEditor?.();
                    }}
                  />

                  <div className=" transition-opacity flex gap-1">
                    {options.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOption(index);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                {errors.options?.[index] && (
                  <div className="flex items-center gap-2 text-sm text-destructive ml-8">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.options[index]?.message}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Add Option Button */}
            {options.length < maxOptions && (
              <Button
                icon={Plus}
                iconPlacement="left"
                onClick={handleAddOption}
                className="w-full !py-6 border-2 border-dashed !bg-transparent shadow-none text-foreground"
              >
                Add Option
              </Button>
            )}

            {/* General options error */}
            {errors.options &&
              typeof errors.options === "object" &&
              "message" in errors.options && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.options.message}</span>
                </div>
              )}
          </div>

          <Separator className="my-4" />
          {/* Selected Answer Indicator */}
          {ownerAnswerIndex !== undefined && options[ownerAnswerIndex] && (
            <div className="text-sm text-muted-foreground ">
              Your choice: <strong>{options[ownerAnswerIndex]}</strong>
            </div>
          )}

          {/* Form-level errors */}
          {errors.root && (
            <div className="flex items-center gap-2 text-sm text-destructive mt-4">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.root.message}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

CompactQuestionCardEditable.displayName = "CompactQuestionCardEditable";
