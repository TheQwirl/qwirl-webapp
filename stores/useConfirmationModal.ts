import { create } from "zustand";

export type ConfirmationModalProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void>;
};

type ConfirmationModalStore = {
  isOpen: boolean;
  data: ConfirmationModalProps | null;
  show: (data: ConfirmationModalProps) => void;
  hide: () => void;
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;
};

export const useConfirmationModal = create<ConfirmationModalStore>((set) => ({
  isOpen: false,
  data: null,
  show: (data) => set({ isOpen: true, data }),
  hide: () => set({ isOpen: false, data: null, isSubmitting: false }),
  isSubmitting: false,
  setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
}));
