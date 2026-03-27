# UI Screens and Flow — AudioBooks (MVP)

This document defines the MVP screens and the expected user flow.

## Navigation model

- Primary navigation is simple:
	- **Catalog** (browse/search/filter)
	- **Now Playing** (player)
- The **audiobook details** screen is opened from the catalog list.

Notes:
- Keep navigation consistent across screens.

## Screen 1 — Catalog (Browse/Search/Filter)

**Goal:** Let the user find an audiobook quickly.

**Must show**
- Page title (Catalog)
- Search input
- Filters (duration, language, category/topic, author/narrator, one extra)
- A list of audiobooks

**Each list item shows** (when available)
- Title
- Author
- Duration
- Language
- Category/topic

**Actions**
- Open audiobook details
- Clear filters

**Empty states**
- No results: explain and offer “Clear filters”.
- Dataset not loaded: show an error + “Retry”.

## Screen 2 — Audiobook Details

**Goal:** Let the user decide to listen, use Quick Listen, or explore similar titles.

**Must show**
- Title
- Key metadata (author, narrator, duration, language, category/topic)
- Description/synopsis (if available)
- Audio availability

**Primary actions**
- **Play** (if audio is available)

**Secondary actions**
- **Quick Listen**

**Also show**
- **Similar titles** section with 5 items
- For each similar title: title + 1 short reason (e.g., “Same language + similar duration”)

**States**
- Audio not available: disable Play and show a clear message.

## Screen 3 — Player (Now Playing)

**Goal:** Control playback with minimal friction.

**Must show**
- Current audiobook title (and author if available)
- Play/Pause
- Progress (elapsed/remaining or elapsed/total)
- Playback speed control

**Optional (nice, but not required)**
- Skip forward/back by a fixed amount

**Accessibility requirements**
- Every control is keyboard reachable
- Icon-only controls have accessible labels

## Screen 4 — Quick Listen

**Goal:** Provide a short version + estimated time.

**Must show**
- Quick Listen title (e.g., “Quick Listen: {Book Title}”)
- Estimated listen time
- Summary content (text and/or an audio summary if the project supports it)

**Actions**
- Start Quick Listen playback (if audio summary exists)
- Back to audiobook details

## Core user flows

### Flow A — Browse to listen
1. Open app → Catalog screen
2. Search or filter
3. Open audiobook details
4. Press Play
5. Adjust speed

### Flow B — Quick Listen
1. From audiobook details, open Quick Listen
2. See estimated time
3. Consume summary (read or play)

### Flow C — Similar titles
1. On audiobook details, scan “Similar titles”
2. Open one similar title
3. See reason(s) and optionally play

## MVP acceptance checklist

- Catalog loads and is usable
- Filters change the visible results
- Details page loads for any audiobook
- Player works when audio is available
- Speed control works
- Quick Listen is reachable and shows estimated time
- Similar titles show 5 items with reasons
- Similar titles show 5 items with reasons
