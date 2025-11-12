"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus } from "lucide-react";
import { useQuestionCart, CartQuestion } from "@/hooks/useQuestionCart";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableCartItem } from "./sortable-cart-item";
import { useRouter } from "next/navigation";

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAllToQwirl?: (questions: CartQuestion[]) => Promise<void>;
  currentPollCount?: number; // Current number of polls already in the Qwirl
  isAuthenticated?: boolean;
}

export function CartSlideOver({
  isOpen,
  onClose,
  onAddAllToQwirl,
  isAuthenticated = true,
}: CartSlideOverProps) {
  const {
    items,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    clearCart,
    getCartCount,
  } = useQuestionCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | undefined>(undefined);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const router = useRouter();

  const cartCount = getCartCount();

  useEffect(() => {
    if (!isOpen) {
      setIsAuthDialogOpen(false);
    }
  }, [isOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Collapse accordion when drag starts
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    // Collapse any open item when drag starts
    setOpenItemId(undefined);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      reorderQuestions(oldIndex, newIndex);
    }
  };

  const handleRemove = (id: string) => {
    removeQuestion(id);
    toast.success("Removed from cart");
  };

  const handleUpdate = (
    id: string,
    data: {
      question_text: string;
      options: string[];
      owner_answer_index: number;
    }
  ) => {
    updateQuestion(id, {
      question_text: data.question_text,
      options: data.options,
      owner_answer_index: data.owner_answer_index,
      isEdited: true,
    });
  };

  const handleToggle = (questionId: string) => {
    setOpenItemId(openItemId === questionId ? undefined : questionId);
  };

  const handleClearCart = () => {
    if (items.length > 0) {
      clearCart();
      toast.success("Cart cleared");
    }
  };

  const handleAddAllToQwirl = async () => {
    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (!onAddAllToQwirl || items.length === 0) return;

    setIsSubmitting(true);
    try {
      await onAddAllToQwirl(items);
      toast.success(`Added ${items.length} questions to Qwirl`, {
        description: "Questions added in cart order",
        action: {
          label: "Open Editor",
          onClick: () => {
            // Navigate to editor
            window.location.href = "/qwirls/primary/edit";
          },
        },
      });
      clearCart();
      onClose();
    } catch (error) {
      toast.error("Failed to add questions", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[550px] p-0 flex flex-col"
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <div className="">
                <SheetTitle>Question Cart</SheetTitle>
                <SheetDescription>
                  {cartCount} question{cartCount !== 1 ? "s" : ""} in cart
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="flex items-center justify-end px-6 ">
            <Button
              variant="destructive"
              icon={Trash2}
              size={"sm"}
              iconPlacement="left"
              onClick={handleClearCart}
              className="w-fit"
            >
              Clear Cart
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 pb-4 ">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Browse the question library and add questions to your cart
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 px-6 pb-4">
                <div className="w-full">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={items.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {items.map((question, index) => (
                          <SortableCartItem
                            key={question.id}
                            question={question}
                            index={index}
                            onUpdate={handleUpdate}
                            onRemove={handleRemove}
                            isOpen={openItemId === question.id}
                            onToggle={() => handleToggle(question.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <SheetFooter className="px-6 py-4 border-t flex-row gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Close
                </Button>
                {(onAddAllToQwirl || !isAuthenticated) && (
                  <Button
                    onClick={handleAddAllToQwirl}
                    disabled={isSubmitting || items.length === 0}
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    {isAuthenticated ? "Add All to Qwirl" : "Create Qwirl"}
                  </Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-2">
            <DialogTitle>Sign in to create your Qwirl</DialogTitle>
            <DialogDescription>
              Sign in or create an account to finish building your Qwirl. Your
              cart will be waiting for you exactly as you left it once you log
              in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              We&apos;ll keep every question in your cart so you can jump
              straight into the Qwirl editor after signing in.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => setIsAuthDialogOpen(false)}
            >
              Keep browsing
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                setIsAuthDialogOpen(false);
                onClose();
                router.push("/auth");
              }}
            >
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
