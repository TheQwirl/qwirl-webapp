"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { useCartUIStore } from "@/stores/useCartUIStore";
import { cn } from "@/lib/utils";

interface GlobalCartButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  showWhenEmpty?: boolean;
}

export function GlobalCartButton({
  className,
  variant = "outline",
  showWhenEmpty = false,
}: GlobalCartButtonProps) {
  const { getCartCount } = useQuestionCart();
  const { openCart } = useCartUIStore();
  const count = getCartCount();

  // Hide when empty unless explicitly shown
  if (count === 0 && !showWhenEmpty) return null;

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={openCart}
      className={cn("relative", className)}
      title={`Question Cart (${count})`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Button>
  );
}

/**
 * Floating cart button for use on question library and other pages
 */
export function FloatingCartButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <GlobalCartButton
        variant="default"
        showWhenEmpty={false}
        className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      />
    </div>
  );
}
