"use client";

import { CartSlideOver } from "@/components/question-bank/cart-slide-over";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { CartQuestion } from "@/hooks/useQuestionCart";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export function AuthenticatedCartWrapper() {
  const { isCartOpen, closeCart } = useCartUIStore();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the edit page
  const isEditPage = pathname === "/qwirls/primary/edit";

  const handleAddAllToQwirl = async (questions: CartQuestion[]) => {
    if (isEditPage) {
      // If already on edit page, dispatch custom event
      const event = new CustomEvent("add-all-from-cart", {
        detail: { questions },
      });
      window.dispatchEvent(event);
      closeCart();
    } else {
      // Navigate to edit page with cart items
      router.push("/qwirls/primary/edit?addFromCart=true");
      toast.info("Opening Qwirl editor", {
        description: `${questions.length} questions ready to add`,
      });
    }
  };

  return (
    <CartSlideOver
      isOpen={isCartOpen}
      onClose={closeCart}
      onAddAllToQwirl={handleAddAllToQwirl}
    />
  );
}
