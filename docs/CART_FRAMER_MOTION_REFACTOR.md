# Cart UI Refactoring - Framer Motion Implementation

## Overview

Refactored the cart slide-over to separate concerns and replace Accordion with framer-motion animations for better control and cleaner code.

## Changes Made

### 1. Created New Component: `sortable-cart-item.tsx`

**Location**: `components/question-bank/sortable-cart-item.tsx`

**Purpose**: Isolated reusable component for individual cart items with drag-and-drop and collapse/expand functionality.

**Key Features**:

- ✅ Drag handle with `@dnd-kit/sortable`
- ✅ Framer Motion collapse/expand animation
- ✅ Auto-save on collapse (only if changes detected)
- ✅ Chevron rotation animation
- ✅ Fixed flexbox layout (drag handle → number → question → chevron → delete)
- ✅ Clean, maintainable code structure

**Props Interface**:

```typescript
interface SortableCartItemProps {
  question: CartQuestion;
  index: number;
  onUpdate: (
    id: string,
    data: {
      question_text: string;
      options: string[];
      owner_answer_index: number;
    }
  ) => void;
  onRemove: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}
```

**Animation Details**:

- Uses `AnimatePresence` for smooth enter/exit
- Spring animation: `{ type: "spring", bounce: 0.2, duration: 0.4 }`
- Height animates from 0 to "auto"
- Opacity fades in/out
- Chevron rotates 90 degrees when expanded

### 2. Simplified `cart-slide-over.tsx`

**Removed**:

- ❌ Accordion component (and all related imports)
- ❌ AccordionItem, AccordionTrigger, AccordionContent
- ❌ Badge component (moved to SortableCartItem)
- ❌ GripVertical icon (moved to SortableCartItem)
- ❌ CompactQuestionCardEditable imports (moved to SortableCartItem)
- ❌ CSS utilities import
- ❌ cn() function usage
- ❌ Inline SortableCartItem function definition

**Updated**:

- ✅ State management: `openItemId` instead of `activeAccordion`
- ✅ Clean imports - only what's needed
- ✅ Simplified item rendering - just map over items
- ✅ Added `handleToggle` function for cleaner state management

**New State**:

```typescript
const [openItemId, setOpenItemId] = useState<string | undefined>(undefined);
```

**Toggle Handler**:

```typescript
const handleToggle = (questionId: string) => {
  setOpenItemId(openItemId === questionId ? undefined : questionId);
};
```

### 3. Improved Component Structure

**Before** (Monolithic):

```
cart-slide-over.tsx
├── Imports (15+ dependencies)
├── CartSlideOverProps interface
├── SortableCartItemProps interface
├── SortableCartItem function (140 lines)
│   ├── Drag-drop logic
│   ├── Auto-save logic
│   ├── Layout JSX
│   └── Accordion logic
└── CartSlideOver function (180 lines)
    └── Cart management
```

**After** (Separated):

```
sortable-cart-item.tsx (175 lines)
├── Focused imports
├── SortableCartItemProps interface
└── SortableCartItem component
    ├── Drag-drop logic
    ├── Auto-save logic
    ├── Framer Motion animation
    └── Layout JSX

cart-slide-over.tsx (230 lines)
├── Minimal imports
├── CartSlideOverProps interface
└── CartSlideOver component
    ├── Cart state management
    ├── Drag-drop orchestration
    └── Item rendering
```

## Benefits

### 1. Better Separation of Concerns

- Cart item logic isolated from cart management
- Easier to test individual components
- Reusable SortableCartItem for other features

### 2. Cleaner Code

- No more nested Accordion components
- Simple div wrapper instead of complex Accordion state
- Removed accordion trigger's built-in behavior that was "annoying"

### 3. Better Animation Control

- Framer Motion provides smoother animations
- Full control over animation timing and easing
- Chevron rotation synchronized with collapse/expand

### 4. Improved Maintainability

- Each file has a single responsibility
- Easier to find and fix bugs
- Simpler mental model for developers

### 5. Better Layout Control

- No fighting with AccordionTrigger's default styles
- Direct control over flexbox layout
- Easier to adjust spacing and alignment

## Animation Comparison

### Before (Accordion):

- Uses Radix UI Accordion (limited customization)
- Animation tied to Accordion's internal state
- Chevron hidden with CSS trick: `[&[data-state=open]>div]:hidden`
- Less control over timing

### After (Framer Motion):

- Full control over animation parameters
- Smooth spring animation with bounce
- Explicit chevron rotation animation
- Better performance with AnimatePresence

## Usage Example

```typescript
<SortableCartItem
  question={cartQuestion}
  index={0}
  onUpdate={handleUpdate}
  onRemove={handleRemove}
  isOpen={openItemId === cartQuestion.id}
  onToggle={() => handleToggle(cartQuestion.id)}
/>
```

## Technical Details

### Auto-Save Implementation

```typescript
const handleToggle = async () => {
  if (isOpen) {
    const data = await editorRef.current?.submit();
    if (data) {
      const hasChanges = /* deep comparison */;
      if (hasChanges) {
        onUpdate(question.id, data);
        toast.success("Changes saved");
      }
    }
  }
  onToggle();
};
```

### Drag-to-Collapse

```typescript
const handleDragStart = () => {
  setOpenItemId(undefined); // Collapse all items
};
```

### Framer Motion Setup

```typescript
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

## Migration Notes

**No Breaking Changes**: The refactoring is internal - the public API of CartSlideOver remains unchanged.

**Files Modified**:

1. `components/question-bank/cart-slide-over.tsx` - Simplified
2. NEW: `components/question-bank/sortable-cart-item.tsx` - Created

**Dependencies**:

- Added: None (framer-motion already in project)
- Removed: None (Accordion still used elsewhere)

## Performance Improvements

1. **Smaller Bundle**: Individual item component can be code-split
2. **Better Re-renders**: Isolated state means less re-rendering
3. **Smoother Animations**: Framer Motion's optimized animations
4. **Memory**: Single open item tracked vs entire Accordion state

## Future Enhancements

1. Add enter/exit animations for adding/removing items
2. Stagger animations when opening multiple items
3. Gesture-based swipe to delete
4. Keyboard navigation improvements
5. Accessibility improvements (ARIA labels)

## Testing Checklist

- [x] Drag and drop still works
- [x] Auto-save on collapse works
- [x] Items collapse when drag starts
- [x] Delete button works
- [x] Layout remains consistent
- [x] Animations are smooth
- [x] No compilation errors
- [x] Chevron rotates correctly
- [x] Question text wraps properly
- [x] Badges display correctly

## Code Quality Metrics

**Before**:

- Lines in cart-slide-over.tsx: ~415 lines
- Components in file: 2 (SortableCartItem + CartSlideOver)
- Import statements: 20+
- Complexity: High

**After**:

- Lines in cart-slide-over.tsx: ~230 lines (-44%)
- Lines in sortable-cart-item.tsx: ~175 lines (new)
- Components per file: 1 (single responsibility)
- Import statements per file: ~10-15
- Complexity: Medium (better organized)

Total lines increased slightly, but complexity decreased significantly due to better organization.
