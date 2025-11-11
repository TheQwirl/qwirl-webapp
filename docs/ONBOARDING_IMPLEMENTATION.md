# Onboarding Implementation with Onborda

## Overview

This document describes the implementation of the two-phase onboarding system in Qwirl:

1. **User Setup Phase**: Personal details and category selection
2. **Interactive Tour Phase**: Product walkthrough using Onborda

## Architecture

### Phase 1: User Setup

Components handle initial user configuration after signup.

#### Files Created/Modified:

- **`components/onboarding/user-setup-modal.tsx`** (renamed from `onboarding-modal.tsx`)
  - Handles personal details (name, username, phone)
  - Category selection (up to 5 interests)
  - Redirects to edit page upon completion
- **`components/onboarding/user-setup-provider.tsx`** (renamed from `onboarding-provider.tsx`)
  - Wraps the app and shows user setup modal when needed
  - Checks `user.has_seen_onboarding` flag

### Phase 2: Interactive Tour

Uses Onborda library for interactive product walkthrough.

#### New Files Created:

**1. State Management**

- **`stores/useOnboardingStore.ts`**
  - Zustand store with persistence
  - Tracks: `hasSeenSetup`, `hasSeenInteractiveTour`, `tourActive`, `currentTourStep`
  - Actions: `startTour()`, `endTour()`, `resetOnboarding()`

**2. Tour Configuration**

- **`lib/onboarding/steps.tsx`**
  - Defines 6 tour steps:
    1. Welcome message
    2. Add Poll button
    3. Add from Library button
    4. Qwirl polls container
    5. Managing polls (delete/edit)
    6. Completion message
  - Each step has icon, title, content, selector, side, and pointer styling

**3. Custom Card Component**

- **`components/onboarding/onborda-card.tsx`**
  - Styled with shadcn/ui components
  - Shows progress bar and step counter
  - Next/Back navigation buttons
  - Smooth animations with framer-motion

**4. Tour Provider**

- **`components/onboarding/interactive-onboarding-provider.tsx`**
  - Wraps Onborda with configuration
  - Auto-starts tour when:
    - User is authenticated
    - User has completed setup (`has_seen_onboarding: true`)
    - User hasn't seen interactive tour
    - User is on `/qwirls/primary/edit` page
  - 500ms delay ensures page is loaded

**5. Barrel Export**

- **`components/onboarding/index.ts`**
  - Clean exports for all onboarding components

#### Modified Files:

**1. Edit Page Target Elements**

- **`app/(authenticated)/qwirls/primary/edit/page.tsx`**
  - Added IDs for tour targeting:
    - `#onboarding-welcome` - Welcome section
    - `#add-poll-button` - Add Poll button
    - `#add-from-library-button` - Library button
    - `#qwirl-polls-container` - Polls list container

**2. Poll Card IDs**

- **`components/qwirl/vertical-edit-view.tsx`**
  - Passes `id` prop to each card: `qwirl-poll-card-${index}`
- **`components/qwirl/sortable-qwirl-card.tsx`**
  - Accepts and applies `id` prop to wrapper div

**3. Layout Integration**

- **`app/(authenticated)/layout.tsx`**
  - Nested provider structure:
    ```tsx
    <UserSetupProvider>
      <InteractiveOnboardingProvider>{children}</InteractiveOnboardingProvider>
    </UserSetupProvider>
    ```

**4. Tailwind Configuration**

- **`tailwind.config.ts`**
  - Added Onborda node_modules path to content array for proper styling

## User Flow

### New User Experience:

1. **Sign Up** → User creates account
2. **User Setup Modal** → Personal details + category selection
3. **Redirect** → Navigates to `/qwirls/primary/edit`
4. **Interactive Tour** → Onborda tour auto-starts after 500ms
5. **Tour Steps**:
   - Welcome and introduction
   - Learn about Add Poll button
   - Learn about Add from Library button
   - Understand where polls appear
   - Learn about managing polls (edit/delete)
   - Completion message

### Returning User Experience:

- If `has_seen_onboarding: false` → Shows user setup
- If `has_seen_onboarding: true` and `hasSeenInteractiveTour: false` → Shows tour when visiting edit page
- If both completed → Normal experience

## Key Features

### Smart Triggering

- Tour only shows on edit page, not everywhere
- Waits for user setup completion
- Persists state across sessions
- No tour interruption during normal usage

### Customizable Tour

- All steps defined in `lib/onboarding/steps.tsx`
- Easy to add/remove/modify steps
- Supports icons, rich content, and positioning
- Pointer highlighting with configurable padding/radius

### Styled with Qwirl Design System

- Uses shadcn/ui components
- Matches app theme and colors
- Smooth animations with framer-motion
- Progress tracking with visual feedback

### State Persistence

- Uses Zustand with localStorage persistence
- Survives page refreshes and sessions
- Can be reset for testing: `useOnboardingStore.getState().resetOnboarding()`

## Testing the Flow

### Manual Testing Steps:

1. Create new user account or reset onboarding state
2. Complete user setup (personal details + categories)
3. Should redirect to `/qwirls/primary/edit`
4. Tour should auto-start after 500ms
5. Navigate through all 6 steps
6. Verify each step highlights correct element
7. Complete tour - should mark as seen

### Reset for Testing:

```javascript
// In browser console
useOnboardingStore.getState().resetOnboarding();
// Or reset just the tour
useOnboardingStore.getState().setHasSeenInteractiveTour(false);
```

## Future Enhancements

### Potential Improvements:

1. **Multiple Tours**: Create tours for different features
2. **Conditional Steps**: Skip steps based on user actions
3. **Analytics**: Track tour completion rates
4. **Tooltips**: Add persistent tooltips for complex features
5. **Video Integration**: Embed video tutorials in tour steps
6. **Contextual Help**: Show relevant tour steps when user seems stuck
7. **Keyboard Navigation**: Support keyboard shortcuts for tour navigation

### Additional Tour Ideas:

- **Profile Tour**: Guide through profile customization
- **Social Features Tour**: Explain following, sharing, etc.
- **Advanced Features**: Question bank filters, cart functionality
- **Settings Tour**: Guide through privacy and account settings

## Troubleshooting

### Tour Not Starting:

- Check `user.has_seen_onboarding` is `true`
- Verify on `/qwirls/primary/edit` page
- Check `hasSeenInteractiveTour` in store
- Look for console errors

### Elements Not Highlighting:

- Verify IDs exist on target elements
- Check selector matches exactly
- Ensure element is visible when tour starts
- Check z-index conflicts

### Tour State Issues:

- Clear localStorage: `localStorage.removeItem('qwirl-onboarding-storage')`
- Reset store: `useOnboardingStore.getState().resetOnboarding()`
- Check browser console for errors

## Dependencies

- **onborda**: ^1.2.5 (already installed)
- **framer-motion**: ^11.15.0 (existing)
- **zustand**: ^5.0.3 (existing)
- **shadcn/ui**: All UI components (existing)

## Files Summary

### New Files:

- `stores/useOnboardingStore.ts`
- `lib/onboarding/steps.tsx`
- `components/onboarding/onborda-card.tsx`
- `components/onboarding/interactive-onboarding-provider.tsx`

### Renamed Files:

- `onboarding-modal.tsx` → `user-setup-modal.tsx`
- `onboarding-provider.tsx` → `user-setup-provider.tsx`

### Modified Files:

- `components/onboarding/index.ts`
- `app/(authenticated)/layout.tsx`
- `app/(authenticated)/qwirls/primary/edit/page.tsx`
- `components/qwirl/vertical-edit-view.tsx`
- `components/qwirl/sortable-qwirl-card.tsx`
- `tailwind.config.ts`

## Notes

- Onborda package is configured but waiting for user interaction on edit page
- Tour steps are designed to guide through core features: adding and managing questions
- The implementation is non-intrusive and respects user's navigation
- All state is persisted across sessions for better UX
