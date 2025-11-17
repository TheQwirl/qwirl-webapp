"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import PollComposerForm from "./poll-composer-form";
import { Lightbulb, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    clearErrors,
    setError,
    setFocus,
    formState: { isValid, isSubmitting: formIsSubmitting, errors, submitCount },
  } = methods;

  const isBusy = isSubmitting || formIsSubmitting;
  const [showTips, setShowTips] = useState(false);
  const rootErrorMessage = errors.root?.message;

  // Reset form when dialog closes
  useEffect(() => {
    if (!isModalOpen) {
      reset({
        question_text: "",
        options: ["Option 1", "Option 2"],
        owner_answer_index: 0,
      });
      setShowTips(false);
      clearErrors();
    }
  }, [isModalOpen, reset, clearErrors]);

  useEffect(() => {
    if (!isModalOpen || submitCount === 0) return;
    if (errors.question_text) {
      setFocus("question_text");
      return;
    }

    if (Array.isArray(errors.options)) {
      const firstOptionWithError = errors.options.findIndex(Boolean);
      if (firstOptionWithError >= 0) {
        setFocus(`options.${firstOptionWithError}` as FieldPath<QwirlPollData>);
        return;
      }
    }

    if (errors.options && !Array.isArray(errors.options)) {
      setFocus("options.0" as FieldPath<QwirlPollData>);
    }
  }, [errors, isModalOpen, setFocus, submitCount]);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const onSubmit = handleSubmit(async (data: QwirlPollData) => {
    clearErrors("root");
    try {
      await handleAddPoll(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn’t save that poll. Please try again.";
      setError("root", { type: "server", message });
    }
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange} modal>
      <DialogContent className="w-full max-w-lg overflow-hidden rounded-2xl border bg-background p-0 shadow-xl sm:max-h-[88vh]">
        <div className="flex h-full max-h-[100vh] flex-col">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-base font-semibold">
                Craft a custom question
              </DialogTitle>

              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setShowTips(!showTips)}
                icon={Lightbulb}
                iconPlacement="left"
              >
                {showTips ? "Hide tips" : "Show tips"}
              </Button>
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex h-full flex-col">
              <ScrollArea className="flex-1 px-4 py-5 sm:px-5">
                <div className="space-y-5 pb-2">
                  <PollComposerForm showTips={showTips} />
                  {rootErrorMessage ? (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {rootErrorMessage}
                    </div>
                  ) : null}
                </div>
              </ScrollArea>

              <DialogFooter className="gap-3 border-t bg-background/95 px-5 py-4 backdrop-blur sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={!isValid || isBusy}
                  loading={isBusy}
                  className="w-full sm:w-auto"
                >
                  {isBusy ? "Adding" : "Add Poll"}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPollDialog;
