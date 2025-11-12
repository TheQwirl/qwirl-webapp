# Qwirl Completion Display Fix

## Issue

When a qwirl session was completed (`session_status === "completed"`), the QwirlCover was still showing with "Continue Answering" button instead of showing the Completed Panel with results and wavelength.

## Root Cause

The `shouldShowCover` logic was checking `!showInteractive` without also checking if the session was completed. This meant:

```typescript
// BEFORE (Problematic)
const shouldShowCover =
  isIncompleteQwirl ||
  !showInteractive || // ❌ This was true even when isCompleted === true
  (hasNewUnansweredQuestions && !isReviewMode && !isAnsweringNew);
```

When a user completed the qwirl and then navigated back or refreshed, `showInteractive` would be `false` (initial state), causing `shouldShowCover` to be `true` even though `isCompleted` was `true`. This prevented the completion panel from showing.

## Solution

Added an additional check to ensure we don't show the cover when the session is completed:

```typescript
// AFTER (Fixed)
const shouldShowCover =
  isIncompleteQwirl ||
  (!showInteractive && !isCompleted) || // ✅ Only show cover if NOT completed
  (hasNewUnansweredQuestions && !isReviewMode && !isAnsweringNew);
```

## Logic Flow (Fixed)

### Scenario 1: User Completes Qwirl

1. User answers all questions
2. `isCompleted` becomes `true`
3. `showInteractive` may be `false` (on page refresh/reload)
4. `shouldShowCover` evaluates to `false` (because of `!isCompleted` check)
5. ✅ Completion Panel is shown (lines 145-159)

### Scenario 2: User Has Not Started

1. User visits qwirl for first time
2. `isCompleted` is `false`
3. `showInteractive` is `false`
4. `shouldShowCover` evaluates to `true` (because of `!showInteractive && !isCompleted`)
5. ✅ QwirlCover is shown with "Start Answering" button

### Scenario 3: User Is In Progress

1. User has answered some questions
2. `isCompleted` is `false`
3. `showInteractive` is `false` (on page refresh)
4. `shouldShowCover` evaluates to `true`
5. ✅ QwirlCover is shown with "Continue Answering" and progress count

### Scenario 4: New Questions Added After Completion

1. User completed all questions
2. Owner adds new questions
3. `isCompleted` is `true`
4. `hasNewUnansweredQuestions` is `true`
5. `shouldShowCover` evaluates to `true` (from third condition)
6. ✅ QwirlCover is shown with message about new questions

## Updated Display Logic

```
IF isIncompleteQwirl:
    → Show QwirlCover (Condition 1)

ELSE IF !showInteractive AND !isCompleted:
    → Show QwirlCover (Condition 2)

ELSE IF hasNewUnansweredQuestions AND !isReviewMode AND !isAnsweringNew:
    → Show QwirlCover (Condition 3)

ELSE IF isCompleted AND !isReviewMode AND !isAnsweringNew:
    → Show Completed Panel

ELSE:
    → Show Interactive Qwirl
```

## Testing Scenarios

✅ **Completed + Refresh**: Shows Completed Panel
✅ **Completed + New Questions**: Shows QwirlCover with update message
✅ **Not Started**: Shows QwirlCover with "Start Answering"
✅ **In Progress + Refresh**: Shows QwirlCover with "Continue Answering"
✅ **Incomplete Qwirl**: Shows QwirlCover with appropriate action
✅ **Active Answering**: Shows Interactive Qwirl

## Files Changed

- `components/qwirl/qwirl-respond/qwirl-state-renderer.tsx`
  - Line 103-106: Updated `shouldShowCover` condition
  - Line 109-117: Added `shouldShowCover` to console.log for debugging

## Prevention

This fix ensures that the completion state takes precedence over the interactive state when determining what to display. The `isCompleted` check prevents showing the cover when the user should see their results.

## Related Constants

```typescript
// constants/qwirl-respond.ts
MIN_QWIRL_POLLS: 10; // Minimum polls required for a complete qwirl
```

## Priority Logic

The display priority is now (in order):

1. **Loading State**: Show skeleton
2. **Should Show Cover**: Show QwirlCover (with completion check)
3. **Is Completed**: Show Completion Panel
4. **Default**: Show Interactive Qwirl
