# Qwirl Review vs Preview Button Implementation

## Overview

Implemented differentiation between "Preview" and "Review" buttons for qwirl owners based on context. When an owner views their qwirl on the Qwirl page, they see a "Review" button that activates review mode to go through their questions, rather than linking to a preview page.

## Context-Based Button Display

### Preview Mode (Home Page & Other Contexts)

When owner views their qwirl on the home page or other contexts where they're not actively viewing the qwirl:

- Shows "Preview" button
- Button is a **link** to `/qwirl/@{username}`
- Purpose: Navigate to the qwirl page to see how it looks to others

### Review Mode (Qwirl Page - Owner Viewing Their Own Qwirl)

When owner views their own qwirl on the Qwirl page (`/qwirl/@{username}` where username matches owner):

- Shows "Review" button
- Button is a **handler** that activates review mode
- Purpose: Go through the questions in their qwirl interactively
- Enables owner to review their own questions without answering

## Implementation Details

### 1. QwirlCover Component Updates

#### Added `onReview` Prop

```typescript
interface QwirlCoverProps {
  // ... other props
  onReview?: () => void; // Handler to activate review mode
  previewOrReview?: "preview" | "review"; // Determines which button to show
}
```

#### Updated Button Rendering Logic

```tsx
{
  !isIncomplete && variant === "owner" && (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {previewOrReview === "review" ? (
        // Review mode: Button with onClick handler
        <Button size="sm" variant="outline" onClick={onReview}>
          Review
        </Button>
      ) : (
        // Preview mode: Link to qwirl page
        <Link href={`/qwirl/${user?.username}`}>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </Link>
      )}
      <Link href="/qwirls/primary/insights">
        <Button size="sm">View Insights</Button>
      </Link>
    </div>
  );
}
```

### 2. QwirlStateRenderer Updates

#### Dynamic `previewOrReview` Prop

```tsx
<QwirlCover
  // ... other props
  onReview={startReview} // Pass the startReview handler
  previewOrReview={variant === "owner" ? "review" : "preview"}
  // When variant is "owner" (on qwirl page), show "Review" button
  // Otherwise show "Preview" button
/>
```

### 3. Review Mode Activation

The `startReview` handler (from `useQwirlLogic`):

```typescript
const startReview = useCallback(() => {
  setIsReviewMode(true);
  setIsAnsweringNew(false);
  setCurrentPosition(1); // Start from first question
}, [setIsReviewMode, setIsAnsweringNew, setCurrentPosition]);
```

## User Flow

### Scenario 1: Owner on Home Page

```
Home Page
  → Owner sees their qwirl cover
  → Buttons: "Preview" (link) + "View Insights" (link)
  → Click "Preview"
  → Navigate to /qwirl/@username
```

### Scenario 2: Owner on Their Qwirl Page

```
Qwirl Page (/qwirl/@username)
  → Owner sees their qwirl cover
  → variant = "owner" (user.id === currentUser.id)
  → previewOrReview = "review"
  → Buttons: "Review" (handler) + "View Insights" (link)
  → Click "Review"
  → Activates review mode (isReviewMode = true)
  → Shows interactive qwirl starting from position 1
  → Owner can navigate through their questions
  → No answer submission (review mode prevents saving)
```

### Scenario 3: Visitor Views Someone's Qwirl

```
Qwirl Page (/qwirl/@someuser)
  → Visitor sees qwirl cover
  → variant = "visitor"
  → previewOrReview = "preview" (doesn't matter, not shown to visitors)
  → Button: "Start Answering" or "Continue Answering"
  → Click button
  → Shows interactive qwirl for answering
```

## Button State Matrix

| Context    | User Type | Complete?     | Button 1         | Button 1 Action          | Button 2        |
| ---------- | --------- | ------------- | ---------------- | ------------------------ | --------------- |
| Home Page  | Owner     | ❌ Incomplete | "Complete Qwirl" | Link to editor           | -               |
| Home Page  | Owner     | ✅ Complete   | "Preview"        | Link to qwirl page       | "View Insights" |
| Qwirl Page | Owner     | ❌ Incomplete | "Complete Qwirl" | Link to editor           | -               |
| Qwirl Page | Owner     | ✅ Complete   | "Review"         | **Activate review mode** | "View Insights" |
| Qwirl Page | Visitor   | ✅ Complete   | "Start/Continue" | Start answering          | -               |
| Qwirl Page | Guest     | ✅ Complete   | "Sign In"        | Link to auth             | -               |

## Review Mode Features

When review mode is activated:

- ✅ Owner can navigate through all questions
- ✅ Owner can see their own answers (owner_answer field)
- ✅ Navigation arrows work (previous/next)
- ✅ Comments are visible but read-only
- ❌ Cannot submit new answers
- ❌ Cannot add/edit comments
- ❌ Skip button is disabled
- ❌ No completion tracking

## Files Modified

### 1. `components/qwirl/qwirl-cover.tsx`

- Added `onReview?: () => void` prop
- Updated owner button section to conditionally render:
  - **Review button** (with onClick handler) when `previewOrReview === "review"`
  - **Preview button** (with Link) when `previewOrReview === "preview"`

### 2. `components/qwirl/qwirl-respond/qwirl-state-renderer.tsx`

- Added `onReview={startReview}` prop to QwirlCover
- Set `previewOrReview={variant === "owner" ? "review" : "preview"}`
- This ensures owners on qwirl page see "Review" button

### 3. Related Files (No Changes Needed)

- `hooks/qwirl-response/useQwirlLogic.tsx` - Already has `startReview` handler
- `components/qwirl/qwirl-respond.tsx` - Already passes `startReview` to renderer
- `components/qwirl/qwirl-interactive.tsx` - Already handles review mode logic

## Benefits

1. **Clear Intent**: "Review" clearly indicates the owner will go through their questions
2. **No Navigation**: Button uses handler instead of navigation, smoother UX
3. **Context-Aware**: Different behavior based on where the cover is displayed
4. **Consistent**: Visitors still see "Start/Continue Answering" as before
5. **Flexible**: Easy to add more context-specific behaviors in the future

## Testing Scenarios

✅ **Home Page - Owner - Complete Qwirl**: Shows "Preview" button (link)
✅ **Qwirl Page - Owner - Complete Qwirl**: Shows "Review" button (activates review mode)
✅ **Qwirl Page - Owner - Incomplete Qwirl**: Shows "Complete Qwirl" button
✅ **Qwirl Page - Visitor - Complete Qwirl**: Shows "Start/Continue Answering" button
✅ **Qwirl Page - Guest - Complete Qwirl**: Shows "Sign In to Answer" button
✅ **Review Mode Activated**: Interactive qwirl shows in read-only mode from position 1

## Related Documentation

- See `QWIRL_COVER_FLOW_IMPLEMENTATION.md` for complete cover display logic
- See `useQwirlLogic.tsx` for review mode state management
