# Onboarding Tour Debugging Guide

## How to Test the Complete Flow

### Step 1: Reset Onboarding State

Open browser console and run:

```javascript
// Reset everything
localStorage.removeItem("qwirl-onboarding-storage");

// Or just reset the tour
const store = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
store.state.hasSeenInteractiveTour = false;
store.state.shouldStartTour = true;
localStorage.setItem("qwirl-onboarding-storage", JSON.stringify(store));
```

### Step 2: Check User Setup Status

In browser console:

```javascript
// Check if user has completed setup
const auth = JSON.parse(localStorage.getItem("auth-storage"));
console.log(
  "User has_seen_onboarding:",
  auth?.state?.user?.has_seen_onboarding
);
```

### Step 3: Trigger Tour Manually

If you want to manually trigger the tour for testing:

```javascript
// Method 1: Using the store
const onboardingStore = window.useOnboardingStore?.getState?.();
if (onboardingStore) {
  onboardingStore.setShouldStartTour(true);
  onboardingStore.startTour();
}

// Method 2: Direct localStorage manipulation
const store = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
store.state.shouldStartTour = true;
store.state.tourActive = true;
store.state.hasSeenInteractiveTour = false;
localStorage.setItem("qwirl-onboarding-storage", JSON.stringify(store));
window.location.reload();
```

## Debug Checklist

When tour doesn't start, check these in order:

### 1. User Authentication

```javascript
// Check if user is logged in
const auth = JSON.parse(localStorage.getItem("auth-storage"));
console.log("User:", auth?.state?.user);
console.log("Is authenticated:", auth?.state?.isAuthenticated);
```

### 2. User Setup Completion

```javascript
// Check if user completed setup
const auth = JSON.parse(localStorage.getItem("auth-storage"));
console.log("has_seen_onboarding:", auth?.state?.user?.has_seen_onboarding);
// Should be true
```

### 3. Tour State

```javascript
// Check tour state
const onboarding = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
console.log(
  "hasSeenInteractiveTour:",
  onboarding?.state?.hasSeenInteractiveTour
);
console.log("shouldStartTour:", onboarding?.state?.shouldStartTour);
console.log("tourActive:", onboarding?.state?.tourActive);
// hasSeenInteractiveTour should be false
// shouldStartTour should be true (after user setup)
// tourActive should become true when tour starts
```

### 4. Current Page

```javascript
console.log("Current pathname:", window.location.pathname);
// Should be: /qwirls/primary/edit
```

### 5. Console Logs

Look for these debug logs in console:

- "User setup complete, user data synced:"
- "Set shouldStartTour to true"
- "Redirecting to edit page..."
- "InteractiveOnboarding - Checking conditions:"
- "Should start tour:"
- "useOnboardingStore: Starting tour"
- "Starting tour..."

## Common Issues

### Issue 1: Tour doesn't start after user setup

**Cause:** `shouldStartTour` flag not being set
**Solution:**

```javascript
const store = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
store.state.shouldStartTour = true;
localStorage.setItem("qwirl-onboarding-storage", JSON.stringify(store));
window.location.href = "/qwirls/primary/edit";
```

### Issue 2: Tour was already seen

**Cause:** `hasSeenInteractiveTour` is true
**Solution:**

```javascript
const store = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
store.state.hasSeenInteractiveTour = false;
store.state.shouldStartTour = true;
localStorage.setItem("qwirl-onboarding-storage", JSON.stringify(store));
window.location.reload();
```

### Issue 3: User hasn't completed setup

**Cause:** `has_seen_onboarding` is false in user object
**Solution:** Complete the user setup flow (personal details + categories) first

### Issue 4: Wrong page

**Cause:** Not on `/qwirls/primary/edit`
**Solution:** Navigate to the edit page

### Issue 5: Elements not found

**Cause:** Target element IDs missing
**Solution:** Check that these IDs exist on the page:

- `#onboarding-welcome`
- `#add-poll-button`
- `#add-from-library-button`
- `#qwirl-polls-container`
- `#qwirl-poll-card-0` (if polls exist)

## Force Start Tour (Emergency)

If nothing else works:

```javascript
// Nuclear option - force start
localStorage.clear();
// Then complete user setup again
// Or set minimal required state:
localStorage.setItem(
  "qwirl-onboarding-storage",
  JSON.stringify({
    state: {
      hasSeenSetup: false,
      hasSeenInteractiveTour: false,
      currentTourStep: 0,
      tourActive: true,
      shouldStartTour: true,
    },
    version: 0,
  })
);
window.location.href = "/qwirls/primary/edit";
```

## Testing Sequence

1. **Fresh User Flow:**

   - Sign up new user
   - Complete personal details
   - Select categories
   - Should redirect to edit page
   - Tour should start automatically

2. **Returning User (Hasn't Seen Tour):**
   - Login as existing user who completed setup
   - Navigate to edit page
   - Tour should NOT start (needs shouldStartTour flag)
3. **Force Tour for Testing:**
   ```javascript
   const store = JSON.parse(localStorage.getItem("qwirl-onboarding-storage"));
   store.state.hasSeenInteractiveTour = false;
   store.state.shouldStartTour = true;
   localStorage.setItem("qwirl-onboarding-storage", JSON.stringify(store));
   window.location.href = "/qwirls/primary/edit";
   ```

## Monitoring Tour State

Add this to browser console for live monitoring:

```javascript
setInterval(() => {
  const onboarding = JSON.parse(
    localStorage.getItem("qwirl-onboarding-storage")
  );
  console.table({
    hasSeenInteractiveTour: onboarding?.state?.hasSeenInteractiveTour,
    shouldStartTour: onboarding?.state?.shouldStartTour,
    tourActive: onboarding?.state?.tourActive,
    currentTourStep: onboarding?.state?.currentTourStep,
  });
}, 2000);
```

## Expected Console Output (Successful Flow)

When completing user setup:

```
User setup complete, user data synced: {has_seen_onboarding: true, ...}
useOnboardingStore: setShouldStartTour true
Set shouldStartTour to true
Redirecting to edit page...
```

When arriving at edit page:

```
InteractiveOnboarding - Checking conditions: {
  user: true,
  has_seen_onboarding: true,
  hasSeenInteractiveTour: false,
  shouldStartTour: true,
  pathname: "/qwirls/primary/edit",
  tourActive: false
}
Should start tour: true
useOnboardingStore: Starting tour
Starting tour...
```
