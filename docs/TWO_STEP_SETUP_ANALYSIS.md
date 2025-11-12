# User Setup Flow Analysis - Two-Step Process

## Current Implementation is CORRECT ✅

### The Two Steps

Your user setup modal correctly handles **TWO steps**:

1. **Personal Details Step** (`personal-details`)

   - User enters: name, username, phone
   - Clicking "Next" validates and saves these fields
   - Then navigates to categories step

2. **Categories Step** (`categories`)
   - User selects up to 5 interest categories
   - Clicking "Finish" saves categories
   - Then sets `has_seen_onboarding: true`
   - **This is when tour trigger logic runs**

### Why This is Correct

The tour should only start **after BOTH steps are complete**, which is exactly what happens:

```typescript
case "categories":
  // Save categories
  await updateUserMutation.mutateAsync({
    body: { categories: selectedCategories },
  });

  // Mark onboarding as complete & trigger tour
  await completeOnboardingMutation.mutateAsync({
    body: { has_seen_onboarding: true },
  });
  // Tour trigger logic is in completeOnboardingMutation.onSuccess
  break;
```

### The Flow (Correct)

```
User Signs Up
     ↓
UserSetupModal Opens (can be on ANY page)
     ↓
Step 1: Personal Details
  - Enter name, username, phone
  - Click "Next"
  - Saves to backend
     ↓
Step 2: Categories
  - Select interests
  - Click "Finish"
  - Saves categories
  - Sets has_seen_onboarding: true
  - Checks if on edit page
     ↓
  If YES → Start tour directly (setTimeout 1500ms)
  If NO  → Navigate to edit page (setTimeout 800ms)
```

## The Actual Problem

Your implementation handles the two-step flow correctly. The issue is that **even when all conditions are met, the tour doesn't display**.

From your logs:

```
Should start tour: true  ✅
🎉 Starting tour NOW!   ✅
showOnborda changed to: true  ✅
But... tour doesn't appear  ❌
```

This suggests the problem is with **Onborda rendering**, not your logic.

## Diagnostic Checklist

When you complete setup, you should see these logs in order:

### Step 1 Complete:

```
✅ Validation passed
✅ Updating personal details...
✅ Details saved
✅ Moving to categories step
```

### Step 2 Complete:

```
✅ Updating categories...
✅ User setup complete, user data synced: {has_seen_onboarding: true, ...}
✅ useOnboardingStore: setShouldStartTour true
✅ Set shouldStartTour to true
✅ Is already on edit page: true/false
```

### If on edit page:

```
✅ Already on edit page, starting tour directly...
✅ (wait 1.5 seconds)
✅ InteractiveOnboarding - Checking conditions: {...}
✅ Should start tour: true
✅ Tour conditions met! Starting in 1.5s...
✅ Target elements check: {welcomeEl: true, addPollBtn: true, libraryBtn: true}
✅ 🎉 Starting tour NOW!
✅ useOnboardingStore: Starting tour
✅ showOnborda state changed to: true
✅ Rendering Onborda with showOnborda: true
```

### If NOT on edit page:

```
✅ Redirecting to edit page...
✅ (page navigates)
✅ InteractiveOnboarding - Checking conditions: {...}
✅ Should start tour: true
✅ (same as above from here)
```

## Potential Issues

If you see all the logs but tour doesn't show, check:

### 1. Target Element Missing

```javascript
// Run in console when tour should be showing
console.log({
  welcome: document.querySelector("#onboarding-welcome"),
  addPoll: document.querySelector("#add-poll-button"),
  library: document.querySelector("#add-from-library-button"),
  container: document.querySelector("#qwirl-polls-container"),
});
```

If any are `null`, Onborda can't show that step.

### 2. Onborda Props Issue

Check if Onborda is receiving correct props:

```javascript
// The steps array
console.log(onboardingSteps);

// Should see:
// [{tour: "qwirl-editor-tour", steps: [...]}]
```

### 3. Z-index / CSS Issue

The tour might be rendering but hidden behind other elements. Check:

```javascript
// Find Onborda elements
document.querySelectorAll("[data-onborda]");
```

### 4. React Strict Mode

If in development with Strict Mode, effects run twice. This might cause timing issues.

## Testing Commands

### Force tour to show (emergency):

```javascript
const onboarding = window.useOnboardingStore?.getState?.();
if (onboarding) {
  onboarding.setShouldStartTour(true);
  onboarding.setHasSeenInteractiveTour(false);
  setTimeout(() => {
    onboarding.startTour();
    window.location.reload();
  }, 100);
}
```

### Check all state:

```javascript
// Onboarding state
const ob = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
console.log("Onboarding state:", ob.state);

// Auth state
const auth = JSON.parse(localStorage.getItem("auth-storage"));
console.log("User state:", auth.state.user);
console.log("has_seen_onboarding:", auth.state.user.has_seen_onboarding);
```

## Conclusion

✅ Your two-step setup flow is implemented correctly
✅ Tour trigger logic fires after BOTH steps complete
✅ The issue is likely with Onborda rendering, not the flow

**Next step**: Try completing the setup again with console open and share ALL the logs from clicking "Finish" onwards. This will tell us exactly where it breaks.
