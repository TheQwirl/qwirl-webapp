"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useConfirmationModal } from "@/stores/useConfirmationModal";
import { Loader2 } from "lucide-react";

export const ConfirmationModal = () => {
  const { isOpen, data, hide, isSubmitting } = useConfirmationModal();

  if (!data) return null;

  const {
    title,
    description,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = data;

  const handleConfirm = async () => {
    await onConfirm();
    hide();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={hide}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {confirmLabel}
              </div>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
