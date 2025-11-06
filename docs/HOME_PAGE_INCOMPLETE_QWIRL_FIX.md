# Home Page Qwirl Incomplete State Fix

## Issue

On the home page, when a qwirl is incomplete (less than 10 polls), the owner was seeing "Preview" and "View Insights" buttons instead of the "Complete Qwirl" button that should link to the editor.

## Root Cause

The `QwirlOverviewSection` component was not calculating or passing the `isIncomplete` prop to the `QwirlCover` component. Without this information, the `QwirlCover` component defaulted to treating the qwirl as complete, showing the standard owner buttons.

### Before (Problematic)

```tsx
<QwirlCover
  qwirlCoverData={{...}}
  user={{...}}
  variant="owner"
  // ❌ Missing isIncomplete prop
  className="h-full"
/>
```

Without the `isIncomplete` prop, the QwirlCover component's logic would:

1. See `variant="owner"`
2. See `isIncomplete=false` (default value)
3. Show "Preview" and "View Insights" buttons (for complete qwirls)

## Solution

Added logic to calculate if the qwirl is incomplete and pass it to the `QwirlCover` component.

### After (Fixed)

```tsx
// Calculate if qwirl is incomplete
const isIncomplete = (totalPolls ?? 0) < CONSTANTS.MIN_QWIRL_POLLS;

<QwirlCover
  qwirlCoverData={{...}}
  user={{...}}
  variant="owner"
  isIncomplete={isIncomplete}  // ✅ Now properly passed
  className="h-full"
/>
```

## Changes Made

### File: `app/(authenticated)/home/_components/qwirl-overview-section.tsx`

1. **Added Import**:

   ```tsx
   import { CONSTANTS } from "@/constants/qwirl-respond";
   ```

2. **Added Calculation** (Line 40):

   ```tsx
   const isIncomplete = (totalPolls ?? 0) < CONSTANTS.MIN_QWIRL_POLLS;
   ```

3. **Passed Prop to QwirlCover** (Line 63):
   ```tsx
   isIncomplete = { isIncomplete };
   ```

## Expected Behavior Now

### When Qwirl is Incomplete (< 10 polls)

- ✅ Shows "Complete Qwirl" button
- ✅ Button links to `/qwirls/primary/edit`
- ✅ Message: "Complete your Qwirl to start receiving responses"
- ✅ Cover has grayscale/dashed border styling
- ✅ "Incomplete" overlay text on background image

### When Qwirl is Complete (≥ 10 polls)

- ✅ Shows "Preview" and "View Insights" buttons
- ✅ Preview links to `/qwirl/@{username}`
- ✅ View Insights links to `/qwirls/primary/insights`
- ✅ Normal styling without incomplete indicators

## Logic Flow

```
IF totalPolls < MIN_QWIRL_POLLS (10):
    isIncomplete = true

    IF variant === "owner":
        → Show "Complete Qwirl" button
        → Link to /qwirls/primary/edit
        → Show incomplete styling

ELSE (totalPolls >= 10):
    isIncomplete = false

    IF variant === "owner":
        → Show "Preview" and "View Insights" buttons
        → Normal styling
```

## Constants Used

```typescript
// constants/qwirl-respond.ts
CONSTANTS.MIN_QWIRL_POLLS = 10;
```

## Related Components

### QwirlCover Props

```typescript
interface QwirlCoverProps {
  variant?: "guest" | "owner" | "visitor";
  isIncomplete?: boolean; // Key prop for determining button state
  // ... other props
}
```

### QwirlCover Button Logic (excerpt)

```tsx
{!isIncomplete && variant === "owner" && (
  // Shows Preview + View Insights
)}

{isIncomplete && variant === "owner" && (
  // Shows Complete Qwirl button
)}
```

## Testing Scenarios

### Owner on Home Page

✅ **With < 10 polls**: Shows "Complete Qwirl" button
✅ **With ≥ 10 polls**: Shows "Preview" + "View Insights" buttons

### Data Flow

```
HomePage
  → QwirlOverviewSection (receives totalPolls from API)
    → Calculates isIncomplete
    → QwirlCover (receives isIncomplete prop)
      → Renders appropriate buttons based on variant + isIncomplete
```

## Props Passed to QwirlCover

```tsx
qwirlCoverData={{
  background_image: qwirlCover?.background_image,
  description: qwirlCover?.description,
  title: qwirlCover?.title ?? "Your Qwirl",
  totalPolls,                    // Used for display
  name: qwirlCover?.name,
}}
user={{
  name: user.name,
  username: user.username,
  avatar: user.avatar,
  categories: user.categories || [],
}}
variant="owner"                  // Determines which buttons to show
isIncomplete={isIncomplete}      // ✅ NEW: Determines complete vs incomplete state
```

## Impact

This fix ensures that:

1. Owners are properly guided to complete their qwirls
2. The UI accurately reflects the qwirl's completion state
3. Users aren't shown options (Preview/Insights) that aren't meaningful for incomplete qwirls
4. The flow matches the comprehensive qwirl cover display logic

## Related Documentation

- See `QWIRL_COVER_FLOW_IMPLEMENTATION.md` for complete qwirl cover logic
- See `constants/qwirl-respond.ts` for MIN_QWIRL_POLLS constant
