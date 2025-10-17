"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useQwirlSelection,
  useQwirlSelectionForm,
} from "@/contexts/qwirl-selection-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { QwirlPollData } from "@/components/qwirl/schema";
import { toast } from "sonner";
import { CompactQuestionCardEditable } from "@/components/qwirl/compact-question-card-editable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

interface SortablePollItemProps {
  id: string;
  poll: QwirlPollData;
  index: number;
  onRemove: () => void;
  onUpdate: (updatedPoll: QwirlPollData) => void;
}

function SortablePollItem({
  id,
  poll,
  index,
  onRemove,
  onUpdate,
}: SortablePollItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  const cardRef = React.useRef<any>(null);

  // Handle updates from the editable card
  React.useEffect(() => {
    if (cardRef.current) {
      const checkForUpdates = () => {
        const formData = cardRef.current.getFormData();
        if (
          formData.question_text !== poll.question_text ||
          JSON.stringify(formData.options) !== JSON.stringify(poll.options) ||
          formData.owner_answer_index !== poll.owner_answer_index
        ) {
          onUpdate(formData);
        }
      };

      const interval = setInterval(checkForUpdates, 1000);
      return () => clearInterval(interval);
    }
  }, [poll, onUpdate]);

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="absolute -right-2 -top-2 z-10 h-8 w-8 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground p-0"
        >
          <X className="h-4 w-4" />
        </Button>

        <CompactQuestionCardEditable
          ref={cardRef}
          question={poll.question_text}
          answers={poll.options}
          selectedAnswer={poll.options[poll.owner_answer_index]}
        />
      </div>
    </div>
  );
}

interface QwirlSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QwirlSelectionModal({
  isOpen,
  onClose,
}: QwirlSelectionModalProps) {
  const { selectedCount } = useQwirlSelection();
  const { handleSubmit, watch, setValue } = useQwirlSelectionForm();
  const { handleAddPoll } = useQwirlEditor();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const polls = watch("polls");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = polls.findIndex(
        (_, index) => `poll-${index}` === active.id
      );
      const newIndex = polls.findIndex(
        (_, index) => `poll-${index}` === over?.id
      );

      const newPolls = arrayMove(polls, oldIndex, newIndex);
      setValue("polls", newPolls, { shouldValidate: true });
    }
  };

  const handleRemovePoll = (index: number) => {
    const newPolls = polls.filter((_, i) => i !== index);
    setValue("polls", newPolls, { shouldValidate: true });
  };

  const handleSubmitPolls = async () => {
    try {
      setIsSubmitting(true);

      for (const poll of polls) {
        const pollData: QwirlPollData = {
          question_text: poll.question_text,
          options: poll.options,
          owner_answer_index: poll.owner_answer_index,
        };

        await handleAddPoll(pollData);
      }

      toast.success(
        `Successfully added ${polls.length} poll${
          polls.length > 1 ? "s" : ""
        } to your Qwirl!`
      );

      // Clear the selection
      setValue("polls", []);
      onClose();
    } catch (error) {
      toast.error("Failed to add polls. Please try again.");
      console.error("Error submitting polls:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl flex flex-col">
        <DialogHeader className="pr-6">
          <DialogTitle className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Selected Questions ({selectedCount}/15)
            </h3>
            {selectedCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValue("polls", [])}
              >
                Clear All
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {polls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <p className="text-lg text-muted-foreground mb-2">
                No questions selected yet
              </p>
              <p className="text-sm text-muted-foreground">
                Browse the question bank and select up to 15 questions for your
                Qwirl
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh] sm:h-[600px] pr-6 pb-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={polls.map((_, index) => `poll-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {polls.map((poll, index) => (
                      <SortablePollItem
                        key={`poll-${index}`}
                        id={`poll-${index}`}
                        poll={poll}
                        index={index}
                        onRemove={() => handleRemovePoll(index)}
                        onUpdate={(updatedPoll: QwirlPollData) => {
                          const newPolls = [...polls];
                          newPolls[index] = updatedPoll;
                          setValue("polls", newPolls, { shouldValidate: true });
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="flex-row justify-between border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Continue Browsing
          </Button>
          <Button
            onClick={handleSubmit(handleSubmitPolls)}
            disabled={polls.length === 0}
            loading={isSubmitting}
          >
            Add {polls.length} Poll{polls.length > 1 ? "s" : ""} to Qwirl
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
