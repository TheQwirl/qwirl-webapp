# User Socials Backend Implementation Guide

## Overview

This document outlines the backend requirements for the User Socials feature in Qwirl. Users can share up to 5 social media links with people who complete their Qwirl. Social links are saved permanently but can be toggled for visibility.

---

## Database Schema

### Recommended Approach: Separate Table

Create a new `user_socials` table to maintain separation of concerns and allow for scalability.

```sql
CREATE TABLE user_socials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one entry per platform per user
  UNIQUE(user_id, platform)
);

-- Index for faster queries
CREATE INDEX idx_user_socials_user_id ON user_socials(user_id);
CREATE INDEX idx_user_socials_visible ON user_socials(user_id, is_visible);
```

### Platform Values

Valid platform values (enum or constraint):

- `instagram`
- `twitter`
- `facebook`
- `linkedin`
- `youtube`
- `github`
- `website`
- `spotify`
- `discord`

---

## API Endpoints

### 1. Get User's Own Socials (Owner View)

**Endpoint:** `GET /api/users/me/socials`

**Description:** Retrieve all social links for the authenticated user, including both visible and hidden ones.

**Authentication:** Required (JWT/Session)

**Request:**

```typescript
// Headers
Authorization: Bearer<token>;
```

**Response:**

```typescript
{
  success: true,
  data: {
    socials: [
      {
        id: "uuid",
        platform: "instagram",
        url: "your_username",
        is_visible: true,
        created_at: "2025-10-29T10:00:00Z",
        updated_at: "2025-10-29T10:00:00Z"
      },
      {
        id: "uuid",
        platform: "twitter",
        url: "your_handle",
        is_visible: false,
        created_at: "2025-10-29T10:00:00Z",
        updated_at: "2025-10-29T10:00:00Z"
      }
      // ... more socials
    ]
  }
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Database error

**SQL Query:**

```sql
SELECT id, platform, url, is_visible, created_at, updated_at
FROM user_socials
WHERE user_id = $1
ORDER BY created_at ASC;
```

---

### 2. Update User Socials (Owner Only)

**Endpoint:** `POST /api/users/me/socials`

**Description:** Update social links and their visibility. This is an upsert operation - creates new entries or updates existing ones.

**Authentication:** Required (JWT/Session)

**Request:**

```typescript
{
  socials: [
    {
      platform: "instagram",
      url: "your_username",
      is_visible: true,
    },
    {
      platform: "twitter",
      url: "your_handle",
      is_visible: false,
    },
    // ... up to 9 platforms (5 visible max enforced by client)
  ];
}
```

**Validation Rules:**

- Maximum 5 socials with `is_visible: true`
- `platform` must be one of the valid enum values
- `url` must not be empty
- Maximum 9 total socials (all platforms)

**Response:**

```typescript
{
  success: true,
  message: "Social links updated successfully",
  data: {
    socials: [
      {
        id: "uuid",
        platform: "instagram",
        url: "your_username",
        is_visible: true,
        created_at: "2025-10-29T10:00:00Z",
        updated_at: "2025-10-29T11:30:00Z"
      }
      // ... all socials
    ]
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation errors (too many visible, invalid platform, empty URL)
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Database error

**Implementation Logic:**

```typescript
// Pseudo-code
async function updateUserSocials(userId: string, socials: SocialInput[]) {
  // 1. Validate visibility count
  const visibleCount = socials.filter((s) => s.is_visible).length;
  if (visibleCount > 5) {
    throw new Error("Maximum 5 socials can be visible");
  }

  // 2. Start transaction
  await db.transaction(async (trx) => {
    // 3. Upsert each social
    for (const social of socials) {
      await trx.query(
        `
        INSERT INTO user_socials (user_id, platform, url, is_visible, updated_at)
        VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, platform)
        DO UPDATE SET 
          url = EXCLUDED.url,
          is_visible = EXCLUDED.is_visible,
          updated_at = NOW()
      `,
        [userId, social.platform, social.url, social.is_visible]
      );
    }
  });

  // 4. Return updated socials
  return fetchUserSocials(userId);
}
```

---

### 3. Get Public Socials (Viewer - Completed Qwirl)

**Endpoint:** `GET /api/users/:userId/socials`

**Description:** Retrieve visible social links for a user. Only returns socials if the requesting user has completed the target user's Qwirl.

**Authentication:** Required (JWT/Session)

**Path Parameters:**

- `userId`: UUID of the Qwirl owner whose socials to retrieve

**Request:**

```typescript
// Headers
Authorization: Bearer<token>;

// URL
GET / api / users / abc123 - def456 / socials;
```

**Response (Completed Qwirl):**

```typescript
{
  success: true,
  data: {
    has_access: true,
    socials: [
      {
        platform: "instagram",
        url: "their_username"
      },
      {
        platform: "linkedin",
        url: "in/theirprofile"
      }
      // Only visible socials, max 5
    ]
  }
}
```

**Response (Not Completed):**

```typescript
{
  success: true,
  data: {
    has_access: false,
    socials: [],
    message: "Complete this user's Qwirl to view their social links"
  }
}
```

**Error Responses:**

- `401 Unauthorized`: User not authenticated
- `404 Not Found`: User doesn't exist
- `500 Internal Server Error`: Database error

**Implementation Logic:**

```typescript
async function getPublicSocials(viewerId: string, ownerId: string) {
  // 1. Check if viewer has completed owner's Qwirl
  const hasCompleted = await db.query(
    `
    SELECT EXISTS(
      SELECT 1 
      FROM qwirl_responses qr
      JOIN qwirls q ON qr.qwirl_id = q.id
      WHERE q.user_id = $1 
        AND qr.user_id = $2
        AND qr.status = 'completed'
    ) as completed
  `,
    [ownerId, viewerId]
  );

  if (!hasCompleted.rows[0].completed) {
    return {
      has_access: false,
      socials: [],
      message: "Complete this user's Qwirl to view their social links",
    };
  }

  // 2. Fetch visible socials
  const socials = await db.query(
    `
    SELECT platform, url
    FROM user_socials
    WHERE user_id = $1 AND is_visible = true
    ORDER BY created_at ASC
    LIMIT 5
  `,
    [ownerId]
  );

  return {
    has_access: true,
    socials: socials.rows,
  };
}
```

**SQL Query for Access Check:**

```sql
-- Check if viewer has completed owner's Qwirl
SELECT EXISTS(
  SELECT 1
  FROM qwirl_responses qr
  JOIN qwirls q ON qr.qwirl_id = q.id
  WHERE q.user_id = $1  -- owner's user_id
    AND qr.user_id = $2  -- viewer's user_id
    AND qr.status = 'completed'  -- or appropriate completion status
) as has_completed;

-- If true, fetch visible socials
SELECT platform, url
FROM user_socials
WHERE user_id = $1 AND is_visible = true
ORDER BY created_at ASC
LIMIT 5;
```

---

## Frontend Integration Points

### 1. Edit Page (Owner)

**File:** `app/(authenticated)/qwirls/primary/edit/page.tsx`

**Hook Required:**

```typescript
// Create: hooks/qwirl/useUserSocials.ts
const useUserSocials = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-socials"],
    queryFn: () => fetch("/api/users/me/socials").then((r) => r.json()),
  });

  const updateMutation = useMutation({
    mutationFn: (socials: SocialLink[]) =>
      fetch("/api/users/me/socials", {
        method: "POST",
        body: JSON.stringify({ socials }),
      }),
    onSuccess: () => queryClient.invalidateQueries(["user-socials"]),
  });

  return {
    socials: data?.data?.socials,
    isLoading,
    updateSocials: updateMutation.mutate,
  };
};
```

### 2. Completion View (Viewer)

**File:** `components/qwirl/completed-panel.tsx` or `QwirlCompletionCard`

**Component Required:**

```typescript
// Create: components/qwirl/user-socials-display.tsx
const UserSocialsDisplay = ({ userId }: { userId: string }) => {
  const { data } = useQuery({
    queryKey: ["public-socials", userId],
    queryFn: () => fetch(`/api/users/${userId}/socials`).then((r) => r.json()),
  });

  if (!data?.data?.has_access) {
    return null; // or locked message
  }

  return (
    <div>
      {data.data.socials.map((social) => (
        <a href={constructUrl(social)} target="_blank" rel="noopener">
          <Icon platform={social.platform} />
        </a>
      ))}
    </div>
  );
};
```

---

## Security Considerations

1. **Rate Limiting:** Implement rate limiting on POST endpoint (e.g., 10 updates per hour)
2. **URL Validation:** Sanitize and validate URLs to prevent XSS
3. **Access Control:** Strictly enforce completion check before revealing socials
4. **CSRF Protection:** Ensure CSRF tokens on POST requests
5. **Input Sanitization:** Validate platform enum and URL format

---

## Testing Checklist

### Unit Tests

- [ ] Validate maximum 5 visible socials
- [ ] Validate platform enum values
- [ ] Validate non-empty URLs
- [ ] Test upsert logic (create vs update)

### Integration Tests

- [ ] Owner can save socials
- [ ] Owner can toggle visibility without losing URLs
- [ ] Viewer with completed Qwirl sees visible socials
- [ ] Viewer without completion doesn't see socials
- [ ] Socials are returned in correct order

### Edge Cases

- [ ] User with no socials
- [ ] User with all socials hidden
- [ ] Concurrent updates (race conditions)
- [ ] Very long URLs (truncation/validation)
- [ ] Special characters in URLs

---

## Migration Plan

1. **Create Table:**

   ```sql
   -- Run migration to create user_socials table
   ```

2. **Deploy Backend:**

   - Add new API routes
   - Test with Postman/curl

3. **Deploy Frontend:**

   - Add EditableUserSocials component
   - Add UserSocialsDisplay component
   - Update completion flow

4. **Monitor:**
   - Check error rates
   - Monitor query performance
   - Gather user feedback

---

## Future Enhancements

- **Analytics:** Track which socials are most clicked
- **Custom Platforms:** Allow users to add custom social platforms
- **Ordering:** Let users reorder social links
- **Verification:** Badge for verified social accounts
- **Privacy Settings:** More granular control (show to friends only, etc.)
