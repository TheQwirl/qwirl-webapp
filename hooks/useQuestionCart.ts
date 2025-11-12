"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { components } from "@/lib/api/v1-client-side";

type Question = components["schemas"]["QuestionSearchResponse"];

export interface CartQuestion {
  id: string; // Unique cart item ID
  questionId?: string; // Original question bank ID
  question_text: string;
  options: string[];
  owner_answer_index: number;
  isEdited: boolean; // Track if edited from original
  addedAt: number; // Timestamp for ordering
}

interface QuestionCartState {
  items: CartQuestion[];
  maxItems: number;

  // Actions
  addQuestion: (question: Question | CartQuestion) => boolean;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, updates: Partial<CartQuestion>) => void;
  reorderQuestions: (startIndex: number, endIndex: number) => void;
  clearCart: () => void;
  isInCart: (questionText: string) => boolean;
  getCartCount: () => number;
  canAddMore: () => boolean;
}

const generateCartId = () =>
  `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useQuestionCart = create<QuestionCartState>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 30,

      addQuestion: (question) => {
        const state = get();

        // Check if cart is full
        if (state.items.length >= state.maxItems) {
          return false;
        }

        // Check if already in cart (by question text)
        const existingItem = state.items.find(
          (item) => item.question_text === question.question_text
        );

        if (existingItem) {
          return false;
        }

        // Create cart item
        const cartQuestion: CartQuestion = {
          id:
            "id" in question && question.id
              ? question.id.toString()
              : generateCartId(),
          questionId: "id" in question ? question.id?.toString() : undefined,
          question_text: question.question_text,
          options: question.options || [],
          owner_answer_index:
            "owner_answer_index" in question ? question.owner_answer_index : 0,
          isEdited: "isEdited" in question ? question.isEdited : false,
          addedAt: Date.now(),
        };

        set((state) => ({
          items: [...state.items, cartQuestion],
        }));

        return true;
      },

      removeQuestion: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuestion: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updates, isEdited: true } : item
          ),
        }));
      },

      reorderQuestions: (startIndex, endIndex) => {
        set((state) => {
          const items = Array.from(state.items);
          const [removed] = items.splice(startIndex, 1);
          if (removed) {
            items.splice(endIndex, 0, removed);
          }
          return { items };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      isInCart: (questionText) => {
        return get().items.some((item) => item.question_text === questionText);
      },

      getCartCount: () => {
        return get().items.length;
      },

      canAddMore: () => {
        const state = get();
        return state.items.length < state.maxItems;
      },
    }),
    {
      name: "qwirl-question-cart", // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
