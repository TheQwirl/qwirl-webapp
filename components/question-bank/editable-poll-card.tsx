"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, X, Plus } from "lucide-react";
import { Controller } from "react-hook-form";
import { useQwirlSelectionForm } from "@/contexts/qwirl-selection-context";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

interface EditablePollCardProps {
  id: string;
  index: number;
  onRemove: () => void;
}

export function EditablePollCard({
  id,
  index,
  onRemove,
}: EditablePollCardProps) {
  const { control, watch, setValue } = useQwirlSelectionForm();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const poll = watch(`polls.${index}`);
  const options = poll?.options || [];
  const ownerAnswerIndex = poll?.owner_answer_index || 0;

  const addOption = () => {
    if (options.length >= 6) return;

    const newOption = `Option ${options.length + 1}`;
    const newOptions = [...options, newOption];
    setValue(`polls.${index}.options`, newOptions, { shouldValidate: true });
  };

  const removeOption = (optionIndex: number) => {
    if (options.length <= 2) return;

    const newOptions = options.filter((_, i) => i !== optionIndex);
    setValue(`polls.${index}.options`, newOptions, { shouldValidate: true });

    // Adjust owner answer index if necessary
    if (ownerAnswerIndex === optionIndex) {
      const fallback = Math.min(optionIndex, newOptions.length - 1);
      setValue(`polls.${index}.owner_answer_index`, fallback, {
        shouldValidate: true,
      });
    } else if (ownerAnswerIndex > optionIndex) {
      setValue(`polls.${index}.owner_answer_index`, ownerAnswerIndex - 1, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? "opacity-50" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground z-10"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader className="pl-10 pr-12">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Question</Label>
          <Controller
            name={`polls.${index}.question_text`}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your question..."
                className="text-base font-medium"
              />
            )}
          />
        </div>
      </CardHeader>

      <CardContent className="pl-10 pr-12">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Options</Label>
          <div className="space-y-2">
            {options.map((option, optionIndex) => (
              <motion.div
                key={optionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 group"
              >
                <Checkbox
                  checked={optionIndex === ownerAnswerIndex}
                  onCheckedChange={() => {
                    if (optionIndex !== ownerAnswerIndex) {
                      setValue(
                        `polls.${index}.owner_answer_index`,
                        optionIndex,
                        {
                          shouldValidate: true,
                        }
                      );
                    }
                  }}
                />
                <Controller
                  control={control}
                  name={`polls.${index}.options.${optionIndex}`}
                  render={({ field }) => (
                    <Input
                      {...field}
                      maxLength={60}
                      placeholder={`Option ${optionIndex + 1}`}
                      className="flex-1"
                    />
                  )}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeOption(optionIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>

      {options.length < 6 && (
        <CardFooter className="pl-10 pr-12">
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addOption}
            icon={Plus}
            iconPlacement="left"
          >
            Add Option
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
