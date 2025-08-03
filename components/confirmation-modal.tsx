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

export const ConfirmationModal = () => {
  const { isOpen, data, hide } = useConfirmationModal();

  if (!data) return null;

  const {
    title,
    description,
    onConfirm,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
  } = data;

  const handleConfirm = () => {
    onConfirm();
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
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
