# UI Components — AudioBooks (MVP)

This document lists the reusable React components needed for the MVP.

## Conventions

- Components are React functional components (`.jsx` files).
- Components should be small and composable.
- Every interactive component must support keyboard and screen readers.
- Prefer text labels; if using icons, add accessible labels.

## App shell

### `AppShell`
**Purpose:** Shared layout wrapper.

**Contains**
- Top navigation/header
- Main content region

**Accessibility**
- Main region uses a landmark (`main`)
- Skip-to-content link (recommended)

### `TopBar`
**Purpose:** Screen title + key actions.

**Examples**
- Catalog: title + search
- Details: title + back
- Player: title

## Catalog components

### `SearchInput`
**Purpose:** Text search.

**Behavior**
- Has a visible label
- Debounced updates are allowed (keep it simple)

### `FilterPanel`
**Purpose:** Group filter controls.

**Includes**
- Duration range control
- Language selector
- Category/topic selector
- Author/narrator selector
- One extra filter
- “Clear filters” action

### `SelectField`
**Purpose:** Reusable dropdown/select.

**Accessibility**
- Proper label association

### `RangeField`
**Purpose:** Reusable numeric range (min/max).

**Behavior**
- Validate min ≤ max
- Allow empty values to mean “no limit”

### `AudiobookCard`
**Purpose:** Show an audiobook summary in lists.

**Shows**
- Title
- Author
- Duration
- Language
- Category/topic (if available)

**Action**
- Click/Enter opens details

### `AudiobookList`
**Purpose:** Render a list of `AudiobookCard` items.

**States**
- Loading
- Empty results

## Details components

### `BackLink`
**Purpose:** Return to previous screen.

### `MetadataList`
**Purpose:** Key/value list for book metadata.

**Behavior**
- Hide fields that are missing
- Keep order consistent

### `PrimaryActionButton`
**Purpose:** The main action (usually Play).

**Behavior**
- Disabled state includes a reason (tooltip or inline text)

### `QuickListenPanel`
**Purpose:** Entry point to Quick Listen.

**Shows**
- Short description (“Listen to a short summary”)
- Estimated time (if available)
- Open action

### `SimilarTitlesList`
**Purpose:** Show 5 similar titles.

**Each item shows**
- Title
- One-line reason (e.g., “Same topic + similar duration”)

## Player components

### `PlayerControls`
**Purpose:** Play/pause and speed.

**Must include**
- Play/Pause toggle
- Speed control (e.g., 0.8×, 1.0×, 1.25×, 1.5×, 2.0×)

**Accessibility**
- Buttons have accessible names
- Current speed is announced to screen readers

### `ProgressBar`
**Purpose:** Show playback progress.

**Shows**
- Elapsed time
- Total time (if known)

### `NowPlayingHeader`
**Purpose:** Identify what is playing.

**Shows**
- Title
- Author (optional)

## Feedback components

### `InlineAlert`
**Purpose:** Simple error/warning message.

**Use for**
- Dataset loading errors
- Audio not available

### `EmptyState`
**Purpose:** Friendly “nothing to show” message + action.

**Use for**
- No search results
- No similar titles found

## MVP component checklist

- AppShell + TopBar
- SearchInput + FilterPanel
- AudiobookList + AudiobookCard
- Details: MetadataList + Play button + QuickListenPanel + SimilarTitlesList
- Player: NowPlayingHeader + PlayerControls + ProgressBar
- EmptyState + InlineAlert
