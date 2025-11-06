# WavelengthIndicator Variants Guide

## Overview

The `WavelengthIndicator` component provides **4 professionally designed variants** to display wavelength compatibility scores across different UI contexts.

---

## Variant Types

### 1. **Horizontal** (Default)

```tsx
<WavelengthIndicator wavelength={75} userName="User" variant="horizontal" />
```

**Characteristics:**

- Full-width card layout
- Icon on the left, percentage and progress bar on the right
- Horizontal progress bar (20px wide × 2px high)
- Comprehensive information display
- Responsive design (stacks on mobile)

**Best Use Cases:**

- ✅ Qwirl completion screens
- ✅ User profile pages
- ✅ Full-width dashboard sections
- ✅ Detail pages with space to spare

**Dimensions:** Full width × ~80px height

---

### 2. **Vertical**

```tsx
<WavelengthIndicator wavelength={75} userName="User" variant="vertical" />
```

**Characteristics:**

- Compact vertical card layout
- "WAVELENGTH" label at top
- Icon in the middle
- Percentage below icon
- Vertical progress bar (32px high × 2px wide)
- All elements center-aligned

**Best Use Cases:**

- ✅ Sidebars and side panels
- ✅ Mobile-first layouts
- ✅ Navigation panels
- ✅ Vertical lists of users

**Dimensions:** ~120px width × ~220px height

---

### 3. **Compact Vertical** ⭐ NEW

```tsx
<WavelengthIndicator
  wavelength={75}
  userName="User"
  variant="compact-vertical"
/>
```

**Characteristics:**

- Minimalist vertical layout
- Icon with pulsing animation (framer-motion)
- Percentage in tabular numbers
- Mini vertical progress bar (12px high × 1px wide)
- Reduced padding (12px)
- Clean, space-efficient design

**Best Use Cases:**

- ✅ User cards in grid layouts
- ✅ Vertical badge displays
- ✅ Profile preview cards
- ✅ Match result displays
- ✅ Anywhere vertical space is limited

**Dimensions:** ~80px width × ~110px height

**Technical Features:**

- Smooth scale animation (0.8s easeOut)
- Background pulse animation (2.5s infinite)
- Icon pulse with scale and opacity (2s infinite)
- Tabular numbers for consistent width

---

### 4. **Compact Horizontal** ⭐ NEW

```tsx
<WavelengthIndicator
  wavelength={75}
  userName="User"
  variant="compact-horizontal"
/>
```

**Characteristics:**

- Minimalist horizontal layout
- Icon on the left with pulsing animation
- Flexible progress bar in the middle
- Percentage on the right (whitespace-nowrap)
- Reduced padding (10px)
- Optimized for inline display

**Best Use Cases:**

- ✅ Inline badges in lists
- ✅ List item displays
- ✅ Compact headers
- ✅ Chat/message interfaces
- ✅ Tight horizontal spaces
- ✅ Mobile list views

**Dimensions:** Full width × ~45px height (smallest variant)

**Technical Features:**

- Flex-1 progress bar adapts to container
- Min-width-0 prevents overflow issues
- Smooth width animation (0.8s easeOut)
- Background pulse animation (2.5s infinite)
- Icon pulse with scale and opacity (2s infinite)

---

## Color System

All variants use the same intelligent color system based on wavelength value:

| Range   | Background            | Text Color              | Icon BG                  | Description                       |
| ------- | --------------------- | ----------------------- | ------------------------ | --------------------------------- |
| 80-100% | `bg-destructive`      | `text-destructive`      | `bg-destructive/10`      | High compatibility (Red/Heart)    |
| 60-79%  | `bg-primary`          | `text-primary`          | `bg-primary/10`          | Good compatibility (Primary/Star) |
| 40-59%  | `bg-sidebar-primary`  | `text-sidebar-primary`  | `bg-sidebar-primary/10`  | Medium compatibility (Sparkles)   |
| 20-39%  | `bg-secondary`        | `text-secondary`        | `bg-secondary/10`        | Low compatibility (Zap)           |
| 0-19%   | `bg-muted-foreground` | `text-muted-foreground` | `bg-muted-foreground/10` | Very low compatibility (Zap)      |

**Icons by Range:**

- 80%+: `Heart` ❤️
- 60-79%: `Star` ⭐
- 40-59%: `Sparkles` ✨
- 0-39%: `Zap` ⚡

---

## Animation Features

### All Variants Include:

1. **Initial Scale Animation**

   - Fade in from opacity 0 → 1
   - Scale from 0.9 → 1
   - Duration: 0.3s

2. **Background Pulse**
   - Subtle opacity animation: [0, 0.2, 0]
   - Duration: 2.5s infinite
   - Creates gentle breathing effect

### Compact Variants (NEW):

3. **Icon Pulse Animation**

   - Scale animation: [1, 1.2, 1]
   - Opacity animation: [0.5, 0.2, 0.5]
   - Duration: 2s infinite
   - More prominent than standard variants

4. **Progress Bar Animation**
   - Smooth fill animation on mount
   - Duration: 0.8s with easeOut
   - Delay: 0.2s for staggered effect

---

## Variant Comparison

| Feature             | Horizontal | Vertical | Compact Vertical | Compact Horizontal |
| ------------------- | ---------- | -------- | ---------------- | ------------------ |
| Width               | Full       | ~120px   | ~80px            | Full               |
| Height              | ~80px      | ~220px   | ~110px           | ~45px              |
| Progress Bar        | Horizontal | Vertical | Mini Vertical    | Mini Horizontal    |
| Label               | Yes        | Yes      | No               | No                 |
| Padding             | 16px       | 16px     | 12px             | 10px               |
| Icon Size           | 20px       | 20px     | 16px             | 16px               |
| Best Layout         | Rows       | Columns  | Grids            | Lists              |
| Space Efficiency    | Medium     | Low      | High             | Highest            |
| Information Density | High       | High     | Medium           | Medium             |

---

## Usage Guidelines

### When to Use **Horizontal**:

- Primary display on detail pages
- When horizontal space is abundant
- Desktop-first experiences
- Full-width sections

### When to Use **Vertical**:

- Sidebar navigation
- Mobile portrait layouts
- Vertical user lists
- When height > width available

### When to Use **Compact Vertical**:

- User profile cards in grids
- Match results in 2-4 column layouts
- Mobile app card stacks
- Badge displays in vertical arrangements

### When to Use **Compact Horizontal**:

- List items (e.g., recent activity)
- Inline badges in feeds
- Mobile list views
- Chat/message interfaces
- Anywhere height is constrained

---

## Responsive Behavior

### Horizontal Variant:

```tsx
// Stacks on mobile (flex-col), side-by-side on desktop (md:flex-row)
<div className="flex items-center md:flex-row flex-col justify-between gap-x-4 gap-y-4">
```

### Compact Variants:

- Fixed layout regardless of screen size
- Optimized for mobile-first design
- Maintains aspect ratio on all devices

---

## Implementation Notes

### Performance Optimizations:

1. **Framer Motion** used for smooth animations
2. **CSS animations** for infinite pulses (more performant)
3. **Tabular numbers** for consistent width in percentages
4. **Will-change** implicit via transform animations

### Accessibility:

- ✅ Semantic card structure
- ✅ Readable contrast ratios
- ✅ Clear visual hierarchy
- ✅ No reliance on color alone (icons + text)

### Browser Support:

- Modern browsers (ES6+)
- Graceful degradation without animations
- CSS custom properties for theming

---

## Code Example: All Variants

```tsx
import WavelengthIndicator from "@/components/wavelength-indicator";

export default function Example() {
  const wavelength = 75;

  return (
    <div className="space-y-6">
      {/* Full-width detail display */}
      <WavelengthIndicator
        wavelength={wavelength}
        userName="Alice"
        variant="horizontal"
      />

      {/* Sidebar display */}
      <div className="flex justify-center">
        <WavelengthIndicator
          wavelength={wavelength}
          userName="Bob"
          variant="vertical"
        />
      </div>

      {/* Grid of user cards */}
      <div className="grid grid-cols-4 gap-4">
        <WavelengthIndicator
          wavelength={85}
          userName="Charlie"
          variant="compact-vertical"
        />
        <WavelengthIndicator
          wavelength={72}
          userName="Diana"
          variant="compact-vertical"
        />
        {/* More cards... */}
      </div>

      {/* List items */}
      <div className="space-y-2">
        <WavelengthIndicator
          wavelength={68}
          userName="Eve"
          variant="compact-horizontal"
        />
        <WavelengthIndicator
          wavelength={91}
          userName="Frank"
          variant="compact-horizontal"
        />
        {/* More list items... */}
      </div>
    </div>
  );
}
```

---

## Testing

All variants are showcased in the test page:

- **Route:** `/wavelength-test`
- **File:** `app/(authenticated)/wavelength-test/page.tsx`

Features:

- Interactive slider to test all values (0-100%)
- Side-by-side comparisons
- Different wavelength ranges
- Responsive preview

---

## Migration Guide

### From Old `compact` Variant:

**Before:**

```tsx
<WavelengthIndicator variant="compact" wavelength={75} userName="User" />
```

**After (Choose Based on Layout):**

```tsx
// For vertical card layouts (grids, stacks)
<WavelengthIndicator variant="compact-vertical" wavelength={75} userName="User" />

// For horizontal inline layouts (lists, feeds)
<WavelengthIndicator variant="compact-horizontal" wavelength={75} userName="User" />
```

---

## Design Philosophy

### Compact Variants:

1. **Minimalism First**: Remove everything non-essential
2. **Clarity Over Complexity**: One visual metaphor (progress bar)
3. **Performance**: Lightweight animations, optimized rendering
4. **Flexibility**: Adapts to container constraints
5. **Consistency**: Shared color system and icons

### Key Improvements Over Old `compact`:

- ✅ **Two specialized variants** instead of one-size-fits-all
- ✅ **Added progress bars** for better visual feedback
- ✅ **Framer Motion animations** for smoother transitions
- ✅ **Better padding/spacing** for professional feel
- ✅ **Tabular numbers** for consistent layout
- ✅ **Flex-based layout** prevents overflow issues

---

## Future Enhancements

Potential additions (not yet implemented):

- [ ] `compact-icon-only` variant (just icon + percentage badge)
- [ ] `compact-progress-only` variant (progress bar + percentage)
- [ ] Custom color schemes (override default colors)
- [ ] Loading states for each variant
- [ ] Skeleton loaders per variant
- [ ] Dark mode optimizations
- [ ] Haptic feedback on mobile

---

## Support

For issues or questions:

1. Check `/wavelength-test` page for examples
2. Review this documentation
3. Check component source: `components/wavelength-indicator.tsx`
4. Test with different wavelength values (0-100)

**Last Updated:** 2025-10-30
**Component Version:** 2.0 (Compact variants refactor)
