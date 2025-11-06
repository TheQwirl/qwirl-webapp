"use client";

import React, { useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical, ChevronRight, Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartQuestion } from "@/hooks/useQuestionCart";
import { CompactQuestionCardEditable } from "@/components/qwirl/compact-question-card-editable";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "@/components/qwirl/schema";

interface SortableCartItemProps {
  question: CartQuestion;
  index: number;
  onUpdate: (
    id: string,
    data: {
      question_text: string;
      options: string[];
      owner_answer_index: number;
    }
  ) => void;
  onRemove: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SortableCartItem({
  question,
  index,
  onUpdate,
  onRemove,
  isOpen,
  onToggle,
}: SortableCartItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    transition: {
      duration: 200,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Initialize form with question data
  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: question.question_text,
      options: question.options,
      owner_answer_index: question.owner_answer_index,
    },
    mode: "onChange",
  });

  const { handleSubmit, reset } = methods;

  // Update form when question changes
  useEffect(() => {
    reset({
      question_text: question.question_text,
      options: question.options,
      owner_answer_index: question.owner_answer_index,
    });
  }, [
    question.question_text,
    question.options,
    question.owner_answer_index,
    reset,
  ]);

  // Auto-save when collapsing
  const handleToggle = async () => {
    // If currently open, save before closing
    if (isOpen) {
      handleSubmit((data) => {
        const hasChanges =
          data.question_text !== question.question_text ||
          JSON.stringify(data.options) !== JSON.stringify(question.options) ||
          data.owner_answer_index !== question.owner_answer_index;

        if (hasChanges) {
          onUpdate(question.id, data);
          toast.success("Changes saved", {
            duration: 2000,
          });
        }
      })();
    }
    onToggle();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border bg-card relative",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      {/* Collapsed Header - Fixed Layout */}
      <div className="flex items-center gap-2 p-3 w-full">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground flex-shrink-0"
          {...attributes}
          {...listeners}
          onClick={(e) => {
            // Prevent opening when dragging
            if (isDragging) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Question Number */}
        <span className="text-sm font-medium text-muted-foreground min-w-[24px] flex-shrink-0">
          #{index + 1}
        </span>

        {/* Question Preview - Takes remaining space */}
        <button
          onClick={handleToggle}
          className="flex-1 text-left min-w-0 py-0 hover:opacity-80 transition-opacity"
        >
          {!isOpen && (
            <div className="flex-1 gap-2 pr-2 flex items-center ">
              {question.isEdited && (
                <Badge
                  variant={"outline"}
                  className="text-xs font-normal rounded-full py-1 px-1 flex items-center justify-center gap-1"
                >
                  <Pen className="w-3 h-3" />
                  <span>Edited</span>
                </Badge>
              )}
              <div className="flex flex-col items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs whitespace-nowrap"
                >
                  {question.options.length} options
                </Badge>
              </div>
              <p className="text-sm font-medium truncate">
                {question.question_text || "Empty question"}
              </p>
            </div>
          )}
        </button>

        {/* Chevron */}
        <motion.button
          onClick={handleToggle}
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="text-muted-foreground hover:text-foreground flex-shrink-0 p-1"
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>

        {/* Delete Button - Always at the end */}
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(question.id);
          }}
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Expanded Content with Editable Card */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            <div className="px-3 pb-3">
              <FormProvider {...methods}>
                <CompactQuestionCardEditable />
              </FormProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
