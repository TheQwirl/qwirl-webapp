# Onboarding Component

A comprehensive multi-step onboarding modal for new users with animations and interactive elements.

## Features

- **Multi-step flow**: Personal details → Category selection → Question swiping
- **Responsive design**: Works on mobile and desktop
- **Touch-friendly**: Swipe gestures on mobile, buttons on desktop
- **Animated transitions**: Smooth step transitions and card animations
- **API integration**: Automatically saves user data and selected questions
- **Progress tracking**: Visual progress indicator and step counter

## Components

### OnboardingModal

The main modal component that orchestrates the entire onboarding flow.

### OnboardingProvider

A convenience wrapper that automatically shows the onboarding modal for users who haven't completed it.

### Steps

1. **PersonalDetailsStep**: User profile information form
2. **CategorySelectionStep**: Interactive category selection with visual cards
3. **QuestionSwipeStep**: Tinder-like question swiping interface

## Usage

### Automatic (Recommended)

Wrap your authenticated layout with the OnboardingProvider:

```tsx
import { OnboardingProvider } from "@/components/onboarding";

export default function AuthenticatedLayout({ children }) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
```

### Manual Control

For more control over when the onboarding appears:

```tsx
import { useState, useEffect } from "react";
import { OnboardingModal } from "@/components/onboarding";
import { authStore } from "@/stores/useAuthStore";

function MyComponent() {
  const { user, isAuthenticated } = authStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !user.has_seen_onboarding) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated, user]);

  return (
    <OnboardingModal
      open={showOnboarding}
      onClose={() => setShowOnboarding(false)}
    />
  );
}
```

## Dependencies

- framer-motion (for animations)
- react-hook-form (for form handling)
- zod (for form validation)
- sonner (for toast notifications)

## API Integration

The component automatically integrates with:

- `PATCH /users/me` - Updates user profile and preferences
- `GET /question-bank/search` - Fetches questions based on selected categories
- `POST /qwirl/me/items` - Adds selected questions to user's Qwirl

## Behavior

1. Shows automatically for authenticated users who haven't seen onboarding
2. Saves progress at each step
3. Validates user input before proceeding
4. Gracefully handles API errors with user feedback
5. Updates the auth store with latest user data
6. Prevents modal from being dismissed accidentally (no backdrop click to close)
