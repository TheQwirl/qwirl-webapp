# Backend Endpoint Implementation Request

## Endpoint Specification: Recent Activity Feed

### Overview

Create a new FastAPI endpoint that returns a unified activity timeline showing both:

1. **Incoming interactions**: People who answered the current user's Qwirl
2. **Outgoing interactions**: Qwirls that the current user has answered

This endpoint powers the "Recent Activity" section on the Home/Dashboard page.

---

## Endpoint Details

### Route

```python
GET /api/v1/users/me/recent-activity
```

### Authentication

- **Required**: Yes (authenticated user via JWT token)
- Uses existing authentication middleware

### Query Parameters

| Parameter | Type    | Required | Default | Description                                                                |
| --------- | ------- | -------- | ------- | -------------------------------------------------------------------------- |
| `limit`   | integer | No       | 10      | Maximum number of activities to return (max: 50)                           |
| `skip`    | integer | No       | 0       | Number of activities to skip for pagination                                |
| `type`    | string  | No       | "all"   | Filter by activity type: "all", "qwirl_answered", "user_answered_my_qwirl" |

---

## Response Schema

### Success Response (200 OK)

```python
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class ActivityOwner(BaseModel):
    """Owner of a Qwirl that the user answered"""
    id: int
    username: str
    name: Optional[str]
    avatar: Optional[str]

class ActivityQwirl(BaseModel):
    """Details about a Qwirl the user answered"""
    id: int
    title: str
    background_image: Optional[str]
    owner: ActivityOwner

class ActivityResponder(BaseModel):
    """Details about someone who answered the user's Qwirl"""
    id: int
    username: str
    name: Optional[str]
    avatar: Optional[str]
    session_status: Literal["completed", "in_progress", "abandoned"]
    wavelength: Optional[float]  # Only present if status == "completed"
    response_count: int  # Number of polls answered
    total_items: int  # Total polls in the Qwirl

class Activity(BaseModel):
    """A single activity item"""
    id: int  # Can be session_id or a composite identifier
    type: Literal["qwirl_answered", "user_answered_my_qwirl"]
    timestamp: datetime  # ISO 8601 format

    # Present only when type == "qwirl_answered"
    qwirl: Optional[ActivityQwirl] = None

    # Present only when type == "user_answered_my_qwirl"
    responder: Optional[ActivityResponder] = None

class RecentActivityResponse(BaseModel):
    """Response containing activity timeline"""
    activities: List[Activity]
    total_count: int
    has_more: bool

    class Config:
        json_schema_extra = {
            "example": {
                "activities": [
                    {
                        "id": 123,
                        "type": "user_answered_my_qwirl",
                        "timestamp": "2025-10-20T10:30:00Z",
                        "responder": {
                            "id": 456,
                            "username": "sarah_smith",
                            "name": "Sarah Smith",
                            "avatar": "https://example.com/avatar.jpg",
                            "session_status": "completed",
                            "wavelength": 87.5,
                            "response_count": 15,
                            "total_items": 15
                        }
                    },
                    {
                        "id": 789,
                        "type": "qwirl_answered",
                        "timestamp": "2025-10-20T08:15:00Z",
                        "qwirl": {
                            "id": 101,
                            "title": "Getting to Know Me",
                            "background_image": "https://example.com/bg.jpg",
                            "owner": {
                                "id": 202,
                                "username": "john_doe",
                                "name": "John Doe",
                                "avatar": "https://example.com/john.jpg"
                            }
                        }
                    }
                ],
                "total_count": 45,
                "has_more": True
            }
        }
```

---

## Implementation Logic

### SQL Queries Needed

#### 1. Get "user_answered_my_qwirl" activities

```sql
-- Get people who answered the current user's primary Qwirl
SELECT
    qrs.id as session_id,
    qrs.started_at as timestamp,
    qrs.status as session_status,
    qrs.wavelength,
    COUNT(qrir.id) as response_count,
    u.id as responder_id,
    u.username,
    u.name,
    u.avatar,
    q.item_count as total_items
FROM qwirl_response_sessions qrs
JOIN users u ON qrs.user_id = u.id
JOIN qwirls q ON qrs.qwirl_id = q.id
LEFT JOIN qwirl_item_responses qrir ON qrir.session_id = qrs.id
WHERE q.user_id = :current_user_id  -- Current user's Qwirl
  AND qrs.user_id != :current_user_id  -- Exclude self
  AND (:type_filter = 'all' OR :type_filter = 'user_answered_my_qwirl')
GROUP BY qrs.id, u.id, q.item_count
```

#### 2. Get "qwirl_answered" activities

```sql
-- Get Qwirls the current user has answered
SELECT
    qrs.id as session_id,
    qrs.started_at as timestamp,
    q.id as qwirl_id,
    q.title as qwirl_title,
    q.background_image,
    owner.id as owner_id,
    owner.username as owner_username,
    owner.name as owner_name,
    owner.avatar as owner_avatar
FROM qwirl_response_sessions qrs
JOIN qwirls q ON qrs.qwirl_id = q.id
JOIN users owner ON q.user_id = owner.id
WHERE qrs.user_id = :current_user_id  -- Current user answered
  AND q.user_id != :current_user_id  -- Not their own Qwirl
  AND (:type_filter = 'all' OR :type_filter = 'qwirl_answered')
```

#### 3. Merge and Sort

```python
# Combine both result sets
all_activities = []

# Add "user_answered_my_qwirl" activities
for row in incoming_responses:
    all_activities.append({
        "id": row.session_id,
        "type": "user_answered_my_qwirl",
        "timestamp": row.timestamp,
        "responder": {
            "id": row.responder_id,
            "username": row.username,
            "name": row.name,
            "avatar": row.avatar,
            "session_status": row.session_status,
            "wavelength": row.wavelength if row.session_status == "completed" else None,
            "response_count": row.response_count,
            "total_items": row.total_items
        }
    })

# Add "qwirl_answered" activities
for row in outgoing_responses:
    all_activities.append({
        "id": row.session_id,
        "type": "qwirl_answered",
        "timestamp": row.timestamp,
        "qwirl": {
            "id": row.qwirl_id,
            "title": row.qwirl_title,
            "background_image": row.background_image,
            "owner": {
                "id": row.owner_id,
                "username": row.owner_username,
                "name": row.owner_name,
                "avatar": row.owner_avatar
            }
        }
    })

# Sort by timestamp descending (most recent first)
all_activities.sort(key=lambda x: x["timestamp"], reverse=True)

# Apply pagination
total_count = len(all_activities)
paginated = all_activities[skip : skip + limit]
has_more = (skip + limit) < total_count

return RecentActivityResponse(
    activities=paginated,
    total_count=total_count,
    has_more=has_more
)
```

---

## Example FastAPI Router Code

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Literal, Optional

from app.database import get_db
from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me/recent-activity", response_model=RecentActivityResponse)
async def get_recent_activity(
    limit: int = Query(default=10, ge=1, le=50, description="Max activities to return"),
    skip: int = Query(default=0, ge=0, description="Number of activities to skip"),
    type: Literal["all", "qwirl_answered", "user_answered_my_qwirl"] = Query(
        default="all",
        description="Filter by activity type"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get recent activity timeline for the current user.

    Includes:
    - People who answered the user's Qwirl (incoming)
    - Qwirls the user has answered (outgoing)

    Results are sorted by timestamp (most recent first).
    """

    # TODO: Implement the logic described above
    # 1. Query incoming responses (people who answered my Qwirl)
    # 2. Query outgoing responses (Qwirls I answered)
    # 3. Merge, sort by timestamp
    # 4. Apply pagination
    # 5. Return response

    pass
```

---

## Database Tables Involved

Based on existing schema, you'll need to query:

1. **`qwirl_response_sessions`** - Session information

   - Fields: `id`, `user_id`, `qwirl_id`, `started_at`, `status`, `wavelength`

2. **`qwirls`** - Qwirl details

   - Fields: `id`, `user_id`, `title`, `background_image`, `item_count`

3. **`users`** - User information

   - Fields: `id`, `username`, `name`, `avatar`

4. **`qwirl_item_responses`** - Individual responses (for counting)
   - Fields: `id`, `session_id`, `qwirl_item_id`

---

## Edge Cases to Handle

1. **No Activities**: Return empty array with `total_count: 0`
2. **User Has No Primary Qwirl**: Only return "qwirl_answered" activities
3. **Abandoned Sessions**: Include them with status "abandoned"
4. **In-Progress Sessions**: Include with status "in_progress", no wavelength
5. **Self-Exclusion**: Never show activities where user answered their own Qwirl
6. **Deleted Users/Qwirls**: Handle gracefully (skip or show placeholder)

---

## Testing Checklist

- [ ] Returns activities sorted by most recent first
- [ ] Pagination works correctly (limit, skip, has_more)
- [ ] Type filter works for all three options
- [ ] Wavelength only present for completed sessions
- [ ] Response count accurate for in-progress sessions
- [ ] Current user is properly authenticated
- [ ] No activities shown for user's own Qwirl
- [ ] Returns 401 if not authenticated
- [ ] Returns 422 for invalid query parameters

---

## Performance Considerations

1. **Indexing**: Ensure indexes on:

   - `qwirl_response_sessions.user_id`
   - `qwirl_response_sessions.qwirl_id`
   - `qwirl_response_sessions.started_at`
   - `qwirls.user_id`

2. **Optimization**: Consider using:

   - Single UNION query instead of two separate queries
   - Subqueries for counting responses
   - Eager loading for related entities

3. **Caching**: Consider Redis cache for frequently accessed activity feeds (5-10 min TTL)

---

## Integration with Frontend

Once implemented, the frontend will call it like this:

```typescript
// In app/(authenticated)/home/page.tsx
const { data: recentActivity } = $api.useQuery(
  "get",
  "/users/me/recent-activity",
  {
    params: {
      query: {
        limit: 10,
        type: "all",
      },
    },
  }
);
```

The frontend will then display mixed timeline:

- "Sarah completed your Qwirl" (2h ago) → `user_answered_my_qwirl`
- "You answered John's Qwirl" (5h ago) → `qwirl_answered`
- "Mike started your Qwirl (3/15)" (1d ago) → `user_answered_my_qwirl` with in_progress

---

## Additional Notes

- This endpoint should be fast (< 200ms) as it's called on home page load
- Consider adding WebSocket support later for real-time updates
- Could extend to include other activity types: follows, likes, comments
- Timestamp should be in UTC, frontend will handle timezone conversion

---

## Questions for Backend Team

1. What's the best way to handle the UNION query in your ORM?
2. Should we add a `read_at` timestamp for marking activities as seen?
3. Do we need rate limiting on this endpoint?
4. Should we add filtering by date range (last 7 days, last 30 days)?
