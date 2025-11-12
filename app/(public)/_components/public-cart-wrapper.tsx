"use client";

import { CartSlideOver } from "@/components/question-bank/cart-slide-over";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { CartQuestion } from "@/hooks/useQuestionCart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PublicCartWrapperProps {
  isAuthenticated: boolean;
}

export function PublicCartWrapper({ isAuthenticated }: PublicCartWrapperProps) {
  const { isCartOpen, closeCart } = useCartUIStore();
  const router = useRouter();

  const handleAddAllToQwirl = async (questions: CartQuestion[]) => {
    if (!isAuthenticated) return;
    // Navigate to edit page - user must be authenticated to get here
    router.push("/qwirls/primary/edit");
    toast.info("Opening Qwirl editor", {
      description: `${questions.length} questions ready to add`,
    });
  };

  return (
    <CartSlideOver
      isOpen={isCartOpen}
      onClose={closeCart}
      onAddAllToQwirl={handleAddAllToQwirl}
      currentPollCount={0}
      isAuthenticated={isAuthenticated}
    />
  );
}
