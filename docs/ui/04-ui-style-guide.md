# UI Style Guide — AudioBooks (MVP)

This style guide is intentionally simple. The MVP should feel calm, readable, and work well with keyboard and screen readers.

## Goals

- Audio-first: the player is always easy to reach.
- Accessible by default: keyboard, focus states, and screen reader labels are not optional.
- Fast to understand: minimal UI, clear copy, predictable layout.

## Design principles

1. **Clarity over density**: show the few fields users need to decide what to play.
2. **Consistency**: the same action should look and behave the same everywhere.
3. **Progress visibility**: always show listening progress when possible.
4. **Graceful missing data**: if a field is missing, hide it or show “Unknown”, never break layouts.

## Layout

- Use a simple page layout with a consistent header.
- Keep primary actions near the top (Play, Quick Listen).
- Prefer single-column layouts on mobile and two-column layouts on desktop for details pages.

## Typography

- Use the platform/system font stack.
- Prefer sentence case for labels.
- Avoid long paragraphs; break description text into readable blocks.

## Color and theming (semantic tokens)

Do not hard-code colors in the UI spec. Use semantic roles that can be themed later:

- `bg` (app background)
- `surface` (cards, panels)
- `text` (primary text)
- `muted` (secondary text)
- `border` (dividers)
- `accent` (primary action)
- `danger` (errors)

Minimum requirement: text contrast must be readable in both normal and high-contrast modes.

## Spacing and sizing

- Use a small set of spacing steps (e.g., 4 / 8 / 12 / 16 / 24).
- Touch targets: aim for at least 44×44 px for interactive controls.

## Buttons and actions

- One primary action per screen (usually **Play**).
- Secondary actions (Quick Listen) should not compete visually with Play.
- Disable actions with clear reasons (e.g., “Audio not available”).

## Forms (Search + Filters)

- Search input should have a visible label (not only placeholder).
- Filters should be simple and reversible (Clear filters).
- Use sensible defaults (show all items when no filters are applied).

## Loading, empty, and error states

- Loading: show a short, non-blocking indicator.
- Empty results: explain why (e.g., “No books match these filters”) and provide a **Clear filters** action.
- Errors: show a plain message and a retry action; log details in the console/server logs.

## Accessibility requirements (MVP)

### Keyboard
- All interactive elements must be reachable with Tab.
- Visible focus indicator on all focusable controls.
- Logical focus order matching the visual order.

### Screen readers
- Every icon-only button must have an accessible name (ARIA label).
- Headings must be hierarchical (H1 → H2 → H3).
- Announce important changes (e.g., “Playback started”, “Speed 1.5x”).

### Motion and audio
- Do not rely on animations to communicate state.
- Do not autoplay audio on page load.

## Copy guidelines

- Use short verbs: “Play”, “Pause”, “Resume”, “Quick Listen”, “Back”.
- Prefer concrete labels: “Duration” instead of “Length”.
- Avoid jargon (“AI narrator” is fine if it’s a dataset field; otherwise say “Narrator”).

## MVP UI checklist

- Catalog list is readable and filterable.
- Details page shows key metadata and play controls.
- Player has play/pause, progress, and speed.
- Quick Listen is discoverable from the details page.
- Similar titles show 5 items with a short “why similar” reason.
