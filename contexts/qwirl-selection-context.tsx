"use client";
import React, { createContext, useContext } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { components } from "@/lib/api/v1-client-side";

type Question = components["schemas"]["QuestionSearchResponse"];

const QwirlPollItemSchema = z.object({
  id: z.string().optional(),
  question_text: z.string().min(1, "Question is required"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options required")
    .max(6, "Maximum 6 options allowed"),
  owner_answer_index: z.number().min(0),
});

export const QwirlSelectionSchema = z.object({
  polls: z.array(QwirlPollItemSchema).max(15, "Maximum 15 questions allowed"),
});

export type QwirlPollItem = z.infer<typeof QwirlPollItemSchema>;
export type QwirlSelectionForm = z.infer<typeof QwirlSelectionSchema>;

interface QwirlSelectionContextType {
  addQuestion: (question: Question) => void;
  removeQuestion: (index: number) => void;
  isQuestionSelected: (questionId: string) => boolean;
  selectedCount: number;
  maxSelections: number;
}

const QwirlSelectionContext = createContext<QwirlSelectionContextType | null>(
  null
);

interface QwirlSelectionProviderProps {
  children: React.ReactNode;
  defaultValues?: QwirlSelectionForm;
}

export function QwirlSelectionProvider({
  children,
  defaultValues,
}: QwirlSelectionProviderProps) {
  const methods = useForm<QwirlSelectionForm>({
    resolver: zodResolver(QwirlSelectionSchema),
    defaultValues: defaultValues || { polls: [] },
  });

  const polls = methods.watch("polls");
  const maxSelections = 15;

  const addQuestion = (question: Question) => {
    const currentPolls = methods.getValues("polls");

    if (currentPolls.length >= maxSelections) {
      return;
    }

    const isAlreadySelected = currentPolls.some(
      (poll) => poll.question_text === question.question_text
    );

    if (isAlreadySelected) {
      return;
    }

    const newPoll: QwirlPollItem = {
      id: question.id?.toString(),
      question_text: question.question_text,
      options: question.options || [],
      owner_answer_index: 0,
    };

    methods.setValue("polls", [...currentPolls, newPoll], {
      shouldValidate: true,
    });
  };

  const removeQuestion = (index: number) => {
    const currentPolls = methods.getValues("polls");
    const newPolls = currentPolls.filter((_, i) => i !== index);
    methods.setValue("polls", newPolls, { shouldValidate: true });
  };

  const isQuestionSelected = (questionText: string) => {
    return polls.some((poll) => poll.question_text === questionText);
  };

  const contextValue: QwirlSelectionContextType = {
    addQuestion,
    removeQuestion,
    isQuestionSelected,
    selectedCount: polls.length,
    maxSelections,
  };

  return (
    <QwirlSelectionContext.Provider value={contextValue}>
      <FormProvider {...methods}>{children}</FormProvider>
    </QwirlSelectionContext.Provider>
  );
}

export function useQwirlSelection() {
  const context = useContext(QwirlSelectionContext);
  if (!context) {
    // Return a default implementation when used outside provider
    return {
      addQuestion: () => {},
      removeQuestion: () => {},
      isQuestionSelected: () => false,
      selectedCount: 0,
      maxSelections: 15,
    };
  }
  return context;
}

export function useQwirlSelectionForm() {
  return useFormContext<QwirlSelectionForm>();
}
