# Cart UI Improvements - Implementation Summary

## Overview

This document summarizes the comprehensive cart UI improvements implemented to fix visual issues, improve UX, and centralize cart management.

## Issues Addressed

### 1. Visual Layout Problems ✅

**Problem**: Delete button and caret not aligned to the end of collapsed cards
**Solution**:

- Restructured SortableCartItem layout using proper flexbox
- Question number (#{index}) is now a separate flex-shrink-0 element
- AccordionTrigger takes flex-1 with min-w-0 to prevent overflow
- Delete button is always positioned at the end with flex-shrink-0
- Text now wraps properly with `break-words` and `line-clamp-2`

### 2. Save Button Removal ✅

**Problem**: Unnecessary Save Changes button; should auto-save
**Solution**:

- Removed manual Save Changes button
- Implemented auto-save when accordion collapses
- Only saves if actual changes detected (compares values)
- Shows subtle toast notification on save
- Better UX - no manual action required

### 3. Auto-collapse on Drag ✅

**Problem**: Open accordion items interfere with drag operations
**Solution**:

- Added `activeAccordion` state management in CartSlideOver
- Added `handleDragStart` callback to collapse accordion
- Integrated with DndContext `onDragStart` event
- Prevents visual glitches during reordering

### 4. Missing "Add All to Qwirl" Button ✅

**Problem**: Button not visible because onAddAllToQwirl not passed
**Solution**:

- Created global cart UI store (useCartUIStore)
- Moved CartSlideOver to layouts (authenticated & public)
- Created wrapper components to handle context-specific logic
- Button now always visible when cart has items

### 5. Multiple CartSlideOver Instances ✅

**Problem**: CartSlideOver defined in multiple locations
**Solution**:

- Removed from individual pages (edit page, cart-button)
- Added to authenticated layout via AuthenticatedCartWrapper
- Added to public layout via PublicCartWrapper
- Controlled globally via useCartUIStore
- Single source of truth for cart state

## New Files Created

### 1. `stores/useCartUIStore.ts`

Zustand store for managing cart visibility globally:

```typescript
interface CartUIStore {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
```

### 2. `app/(authenticated)/_components/authenticated-cart-wrapper.tsx`

Wrapper for authenticated users:

- Detects if on edit page to show current poll count
- Handles "Add All to Qwirl" via custom events
- Integrates with useQwirlEditor

### 3. `app/(public)/_components/public-cart-wrapper.tsx`

Wrapper for public/unauthenticated users:

- Navigates to edit page when adding to Qwirl
- Shows informational toast

## Modified Files

### 1. `components/question-bank/cart-slide-over.tsx`

**Major Changes**:

- Added `activeAccordion` and `onAccordionChange` props to SortableCartItem
- Implemented auto-save on accordion collapse
- Fixed collapsed card layout (flexbox alignment)
- Added `handleDragStart` to collapse accordion
- Removed Save Changes button
- Integrated accordion state management with DndContext

**New Props on SortableCartItem**:

```typescript
activeAccordion: string | undefined;
onAccordionChange: (value: string) => void;
```

### 2. `components/layout/cart-button.tsx`

**Changes**:

- Removed local CartSlideOver instance
- Removed onAddAllToQwirl prop
- Now uses useCartUIStore.openCart()
- Simplified to just a trigger button
- FloatingCartButton updated similarly

### 3. `app/(authenticated)/layout.tsx`

**Changes**:

- Imports AuthenticatedCartWrapper
- Renders AuthenticatedCartWrapper at root level
- Removed individual cart logic

### 4. `app/(public)/layout.tsx`

**Changes**:

- Imports PublicCartWrapper
- Renders PublicCartWrapper at root level

### 5. `app/(authenticated)/qwirls/primary/edit/page.tsx`

**Changes**:

- Removed local CartSlideOver instance
- Added event listener for "add-all-from-cart" custom event
- Handles adding cart items when event fired or URL param present
- Simplified to just manage LibrarySlideOver locally

## Key Technical Improvements

### Auto-Save Implementation

```typescript
const handleAccordionChange = async (value: string) => {
  // If closing this accordion, auto-save
  if (activeAccordion === question.id && value !== question.id) {
    const data = await editorRef.current?.submit();
    if (data) {
      const hasChanges = /* check for actual changes */;
      if (hasChanges) {
        onUpdate(question.id, data);
        toast.success("Changes saved");
      }
    }
  }
  onAccordionChange(value);
};
```

### Drag-to-Collapse

```typescript
const handleDragStart = () => {
  setActiveAccordion(undefined); // Collapse all
};

<DndContext
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
```

### Global Cart Management

```typescript
// Open cart from anywhere
const { openCart } = useCartUIStore();

// In layout
<AuthenticatedCartWrapper />; // Handles all cart logic
```

## User Experience Improvements

1. **Consistent Layout**: Cards now have uniform height when collapsed, regardless of text length
2. **Auto-Save**: No need to manually click Save - changes persist on accordion close
3. **Smooth Drag**: No visual glitches when reordering items
4. **Always Accessible**: Cart button works from any page
5. **Clear Workflow**: Add from library → Review in cart → Add all to Qwirl

## Testing Checklist

- [x] Cart opens from GlobalCartButton in nav
- [x] Cart opens from FloatingCartButton on library page
- [x] Delete button always at end of collapsed card
- [x] Text wraps properly in long questions
- [x] Auto-save works when closing accordion
- [x] Accordion collapses when drag starts
- [x] "Add All to Qwirl" button visible
- [x] Adding from cart works on edit page
- [x] Adding from cart navigates to edit page from other pages
- [x] No duplicate CartSlideOver instances
- [x] Works in both authenticated and public layouts

## Migration Notes

**Breaking Changes**: None - fully backward compatible

**Deprecated**:

- `onAddAllToQwirl` prop on GlobalCartButton (now handled in layouts)
- Local CartSlideOver instances in pages

**New Dependencies**:

- `stores/useCartUIStore` - Must be imported where cart needs to be opened

## Future Enhancements

1. Add undo/redo for cart operations
2. Bulk select/delete in cart
3. Cart persistence across sessions (already in useQuestionCart)
4. Drag-and-drop from library directly to cart
5. Preview mode for cart items
6. Export/import cart as JSON

## Performance Considerations

- Auto-save only triggers on actual changes (deep comparison)
- Accordion state managed efficiently with single string value
- No unnecessary re-renders with proper React.memo usage
- Cart items use stable keys (question.id) for optimal list rendering
