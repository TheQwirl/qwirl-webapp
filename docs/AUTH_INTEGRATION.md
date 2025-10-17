# Auth Store Integration Guide

This document explains how the unified authentication system works across both authenticated and public routes in the Qwirl webapp.

## Overview

The solution provides a unified authentication experience using a single `authStore` (Zustand) that works across:

- **Authenticated routes** (`/feed`, `/profile`, `/settings`) - Protected routes requiring login
- **Public routes** (`/qwirl/*`) - Routes accessible by both authenticated and unauthenticated users

## Key Components

### 1. AuthStore (`/stores/useAuthStore.ts`)

Central state management for user authentication:

```typescript
interface AuthState {
  user: MyUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: MyUser | null) => void; // New method for direct user setting
}
```

### 2. PublicUserProvider (`/app/(public)/_components/public-user-provider.tsx`)

Client component that hydrates the auth store with server-fetched user data:

```typescript
export function PublicUserProvider({
  initialUser,
  children,
}: PublicUserProviderProps) {
  useUserHydration(initialUser);
  return <>{children}</>;
}
```

### 3. useUserSync Hook (`/hooks/useUserSync.ts`)

Utility hooks for syncing user data:

```typescript
// Hydrate store with server data (used in layouts)
export function useUserHydration(initialUser: MyUser | null);

// Sync user data when it changes (used in components)
export function useUserSync();
```

## How It Works

### Public Routes (e.g., `/qwirl/[username]`)

1. **Server-side**: Layout fetches user data using access token (if available)
2. **Client-side**: `PublicUserProvider` hydrates `authStore` with server data
3. **Components**: Access user state via `authStore` hooks

```typescript
// In public layout (server component)
const userData = accessToken
  ? await serverFetchClient.GET("/api/v1/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  : null;

// Wrap children with provider
<PublicUserProvider initialUser={userData}>
  <PublicNav />
  {children}
</PublicUserProvider>;
```

### Authenticated Routes (e.g., `/feed`)

1. **Client-side**: Layout calls `checkSession()` on mount
2. **Store**: Makes API call to `/api/me` and updates state
3. **Components**: Access user state via `authStore` hooks

```typescript
// In authenticated layout (client component)
useEffect(() => {
  checkSession();
}, []);
```

### Middleware Enhancement

Updated to handle public routes gracefully:

- **Public routes**: Attempts token refresh but continues as guest if failed
- **Protected routes**: Redirects to login if authentication fails
- **Token refresh**: Automatic refresh for expired tokens

## Usage Examples

### Accessing User in Components

```typescript
// Any component (client-side)
import { authStore } from "@/stores/useAuthStore";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = authStore();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <GuestView />;
  return <AuthenticatedView user={user} />;
}
```

### Updating User Data

```typescript
// In components that modify user data (e.g., profile update, avatar upload)
import { useUserSync } from "@/hooks/useUserSync";

function ProfileUpdateComponent() {
  const { syncUser, updateUserField } = useUserSync();

  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    // Update backend
    await updateAvatarAPI(newAvatarUrl);
    // Sync with store
    updateUserField("avatar", newAvatarUrl);
  };

  const handleProfileUpdate = async (updatedUser: MyUser) => {
    // Update backend
    await updateProfileAPI(updatedUser);
    // Sync entire user object
    syncUser(updatedUser);
  };
}
```

### Navigation Component

```typescript
// PublicNav.tsx
import { authStore } from "@/stores/useAuthStore";

function PublicNav() {
  const { user, isAuthenticated, isLoading } = authStore();

  return (
    <nav>{isAuthenticated ? <UserAvatar user={user} /> : <SignInButton />}</nav>
  );
}
```

## Benefits

1. **Unified State**: Single source of truth for user data across all routes
2. **Server-Side Hydration**: Fresh user data on page loads via server-side fetching
3. **No Prop Drilling**: Components access user state directly from store
4. **Graceful Degradation**: Public routes work for both authenticated and guest users
5. **Real-time Sync**: User changes immediately reflect across the application
6. **Token Management**: Automatic token refresh handled by middleware

## Migration Notes

- **Remove user props**: Components no longer need user passed as props
- **Use authStore**: Replace direct user prop usage with `authStore()` hooks
- **Update forms**: Use `useUserSync()` in components that modify user data
- **Server components**: Server-side user fetching only in layouts, not individual components

## Security Considerations

- **Tokens only in cookies**: User objects are fetched fresh, not stored in cookies
- **Automatic refresh**: Expired tokens are refreshed transparently
- **Server-side validation**: All user data is validated server-side before storage
- **HTTPS only**: Secure cookies in production environment

This architecture ensures secure, efficient, and maintainable user authentication across your entire application.
