# Home / Dashboard Essentials Implementation

## Overview

The authenticated home experience now follows an essentials-first ethos. Rather than presenting multiple dense columns and discovery surfaces, the page concentrates on three core signals that every owner cares about immediately after sign-in: the health of their primary Qwirl, the latest engagement moments, and the single strongest wavelength matchup. Everything else has been removed or deferred to deeper sections to preserve attention and reduce noise.

## Core Sections

### 1. Hero "Qwirl Pulse" Card

- Greets the owner by name, shows the Qwirl title/description, and mirrors the cover art as a soft background when available.
- Displays either onboarding progress (poll count vs. minimum requirement) or a compact stat strip (total responses, completion rate, unique responders).
- Adapts actions by state: incomplete flows surface "Complete Qwirl" and "Preview", while complete flows elevate "Share", "View insights", and "Preview".
- Implements share via `navigator.share` with clipboard fallback and toast feedback, so the CTA always feels native and trustworthy.

### 2. Latest Responses Timeline

- Three-item activity digest spanning both incoming (people answering me) and outgoing (I answered someone) events.
- Each row includes avatar, descriptive headline, relative timestamp, and contextual badges (status + wavelength when available).
- Entire rows deep-link to the correct follow-up surface (`/qwirls/primary/insights` with responder filter or the responder's public Qwirl).
- Custom skeletons preserve card rhythm during loading; empty states coach users to share their Qwirl.

### 3. Top Match Spotlight

- Highlights only the strongest wavelength match to keep the list digestible.
- Shows avatar, username, wavelength badge, and a direct route to that profile, with a lightweight "View all matches" link for exploration.
- Empty state nudges owners to share when there are no matches yet.

### 4. Contextual Action Footer

- Renders only when the system has a clear next best action.
- Incomplete Qwirls display "Add polls" and "Preview" shortcuts.
- Quiet engagement windows suggest "Share" and "Explore feed"; missing matches encourage "Find matches".
- Disappears entirely when no additional guidance is needed, keeping the page calm.

## Interactions & States

- **Animations:** Section wrapper uses Framer Motion for a gentle fade-and-rise entrance; individual cards rely on subtle hover transitions only.
- **Loading:** Hero, responses, and spotlight each include bespoke skeletons to avoid layout shift.
- **Empty data:** `EmptyState` helper communicates next steps with iconography and soft copy.
- **Share handling:** All share attempts are wrapped in try/catch with abort handling and Sonner toasts for user feedback.
- **Accessibility:** Buttons stay keyboard-focusable, text has AA contrast, and status badges always pair iconography with text.

## Data Sources

- `GET /qwirl/me/cover` → cover art, title, description, visibility.
- `GET /qwirl-responses/qwirls/{qwirl_id}/stats` → poll count, responses, completion rate, unique responders.
- `GET /activities/me/recent-activity` → blended activity feed powering the timeline.
- `GET /users/{user_id}/top-wavelengths-simple` → ranked wavelength matches (first entry powers the spotlight).

## Implementation Notes

- All new presentation logic lives inside `app/(authenticated)/home/_components/qwirl-overview-section.tsx`, which now exports the essentials layout plus inline subcomponents (`HeroPulseCard`, `RecentResponsesList`, `TopMatchSpotlight`, `HomeActionFooter`, `EmptyState`).
- `app/(authenticated)/home/page.tsx` now forwards the entire stats payload and related loading flags; legacy props such as `totalPolls`/`visibility` were removed.
- Former home cards (`QwirlHeader`, `QuickStatsCard`, `RecentActivityCard`, `TopMatchesCard`, `DiscoverQwirlSection`) are no longer referenced; they can be deleted in a later cleanup once the new flow is fully adopted.
- Numbers are formatted with a shared `Intl.NumberFormat` instance for locale awareness.
- Activity entries cast `extra_data` into a light `SessionMetadata` helper to access responder status and wavelength without introducing new backend changes.

## Future Enhancements

1. **API hardening:** Formalize the `/activities/me/recent-activity` contract so consumers no longer need to cast `extra_data`.
2. **Real-time updates:** Add websocket/pusher events to refresh stats and activity without requiring manual refreshes.
3. **Delight states:** Layer in micro-celebrations when completion rate crosses thresholds or when a new top match appears.
4. **Cleanup:** Remove the deprecated home components once we are confident in the new experience.
5. **Product analytics:** Instrument share, insight view, and action-footer clicks to validate the streamlined flow.
