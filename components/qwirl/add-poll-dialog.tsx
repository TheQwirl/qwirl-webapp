"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import { CompactQuestionCardEditable } from "./compact-question-card-editable";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAddPoll: (question: QwirlPollData) => Promise<void>;
  isSubmitting?: boolean;
}

const AddPollDialog: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  handleAddPoll,
  isSubmitting = false,
}) => {
  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: "",
      options: ["Option 1", "Option 2"],
      owner_answer_index: 0,
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  // Reset form when dialog closes
  useEffect(() => {
    if (!isModalOpen) {
      reset({
        question_text: "",
        options: ["Option 1", "Option 2"],
        owner_answer_index: 0,
      });
    }
  }, [isModalOpen, reset]);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const onSubmit = async (data: QwirlPollData) => {
    await handleAddPoll(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange} modal>
      <DialogContent className="overflow-y-auto sm:max-h-[80vh] max-h-screen sm:max-w-xl no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Custom Question</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CompactQuestionCardEditable />

            <DialogFooter className="gap-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Add Poll
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddPollDialog;
