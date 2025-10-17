"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useQwirlSelection } from "@/contexts/qwirl-selection-context";
import { cn } from "@/lib/utils";

interface QwirlCartButtonProps {
  onClick: () => void;
  className?: string;
}

export function QwirlCartButton({ onClick, className }: QwirlCartButtonProps) {
  const { selectedCount } = useQwirlSelection();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={cn("relative h-full", className)}
    >
      <ShoppingCart className="" />
      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
        {selectedCount > 99 ? "99+" : selectedCount}
      </span>
      <span className="sr-only">Selected questions: {selectedCount}</span>
    </Button>
  );
}
