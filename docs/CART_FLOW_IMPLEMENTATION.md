# Question Library Cart Flow - Implementation Summary

## ✅ Completed Components

### 1. **useQuestionCart Hook** (`hooks/useQuestionCart.ts`)

- ✅ Zustand store with localStorage persistence
- ✅ Add/remove/update/reorder cart items
- ✅ 15-question limit enforcement
- ✅ Duplicate detection by question text
- ✅ Track edited status
- ✅ TypeScript types for CartQuestion

### 2. **LibrarySlideOver Component** (`components/question-bank/library-slide-over.tsx`)

- ✅ Right-side Sheet (480px max width)
- ✅ Search with debounce
- ✅ Category filter dropdown
- ✅ Infinite scroll with loading states
- ✅ Three action buttons per question:
  - **Add to Cart**: Adds to cart with toast
  - **Quick Add** (⚡): Directly adds to Qwirl
  - **Edit & Add** (✏️): Opens editor first
- ✅ Cart status indicator (X/15)
- ✅ Disabled state when cart full
- ✅ Toast notifications with actions

### 3. **CartSlideOver Component** (`components/question-bank/cart-slide-over.tsx`)

- ✅ Right-side Sheet for cart management
- ✅ Drag-and-drop reordering (@dnd-kit)
- ✅ Accordion UI for space efficiency
- ✅ Inline editing:
  - Edit question text
  - Edit options
  - Toggle edit mode
- ✅ Visual indicators:
  - Item number (#1, #2, etc.)
  - "Edited" badge
  - Options count badge
- ✅ Info alert about "Editing a copy"
- ✅ Footer actions:
  - Clear Cart
  - Add All to Qwirl
- ✅ Empty state with friendly message
- ✅ Toast on success with "Open Editor" action

### 4. **Edit Qwirl Page Integration** (`app/(authenticated)/qwirls/primary/edit/page.tsx`)

- ✅ Added "Add from Library" button (📚 icon)
- ✅ Positioned next to "Add Poll" button
- ✅ Opens LibrarySlideOver on click
- ✅ Quick Add handler for instant addition
- ✅ Bulk Add handler for cart integration
- ✅ Event listener for "open-cart" custom event
- ✅ Toast notifications

---

## 🚧 Remaining Tasks

### 5. **Global Cart Indicator** (Not Implemented)

**Location**: App header/navigation  
**Requirements**:

- Cart icon with badge showing count
- Floating button (bottom-right) OR header icon
- Opens CartSlideOver on click
- Syncs with useQuestionCart state

**Suggested Implementation**:

```tsx
// components/layout/cart-button.tsx
"use client";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { useState } from "react";
import { CartSlideOver } from "@/components/question-bank/cart-slide-over";

export function GlobalCartButton({
  onAddAllToQwirl,
}: {
  onAddAllToQwirl?: (questions: CartQuestion[]) => Promise<void>;
}) {
  const { getCartCount } = useQuestionCart();
  const [showCart, setShowCart] = useState(false);
  const count = getCartCount();

  if (count === 0) return null; // Hide when empty

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowCart(true)}
        className="relative"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center font-medium">
          {count}
        </span>
      </Button>

      <CartSlideOver
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onAddAllToQwirl={onAddAllToQwirl}
      />
    </>
  );
}
```

**Add to**:

- `components/layout/app-sidebar.tsx` (in SidebarHeader)
- `components/layout/mobile-nav-bar.tsx` (if exists)
- `components/layout/page-layout.tsx` (header section)

---

### 6. **Question Library Page Updates** (Not Implemented)

**File**: `app/(public)/question-library/page.tsx`

**Requirements**:

- ✅ Already has QwirlSelectionProvider
- ⚠️ Need to replace with useQuestionCart
- ⚠️ Add floating cart button (bottom-right)
- ⚠️ Show "Selected #X" badge on cards
- ⚠️ Disable add when cart full
- ⚠️ Persist selections across page navigations

**Suggested Changes**:

```tsx
// In QuestionBankContent component
import { useQuestionCart } from "@/hooks/useQuestionCart";
import { GlobalCartButton } from "@/components/layout/cart-button";

// Replace QwirlSelectionContext with useQuestionCart
const { addQuestion, isInCart, canAddMore, getCartCount } = useQuestionCart();

// Add floating cart button
<div className="fixed bottom-6 right-6 z-50">
  <GlobalCartButton />
</div>

// Update QuestionCard usage
<QuestionCard
  question={question}
  showSelectButton={true}
  isSelected={isInCart(question.question_text)}
  onSelect={() => {
    if (canAddMore()) {
      addQuestion(question);
      toast.success("Added to cart");
    } else {
      toast.error("Cart is full (15/15)");
    }
  }}
/>
```

---

### 7. **Toast Notifications** (Partially Implemented)

**Status**: Implemented in LibrarySlideOver and CartSlideOver

**Still Needed**:

- ✅ Add to cart → Done
- ✅ Remove from cart → Done
- ✅ Clear cart → Done
- ✅ Bulk add to Qwirl → Done
- ⚠️ Undo functionality (requires state history)
- ⚠️ "Edit now" action after Quick Add

**Undo Implementation Suggestion**:

```tsx
// In hooks/useQuestionCart.ts
interface QuestionCartState {
  // ... existing
  history: CartQuestion[][]; // Add history stack
  undo: () => void;
}

// Implementation
undo: () => {
  const state = get();
  if (state.history.length > 0) {
    const previous = state.history[state.history.length - 1];
    set({
      items: previous,
      history: state.history.slice(0, -1),
    });
  }
};
```

---

### 8. **QuestionEditor Updates** (Not Implemented)

**File**: `components/qwirl/compact-question-card-editable.tsx` (or similar)

**Requirements**:

- Add `mode` prop: "single" | "bulk" | "library"
- Display microcopy label above editor
- Optional "Save to Library" toggle (admin only)

**Suggested Implementation**:

```tsx
interface CompactQuestionCardEditableProps {
  mode?: "single" | "bulk" | "library";
  // ... existing props
}

// In component
{
  mode !== "single" && (
    <div className="mb-3 p-2 rounded bg-muted/50 border border-primary/20">
      <p className="text-xs text-muted-foreground">
        <strong className="font-semibold">Editing a copy for this Qwirl</strong>
        {" — "}
        Changes will not update the public Library.
      </p>
    </div>
  );
}
```

---

## 📋 Integration Checklist

### EditQwirlPage

- [x] Add "Add from Library" button
- [x] LibrarySlideOver integration
- [x] CartSlideOver integration
- [x] Quick Add handler
- [x] Bulk Add handler
- [ ] Global cart button in header

### Question Library Page

- [ ] Replace QwirlSelectionContext with useQuestionCart
- [ ] Add floating cart button
- [ ] Show selected badges
- [ ] Enforce 15-question limit
- [ ] Persist cart across navigation

### Global Navigation

- [ ] Add cart icon to app sidebar
- [ ] Add cart icon to mobile nav
- [ ] Add cart icon to page header
- [ ] All icons open CartSlideOver

### QuestionEditor

- [ ] Add mode prop
- [ ] Display "Editing a copy" label
- [ ] Optional "Save to Library" toggle

---

## 🎨 Design Patterns Used

1. **Sheet vs Modal**: Used Sheet for better UX (slides from right, doesn't block entire screen)
2. **Drag-and-Drop**: @dnd-kit for accessible reordering
3. **Accordion**: Space-efficient inline editing
4. **Toast Actions**: Sonner with action buttons for undo/edit
5. **Custom Events**: Document events for cross-component communication
6. **LocalStorage Persistence**: Zustand persist middleware

---

## 🚀 Quick Setup Guide

1. **Install dependencies** (if not already):

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

2. **Add cart button to sidebar**:

```tsx
// In app-sidebar.tsx
import { GlobalCartButton } from "./cart-button";

<SidebarHeader>
  <ProfileHeader />
  <GlobalCartButton />
</SidebarHeader>;
```

3. **Update question-library page**:
   Replace QwirlSelectionProvider with useQuestionCart hook

4. **Test flow**:

- Open Edit Qwirl page
- Click "Add from Library"
- Add questions to cart
- Reorder and edit in cart
- Click "Add All to Qwirl"

---

## 📝 Additional Recommendations

### Performance

- Consider virtualization for large question lists (react-window)
- Debounce search already implemented ✅
- Infinite scroll already implemented ✅

### UX Improvements

- Add keyboard shortcuts (Cmd+K to open library)
- Add animation when items added to cart
- Show "X questions added from cart" progress indicator
- Add "Recently used" section in library

### Accessibility

- All components use semantic HTML
- Keyboard navigation supported via @dnd-kit
- ARIA labels on icon buttons
- Screen reader announcements for cart updates

---

## 🐛 Known Issues

1. **EditAndAdd** in LibrarySlideOver doesn't pre-fill AddPollDialog

   - Current: Just opens empty dialog
   - Fix: Pass question state to AddPollDialog

2. **Cart doesn't show in all pages**

   - Current: Only visible on Edit page
   - Fix: Add GlobalCartButton to layout

3. **No undo for individual actions**
   - Current: Only "Clear Cart" available
   - Fix: Implement history stack in useQuestionCart

---

## 📚 File Summary

**New Files Created**:

1. `hooks/useQuestionCart.ts` - Cart state management
2. `components/question-bank/library-slide-over.tsx` - Library browser
3. `components/question-bank/cart-slide-over.tsx` - Cart manager

**Modified Files**:

1. `app/(authenticated)/qwirls/primary/edit/page.tsx` - Added Library button & integration

**Files to Create** (Recommended):

1. `components/layout/cart-button.tsx` - Global cart button
2. `components/question-bank/question-card-with-cart.tsx` - Enhanced card with cart actions

---

This implementation provides a solid foundation for the cart flow. The remaining work is primarily UI integration (adding cart button globally) and migrating the question-library page from the old context to the new Zustand store.
