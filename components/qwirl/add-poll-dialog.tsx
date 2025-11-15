"use client";
import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import PollComposerForm from "./poll-composer-form";
import { X } from "lucide-react";
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
    formState: { isValid, isSubmitting: formIsSubmitting },
  } = methods;

  const isBusy = isSubmitting || formIsSubmitting;

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
            <div>
              <DialogTitle className="text-base font-semibold">
                Craft a custom question
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Personalize the poll your audience will see
              </p>
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
              <ScrollArea className="flex-1 px-3 md:px-5 py-5">
                <div className="space-y-5 md:pr-2 h-[500px]">
                  <PollComposerForm />
                  {methods.formState.errors.root?.message && (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {methods.formState.errors.root.message}
                    </div>
                  )}
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
