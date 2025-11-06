# Badge Variant - Quick Reference

## Overview

The **badge** variant is the most compact form of the WavelengthIndicator, designed specifically for inline use cases like tags, labels, and text-embedded displays.

---

## Usage

```tsx
<WavelengthIndicator wavelength={85} userName="User" variant="badge" />
```

---

## Characteristics

### Visual Design

- **Shape:** Rounded-full pill shape
- **Layout:** Horizontal inline-flex
- **Background:** Semi-transparent card with backdrop blur
- **Border:** Subtle border for definition
- **Size:** ~60px width × ~28px height (auto-adjusts to content)

### Components

1. **Pulsating Icon** (left)

   - 3×3 icon size
   - Colored background based on wavelength
   - Scale + opacity animation (2s infinite)
   - More prominent pulse than other variants

2. **Percentage Text** (right)
   - Small font (text-sm)
   - Semi-bold weight
   - Tabular numbers for consistency

---

## Key Features

### ✨ Pulsating Icon Animation

```typescript
animate={{
  scale: [1, 1.3, 1],        // More prominent than other variants
  opacity: [0.6, 0.1, 0.6],  // Higher starting opacity
}}
transition={{
  duration: 2,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

### 🎨 Semi-transparent Design

- `bg-card/50` - 50% opacity background
- `backdrop-blur-sm` - Subtle blur effect
- Works great over any background
- Modern, premium feel

### ⚡ Quick Entry Animation

```typescript
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.2 }}  // Faster than other variants
```

---

## Best Use Cases

### ✅ Perfect For:

- **Inline text displays**
  - "Matched with John • `[badge: 87%]`"
  - User mentions in comments
- **Tags and labels**
  - User profile tags
  - Match indicators
- **List item metadata**
  - Activity feed items
  - Search results
- **Compact headers**

  - Modal headers
  - Card headers with limited space

- **User cards (alternative to compact-vertical)**
  - When vertical space is premium
  - Grid layouts with very tight spacing

### ❌ Not Ideal For:

- Primary displays (use horizontal)
- When you need a progress bar visualization
- Large, prominent displays
- Sidebars (use vertical)

---

## Comparison with Other Variants

| Feature      | Badge            | Compact-Horizontal | Compact-Vertical |
| ------------ | ---------------- | ------------------ | ---------------- |
| Size         | ~60×28px         | Full width × 45px  | 80×110px         |
| Layout       | Inline           | Full width         | Vertical stack   |
| Progress Bar | ❌ No            | ✅ Yes             | ❌ No (can add)  |
| Icon Pulse   | ⚡ Prominent     | 💫 Subtle          | 💫 Subtle        |
| Background   | Semi-transparent | Solid card         | Solid card       |
| Best Context | Inline/tags      | Lists              | Grids            |

---

## Real-World Examples

### Example 1: Activity Feed Item

```tsx
<div className="flex items-center justify-between p-3 border rounded-lg">
  <div className="flex items-center gap-3">
    <UserAvatar user={user} />
    <div>
      <p className="font-medium">{user.name}</p>
      <p className="text-sm text-muted-foreground">Completed your Qwirl</p>
    </div>
  </div>
  <WavelengthIndicator
    wavelength={user.wavelength}
    userName={user.name}
    variant="badge"
  />
</div>
```

### Example 2: Inline in Text

```tsx
<p className="flex items-center gap-2">
  You matched with
  <strong>John Doe</strong>
  <WavelengthIndicator wavelength={87} userName="John Doe" variant="badge" />
</p>
```

### Example 3: User Tags

```tsx
<div className="flex flex-wrap gap-2">
  <span className="text-sm text-muted-foreground">Top Matches:</span>
  {topMatches.map((match) => (
    <WavelengthIndicator
      key={match.id}
      wavelength={match.wavelength}
      userName={match.name}
      variant="badge"
    />
  ))}
</div>
```

### Example 4: Compact List

```tsx
<div className="space-y-2">
  {users.map((user) => (
    <div
      key={user.id}
      className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded"
    >
      <UserAvatar user={user} size="sm" />
      <span className="flex-1">{user.name}</span>
      <WavelengthIndicator
        wavelength={user.wavelength}
        userName={user.name}
        variant="badge"
      />
    </div>
  ))}
</div>
```

---

## Technical Details

### CSS Classes

```tsx
className =
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/50 backdrop-blur-sm";
```

### Spacing

- Horizontal padding: `px-3` (12px)
- Vertical padding: `py-1.5` (6px)
- Gap between icon and text: `gap-2` (8px)

### Typography

- Font size: `text-sm` (14px)
- Font weight: `font-semibold` (600)
- Number style: `tabular-nums`

### Animation Performance

- GPU-accelerated (transform, opacity)
- Lightweight (no layout thrashing)
- 60fps on modern devices

---

## Color System

Same as all variants:

- **80-100%:** Destructive (red) with Heart icon
- **60-79%:** Primary (blue) with Star icon
- **40-59%:** Sidebar-primary with Sparkles icon
- **20-39%:** Secondary with Zap icon
- **0-19%:** Muted-foreground with Zap icon

---

## Accessibility

- ✅ Inline display (works with screen readers)
- ✅ Color + icon + text (not relying on color alone)
- ✅ Sufficient contrast (card background helps)
- ✅ Animation respects prefers-reduced-motion

---

## When to Choose Badge vs Compact-Horizontal

### Choose **Badge** when:

- ✅ You need inline display (flows with text)
- ✅ Space is extremely limited
- ✅ You want a modern, premium look (semi-transparent)
- ✅ No progress bar needed
- ✅ Tagging/labeling use case

### Choose **Compact-Horizontal** when:

- ✅ You need a progress bar visualization
- ✅ Full-width display preferred
- ✅ List items with defined structure
- ✅ Solid card background preferred
- ✅ More visual detail needed

---

## Migration

If you were using `compact-horizontal` in tight inline spaces:

```tsx
// Before
<WavelengthIndicator variant="compact-horizontal" wavelength={75} />

// After (if truly inline)
<WavelengthIndicator variant="badge" wavelength={75} />
```

---

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ⚠️ No IE11 support (uses backdrop-filter)

---

## Performance Notes

- **Extremely lightweight** (smallest variant)
- **No layout shifts** (inline-flex with fixed icon size)
- **Optimized animations** (GPU-accelerated)
- **Low re-render cost** (simple component tree)

---

## Summary

The **badge** variant is perfect for:

- 🏷️ Tags and labels
- 📝 Inline text displays
- 📋 Compact lists
- 🎯 Space-constrained UIs
- ✨ Modern, premium designs

**Dimensions:** ~60px × 28px  
**Display:** Inline-flex  
**Best Context:** Tags, labels, inline text, compact lists

---

**Test Page:** `/wavelength-test`  
**Component:** `components/wavelength-indicator.tsx`  
**Date Added:** October 30, 2025
