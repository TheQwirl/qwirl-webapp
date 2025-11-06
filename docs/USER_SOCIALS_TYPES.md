# User Socials - Type Definitions

This document provides TypeScript type definitions and interfaces for the User Socials feature.

## Core Types

### SocialPlatform

```typescript
export type SocialPlatform =
  | "instagram"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "github"
  | "website"
  | "spotify"
  | "discord";
```

### SocialLink (Full)

Used by the owner when managing their socials.

```typescript
export interface SocialLink {
  id?: string; // UUID from database (optional for new entries)
  platform: SocialPlatform; // Type of social platform
  url: string; // User's profile URL/handle
  is_visible: boolean; // Whether to show to others
}
```

### PublicSocialLink

Used when displaying socials to others (no visibility flag or ID).

```typescript
export interface PublicSocialLink {
  platform: SocialPlatform;
  url: string;
}
```

## API Response Types

### Owner Socials Response

```typescript
interface SocialsResponse {
  success: boolean;
  data: {
    socials: SocialLink[];
  };
}
```

### Public Socials Response

```typescript
interface PublicSocialsResponse {
  success: boolean;
  data: {
    has_access: boolean;
    socials: PublicSocialLink[];
    message?: string;
  };
}
```

### Update Request

```typescript
interface UpdateSocialsRequest {
  socials: SocialLink[];
}
```

## Component Props

### EditableUserSocials

```typescript
// No props - uses useUserSocials hook internally
const EditableUserSocials: React.FC = () => { ... }
```

### UserSocialsDisplay

```typescript
interface UserSocialsDisplayProps {
  userId: string; // User whose socials to display
  title?: string; // Card title (default: "Connect")
  compact?: boolean; // Use compact styling (default: false)
}
```

## Hook Return Types

### useUserSocials

```typescript
interface UseUserSocialsReturn {
  socials: SocialLink[]; // User's socials
  isLoading: boolean; // Loading state
  error: Error | null; // Error if any
  updateSocials: (socials: SocialLink[]) => Promise<SocialLink[]>;
  isUpdating: boolean; // Saving state
}
```

### usePublicSocials

```typescript
interface UsePublicSocialsReturn {
  hasAccess: boolean; // Whether viewer can see socials
  socials: PublicSocialLink[]; // Visible socials (if has access)
  message?: string; // Message if no access
  isLoading: boolean; // Loading state
  error: Error | null; // Error if any
}
```

## Platform Configuration

```typescript
interface PlatformConfig {
  id: SocialPlatform;
  label: string; // Display name
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string; // Input placeholder
  prefix: string; // URL prefix for display
  getUrl?: (url: string) => string; // Full URL builder (for display component)
  color?: string; // Tailwind hover color classes
}
```

## Database Schema (TypeScript representation)

```typescript
interface UserSocialRecord {
  id: string; // UUID
  user_id: string; // Foreign key to users table
  platform: SocialPlatform; // Platform enum
  url: string; // User's handle/URL
  is_visible: boolean; // Visibility flag
  created_at: Date; // Creation timestamp
  updated_at: Date; // Last update timestamp
}
```

## Usage Examples

### Owner View (Edit Page)

```typescript
import EditableUserSocials from "@/components/qwirl/editable-user-socials";

function EditPage() {
  return (
    <div>
      <EditableUserSocials />
    </div>
  );
}
```

### Viewer Display (Completion Page)

```typescript
import UserSocialsDisplay from "@/components/qwirl/user-socials-display";

function CompletionPage({ qwirlOwnerId }: { qwirlOwnerId: string }) {
  return (
    <div>
      <UserSocialsDisplay
        userId={qwirlOwnerId}
        title="Connect with them"
        compact={false}
      />
    </div>
  );
}
```

### Direct Hook Usage

```typescript
import { useUserSocials } from "@/hooks/qwirl/useUserSocials";

function CustomComponent() {
  const { socials, updateSocials, isLoading } = useUserSocials();

  const handleToggle = async (platform: SocialPlatform) => {
    const updated = socials.map((s) =>
      s.platform === platform ? { ...s, is_visible: !s.is_visible } : s
    );
    await updateSocials(updated);
  };

  return <div>...</div>;
}
```

## Validation Constants

```typescript
const VALIDATION = {
  MAX_VISIBLE_SOCIALS: 5,
  MAX_TOTAL_SOCIALS: 9,
  REQUIRED_FIELDS: ["platform", "url", "is_visible"],
  MIN_URL_LENGTH: 1,
  MAX_URL_LENGTH: 255,
} as const;
```

## Error Types

```typescript
interface SocialError {
  field?: "platform" | "url" | "visibility";
  message: string;
  code: "INVALID_PLATFORM" | "EMPTY_URL" | "TOO_MANY_VISIBLE" | "NETWORK_ERROR";
}
```
