# UI Podcast Screens — AudioBooks

## Overview

The Podcast Hub lets users discover and listen to book-related podcast shows. Shows are browsable by category, and episodes play through the same audio player used for audiobooks. Logged-in users can subscribe to shows and manage a personal episode queue.

---

## Screen: Podcast Hub (Browse Shows)

**Route:** `/podcasts`

**Goal:** Let users discover podcast shows.

### Layout
- Page title: "Podcast Hub"
- Search bar
- Category filter chips (All, Author Interviews, Book Clubs, Literary Analysis, Book Reviews, Storytelling)
- Grid of podcast show cards

### Each show card shows
| Element | Source |
|---------|--------|
| Cover image | show.cover_image_url (or placeholder) |
| Title | show.title |
| Host | show.host |
| Category | show.category (badge) |
| Episode count | computed |
| Subscribe button | toggle (if logged in) |

### Actions
- Click show → open show detail
- Filter by category → updates grid
- Search → filters shows by title/host/description
- Subscribe/Unsubscribe toggle

### States
- **Loading** — skeleton cards
- **Empty search** — "No podcasts match your search."
- **Not logged in** — subscribe button shows "Log in to subscribe" tooltip

---

## Screen: Podcast Show Detail

**Route:** `/podcasts/:showId`

**Goal:** Show all episodes for a podcast and let users play or queue them.

### Layout
#### Show header
- Cover image (large)
- Title
- Host
- Category badge
- Description
- Subscribe/Unsubscribe button
- Total episodes + total duration

#### Episode list
- Sorted by publish date (newest first)
- Paginated (20 per page)

### Each episode item shows
| Element | Source |
|---------|--------|
| Episode number | episode.episode_number (if available) |
| Title | episode.title |
| Publish date | episode.publish_date (formatted) |
| Duration | episode.duration_seconds (formatted as HH:MM:SS) |
| Description | first 2 lines, expandable |
| Play button | starts playback immediately |
| Add to Queue button | adds to personal queue (logged-in only) |

### Actions
- Play episode → opens player with this episode
- Add to Queue → adds to bottom of queue, shows confirmation toast
- Click episode title → could expand description (inline)

---

## Screen: My Podcast Queue

**Route:** `/podcasts/queue`

**Goal:** Let users manage their personal listening queue.

**Requires authentication.**

### Layout
- Page title: "My Queue"
- Ordered list of queued episodes

### Each queue item shows
- Show cover (small) + show title
- Episode title
- Duration
- Play button
- Move up / Move down buttons
- Remove button

### Actions
- Play → starts playback, removes from queue
- Reorder → move up/down in the list
- Remove → removes from queue with undo toast
- "Clear Queue" button

### Empty state
- "Your queue is empty. Browse podcasts to add episodes."

---

## Screen: My Subscriptions

**Route:** `/podcasts/subscriptions`

**Goal:** Show all podcast shows the user is subscribed to.

**Requires authentication.**

### Layout
- Grid of subscribed show cards (same as hub cards but with unsubscribe option)
- "New Episodes" section at top showing episodes published since last visit

### Empty state
- "You haven't subscribed to any podcasts yet. Explore the Podcast Hub to find shows you'll love."

---

## Podcast Player Integration

The podcast player shares the same persistent mini-player as audiobooks. The player should:
- Show "Now Playing" with the podcast show name and episode title.
- Support play/pause, progress bar, speed control.
- Show episode artwork (or show artwork as fallback).
- Display "Podcast" label to distinguish from audiobook playback.

When switching between audiobook and podcast playback:
- Confirm with user: "You're currently listening to [X]. Switch to [Y]?"
- Save progress of the current item before switching.

---

## Component list

| Component | Purpose |
|-----------|---------|
| `PodcastShowGrid` | Grid layout for show cards |
| `PodcastShowCard` | Single show card with subscribe toggle |
| `PodcastShowHeader` | Large header on show detail page |
| `EpisodeList` | Paginated episode list |
| `EpisodeListItem` | Single episode row with play/queue actions |
| `PodcastQueueList` | Ordered queue with reorder controls |
| `PodcastQueueItem` | Single queue item with move/remove |
| `SubscriptionGrid` | Grid of subscribed shows |
| `PodcastCategoryChips` | Horizontal scrollable category filters |
| `PodcastSearchInput` | Search bar for podcast hub |
