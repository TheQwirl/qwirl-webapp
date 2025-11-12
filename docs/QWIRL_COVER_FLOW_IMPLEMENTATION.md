# 🧩 Qwirl Cover Display Logic Implementation

## Overview

This document describes the comprehensive flow for displaying the Qwirl Cover component based on different contexts and user states.

## Decision Tree

### Step 1 — Determine if the Qwirl is Complete

```
IF Qwirl is NOT complete (pollsLength < MIN_QWIRL_POLLS):
    IF the Qwirl belongs to the current user (variant === "owner"):
        → Render "Incomplete Qwirl Cover"
        → Show message: "Complete your Qwirl to start receiving responses"
        → Show button: "Complete Qwirl" (links to /qwirls/primary/edit)
    ELSE
        → Render "Incomplete Qwirl Cover"
        → Show message: "This Qwirl is still in progress. Do you want to be notified when it's complete?"
        → Show button: "Notify Me"
```

### Step 2 — Qwirl is Complete (Owner View)

```
IF Qwirl is complete AND variant === "owner":
    → Render "Complete Qwirl Cover"
    → Show two buttons:
        - "Preview" or "Review" (based on previewOrReview prop)
        - "View Insights"
```

### Step 3 — Qwirl is Complete (Guest View)

```
IF Qwirl is complete AND variant === "guest":
    → Render "Complete Qwirl Cover"
    → Show button: "Sign In to Answer"
```

### Step 4 — Qwirl is Complete (Visitor - Logged In User)

```
IF Qwirl is complete AND variant === "visitor":
    IF user has NOT started (answeredCount === 0):
        → Render "Complete Qwirl Cover"
        → Show button: "Start Answering"

    ELSE IF user has started but NOT completed (answeredCount > 0 && answeredCount < totalCount):
        → Render "Complete Qwirl Cover"
        → Show progress message: "You've answered X out of Y questions"
        → Show button: "Continue Answering"

        IF there are new unanswered questions (hasNewQuestions === true):
            → Update message: "The Qwirl has been updated with new questions! You've answered X out of Y questions"

    ELSE IF user has completed all polls:
        IF there are NEW unanswered questions (Qwirl was updated):
            → Render "Complete Qwirl Cover"
            → Show message: "The Qwirl has been updated with new questions!"
            → Show button: "Continue Answering"
        ELSE
            → Render "Completed Panel Component" (handled by QwirlStateRenderer)
```

## Component Props

### QwirlCover Component

```typescript
interface QwirlCoverProps {
  qwirlCoverData: {
    background_image: string | null | undefined;
    title: string | null | undefined;
    name: string | null | undefined;
    description: string | null | undefined;
    totalPolls?: number;
  };
  user: {
    name?: string | null;
    username: string;
    avatar?: string | null;
    categories?: string[];
  } | null;
  onButtonClick?: () => void; // Handler for "Start/Continue Answering"
  onNotifyMe?: () => void; // Handler for "Notify Me"
  variant?: "guest" | "owner" | "visitor";
  isIncomplete?: boolean; // Qwirl has < MIN_QWIRL_POLLS
  answeredCount?: number; // Number of questions answered
  totalCount?: number; // Total number of questions
  hasNewQuestions?: boolean; // Owner added new questions after completion
  previewOrReview?: "preview" | "review";
  actions?: React.ReactNode; // Custom actions override
}
```

## State Calculations (QwirlStateRenderer)

```typescript
// Determine user variant
const variant = getUserVariant(); // "guest" | "owner" | "visitor"

// Check if qwirl is incomplete
const isIncompleteQwirl = pollsLength < CONSTANTS.MIN_QWIRL_POLLS;

// Check if there are new unanswered questions
const hasNewUnansweredQuestions = unansweredCount > 0 && isCompleted;

// Calculate answered count
const answeredCount = pollsLength - unansweredCount;

// Determine if user has started
const hasStarted = answeredCount > 0;
```

## UI States Summary

| Qwirl State                  | User Relation | UI Shown         | Key Buttons / Info                                       |
| ---------------------------- | ------------- | ---------------- | -------------------------------------------------------- |
| Not complete                 | Owner         | Incomplete Cover | "Complete Qwirl"                                         |
| Not complete                 | Visitor       | Incomplete Cover | "Notify me"                                              |
| Not complete                 | Guest         | Incomplete Cover | "Notify me"                                              |
| Complete                     | Owner         | Complete Cover   | "Preview/Review", "View Insights"                        |
| Complete                     | Guest         | Complete Cover   | "Sign In to Answer"                                      |
| Complete, not started        | Visitor       | Complete Cover   | "Start Answering"                                        |
| Complete, partially answered | Visitor       | Complete Cover   | "Continue Answering", progress count                     |
| Complete, updated with new   | Visitor       | Complete Cover   | "Continue Answering", "updated" info, new question count |
| Completed, fully answered    | Visitor       | Completed Panel  | View All Answers, Show Owner Info, Wavelength, Stats     |

## Visual Indicators

### Incomplete Qwirl

- Background image: Grayscale with 50% opacity
- Border: 4px dashed gray
- Overlay text: "Incomplete" in large gray text

### Progress Information

- Displayed below description when user has started
- Format: "You've answered X out of Y questions"
- Special case: "The Qwirl has been updated with new questions! You've answered X out of Y questions"

## Button States

### Owner Actions

- **Complete Qwirl**: Links to `/qwirls/primary/edit`
- **Preview/Review**: Links to `/qwirl/@{username}`
- **View Insights**: Links to `/qwirls/primary/insights`

### Visitor Actions

- **Start Answering**: Triggers `onButtonClick()` - shows interactive qwirl
- **Continue Answering**: Triggers `onButtonClick()` - resumes from last position
- **Notify Me**: Triggers `onNotifyMe()` - subscribes to completion notification

### Guest Actions

- **Sign In to Answer**: Links to `/auth`

## Conditional Rendering Logic

The `QwirlStateRenderer` determines what to show:

1. **Show QwirlCover when:**

   - Qwirl is incomplete (`isIncompleteQwirl`)
   - User hasn't started (`!showInteractive`)
   - There are new unanswered questions and not in review/answering mode

2. **Show Completed Panel when:**

   - User has completed all polls
   - Not in review mode
   - Not answering new questions

3. **Show Interactive Qwirl when:**
   - None of the above (user is actively answering)

## Implementation Files

### Key Components

- **QwirlCover** (`components/qwirl/qwirl-cover.tsx`)

  - Main cover component with all variant logic
  - Handles button display based on props

- **QwirlStateRenderer** (`components/qwirl/qwirl-respond/qwirl-state-renderer.tsx`)

  - Orchestrates which component to show
  - Calculates state and passes props to QwirlCover

- **QwirlRespond** (`components/qwirl/qwirl-respond.tsx`)
  - Top-level component that uses QwirlStateRenderer

### Key Hooks

- **useQwirlLogic** (`hooks/qwirl-response/useQwirlLogic.tsx`)

  - Manages all qwirl response logic
  - Provides state and handlers to components

- **useSessionState** (`hooks/qwirl-response/useSessionState.ts`)
  - Tracks current position, completion status
  - Manages review and answering modes

## Constants

```typescript
// constants/qwirl-respond.ts
export const CONSTANTS = {
  MAX_SKIPS: 5,
  MIN_QWIRL_POLLS: 10,
  ANIMATION_DURATION: 0.3,
};
```

## Edge Cases Handled

1. **Guest trying to answer**: Shows "Sign In to Answer" button
2. **Owner viewing their own qwirl**: Shows preview and insights buttons
3. **Visitor with partial progress**: Shows exact count of answered questions
4. **Qwirl updated after completion**: Special messaging about new questions
5. **Incomplete qwirl**: Clear messaging with appropriate action buttons
6. **No questions yet**: Handled by MIN_QWIRL_POLLS check

## Testing Scenarios

1. ✅ Owner views incomplete qwirl → "Complete Qwirl" button
2. ✅ Visitor views incomplete qwirl → "Notify Me" button
3. ✅ Guest views complete qwirl → "Sign In to Answer" button
4. ✅ Owner views complete qwirl → "Preview" + "View Insights" buttons
5. ✅ Visitor, not started → "Start Answering" button
6. ✅ Visitor, partially answered → "Continue Answering" + progress
7. ✅ Visitor, completed → Shows Completed Panel
8. ✅ Visitor, completed + new questions → "Continue Answering" + new questions message

## Future Enhancements

- [ ] Add analytics tracking for button clicks
- [ ] Implement actual "Notify Me" functionality with email/push notifications
- [ ] Add social sharing for completed qwirls
- [ ] Allow customization of cover description by qwirl owner
- [ ] Add badges for completion milestones
