# WavelengthIndicator Quick Reference

## 4 Variants at a Glance

```
┌────────────────────────────────────────────────────────────────┐
│ HORIZONTAL (Default)                        Full Width × 80px │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  [icon] WAVELENGTH           75%  ████████████████░░░░  │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Use: Profile pages, completion screens, desktop detail views │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐
│ VERTICAL      120px × 220px   │
│  ┌──────────────────────────┐ │
│  │    WAVELENGTH            │ │
│  │       [icon]             │ │
│  │        75%               │ │
│  │         │                │ │
│  │         ███              │ │
│  │         ███              │ │
│  │         ░░░              │ │
│  └──────────────────────────┘ │
│ Use: Sidebars, mobile,        │
│      navigation panels        │
└────────────────────────────────┘

┌──────────────────────────┐
│ COMPACT VERTICAL  80×110│
│  ┌────────────────────┐ │
│  │     [icon]         │ │
│  │      75%           │ │
│  │       │            │ │
│  │       ██           │ │
│  │       ░░           │ │
│  └────────────────────┘ │
│ Use: User cards, grids, │
│      profile previews   │
└──────────────────────────┘

┌──────────────────────────────────────────────┐
│ COMPACT HORIZONTAL        Full Width × 45px │
│  ┌────────────────────────────────────────┐ │
│  │ [icon] ████████████████░░░░░░░░░░  75% │ │
│  └────────────────────────────────────────┘ │
│ Use: Lists, inline badges, feeds, chat UI  │
└──────────────────────────────────────────────┘
```

---

## Decision Tree: Which Variant Should I Use?

```
Do you have HORIZONTAL space?
│
├─ YES → Is it a PRIMARY display?
│   │
│   ├─ YES → Use HORIZONTAL variant ✅
│   │   (Profile pages, completion screens)
│   │
│   └─ NO → Is it inline with other content?
│       │
│       ├─ YES → Use COMPACT-HORIZONTAL variant ✅
│       │   (Lists, feeds, activity items)
│       │
│       └─ NO → Use HORIZONTAL variant ✅
│           (Default for wide spaces)
│
└─ NO → Do you have VERTICAL space?
    │
    ├─ YES → Is it a SIDEBAR or navigation?
    │   │
    │   ├─ YES → Use VERTICAL variant ✅
    │   │   (Sidebars, navigation panels)
    │   │
    │   └─ NO → Use VERTICAL variant ✅
    │       (Mobile portrait layouts)
    │
    └─ NO → Space is TIGHT in both directions?
        │
        └─ YES → Use COMPACT variants:
            │
            ├─ More HEIGHT available?
            │   → COMPACT-VERTICAL ✅
            │   (Grid cards, profile cards)
            │
            └─ More WIDTH available?
                → COMPACT-HORIZONTAL ✅
                (List items, inline badges)
```

---

## Color System Cheat Sheet

| Wavelength  | Color               | Icon        | Use Case       |
| ----------- | ------------------- | ----------- | -------------- |
| **80-100%** | `destructive` (red) | ❤️ Heart    | Perfect match  |
| **60-79%**  | `primary` (blue)    | ⭐ Star     | Great match    |
| **40-59%**  | `sidebar-primary`   | ✨ Sparkles | Good match     |
| **20-39%**  | `secondary`         | ⚡ Zap      | Low match      |
| **0-19%**   | `muted-foreground`  | ⚡ Zap      | Very low match |

---

## Props Reference

```typescript
interface WavelengthIndicatorProps {
  wavelength: number; // 0-100 (required)
  userName: string; // For accessibility (required)
  variant?:
    | "horizontal" // Default
    | "vertical"
    | "compact-vertical" // NEW
    | "compact-horizontal"; // NEW
}
```

---

## Common Layouts

### Grid of User Cards

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {users.map((user) => (
    <div key={user.id} className="space-y-2">
      <UserAvatar user={user} />
      <WavelengthIndicator
        wavelength={user.wavelength}
        userName={user.name}
        variant="compact-vertical"
      />
    </div>
  ))}
</div>
```

### Activity List

```tsx
<div className="space-y-2">
  {activities.map((activity) => (
    <div key={activity.id} className="flex items-center gap-3">
      <UserAvatar user={activity.user} size="sm" />
      <div className="flex-1">
        <p>{activity.message}</p>
        <WavelengthIndicator
          wavelength={activity.wavelength}
          userName={activity.user.name}
          variant="compact-horizontal"
        />
      </div>
    </div>
  ))}
</div>
```

### Profile Header

```tsx
<div className="space-y-4">
  <UserProfile user={user} />
  <WavelengthIndicator
    wavelength={user.wavelength}
    userName={user.name}
    variant="horizontal"
  />
</div>
```

### Mobile List (Stacked)

```tsx
<div className="space-y-1">
  {matches.map((match) => (
    <Card key={match.id}>
      <CardContent className="p-2">
        <WavelengthIndicator
          wavelength={match.wavelength}
          userName={match.name}
          variant="compact-horizontal"
        />
      </CardContent>
    </Card>
  ))}
</div>
```

---

## Performance Notes

### Optimized:

- ✅ CSS transforms for animations (GPU-accelerated)
- ✅ Framer Motion with hardware acceleration
- ✅ Minimal re-renders (memoization opportunities)
- ✅ Lightweight DOM structure

### Bundle Size Impact:

- Component: ~2KB (gzipped)
- Dependencies: Framer Motion (already in project)
- Total impact: Negligible

---

## Accessibility Checklist

- ✅ Semantic HTML (Card structure)
- ✅ Color + Icon + Text (not color alone)
- ✅ Readable contrast ratios (WCAG AA+)
- ✅ Animation respects `prefers-reduced-motion` (via Framer)
- ✅ Screen reader friendly (userName prop for context)

---

## Common Mistakes

### ❌ DON'T:

```tsx
// Using horizontal in a tight space
<div className="w-20">  {/* Too narrow! */}
  <WavelengthIndicator variant="horizontal" wavelength={75} />
</div>

// Using vertical in a horizontal list
<div className="flex flex-row gap-2">
  <WavelengthIndicator variant="vertical" wavelength={75} />  {/* Wrong! */}
</div>
```

### ✅ DO:

```tsx
// Match variant to layout
<div className="w-20">
  <WavelengthIndicator variant="compact-vertical" wavelength={75} />
</div>

<div className="flex flex-row gap-2">
  <WavelengthIndicator variant="compact-horizontal" wavelength={75} />
</div>
```

---

## Test Page

**Route:** `/wavelength-test`

Features:

- 🎚️ Interactive slider (0-100%)
- 📊 Side-by-side comparisons
- 🎨 All color ranges demonstrated
- 📱 Responsive preview
- 📖 Usage guidelines

---

## Migration from v1 to v2

### Breaking Changes:

- ❌ `variant="compact"` removed
- ✅ Replaced with `compact-vertical` and `compact-horizontal`

### Migration:

```tsx
// v1 (OLD)
<WavelengthIndicator variant="compact" wavelength={75} />

// v2 (NEW) - Choose based on your layout:

// For vertical cards/grids:
<WavelengthIndicator variant="compact-vertical" wavelength={75} />

// For horizontal lists/feeds:
<WavelengthIndicator variant="compact-horizontal" wavelength={75} />
```

---

**Last Updated:** October 30, 2025  
**Component Location:** `components/wavelength-indicator.tsx`  
**Documentation:** `components/WAVELENGTH_INDICATOR_VARIANTS.md`
