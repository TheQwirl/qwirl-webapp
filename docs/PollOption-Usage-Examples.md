# PollOption Component Usage Examples

The `PollOption` component now has improved TypeScript types and conditional props based on variants. Here are the usage examples:

## 1. Display Variant (Question Bank Cards)

```tsx
// Basic display - just shows the option with number
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="display"
/>

// Display with highlight (e.g., in editor when showing user's choice)
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="display"
  isSelected={true} // Now shows shadow and highlight
/>
```

## 2. Selectable Variant (Qwirl Editor - View Only)

```tsx
// Shows user's selected option in editor (read-only)
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="selectable"
  isSelected={true} // Required prop for this variant
/>

// Alternative using isMyChoice
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="selectable"
  isSelected={false}
  isMyChoice={true} // Shows "You" badge
/>
```

## 3. Results Variant (Response Viewing)

```tsx
// Shows who responded to this option
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="results"
  isMyChoice={true} // Required prop
  responders={[
    // Required prop
    { user: { id: "1", name: "John", username: "john", avatar: null } },
    { user: { id: "2", name: "Jane", username: "jane", avatar: null } },
  ]}
/>
```

## 4. Interactive Variant (Qwirl Responding)

```tsx
// Clickable option for answering qwirls
<PollOption
  option="I prefer coffee over tea"
  optionNumber={1}
  variant="interactive"
  onSelect={() => handleVote("I prefer coffee over tea")} // Required prop
  isSelected={userChoice === "I prefer coffee over tea"}
  isOwnerChoice={ownerChoice === "I prefer coffee over tea"}
  percentage={65}
  showPercentage={true}
  userName="Sarah"
  disabled={false}
/>
```

## Key Improvements:

1. **Conditional Props**: Each variant only requires the props it actually uses
2. **Better TypeScript**: Props are properly typed based on variant
3. **Visual Consistency**: All variants now properly show highlights/shadows when selected
4. **Accessibility**: Only interactive variant is clickable and has proper ARIA attributes
5. **Cleaner API**: No more optional props that don't make sense for certain variants

## Variant Behaviors:

- **display**: Read-only showcase, shows number badge, can highlight selection
- **selectable**: Read-only editor view, shows selection state with "You" badge
- **results**: Read-only response view, shows responders and owner choice
- **interactive**: Clickable answering, shows percentages, hover effects, full interaction
