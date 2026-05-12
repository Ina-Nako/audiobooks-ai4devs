# UI Forum Screens — AudioBooks

## Overview

The community forum is where users discuss audiobooks, printed books, and podcasts. It follows a classic category → thread list → thread detail model with voting and search.

---

## Screen: Forum Home

**Route:** `/forum`

**Goal:** Show all forum categories with activity summaries.

### Layout
- Page title: "Community Forum"
- Search bar at the top
- Category list below

### Each category card shows
- Category name (e.g., "Audiobook Discussions")
- Short description
- Thread count
- Last active thread title + time

### Categories (seed data)
1. **Audiobook Discussions** — Talk about audiobooks you're listening to
2. **Book Reviews** — Share your reviews and opinions
3. **Recommendations** — Ask for or give book recommendations
4. **Podcast Talk** — Discuss podcast episodes and shows
5. **General** — Off-topic and community chat

### Actions
- Click a category → navigate to thread list
- Search → search across all threads and replies
- "New Thread" button (floating or top-right) → create thread

---

## Screen: Thread List (Category View)

**Route:** `/forum/category/:slug`

**Goal:** Show all threads in a category, sorted by recent activity.

### Layout
- Breadcrumb: Forum > Category Name
- Category title and description
- Thread list (paginated, 20 per page)

### Each thread item shows
| Element | Source |
|---------|--------|
| Title | thread.title (clickable) |
| Author | user.display_name + avatar |
| Reply count | thread.reply_count |
| Vote score | upvotes − downvotes |
| Last activity | relative time (e.g., "2 hours ago") |
| Linked book/podcast | if thread.audiobook_id or thread.podcast_id (small badge) |
| Pinned badge | if thread.is_pinned |

### Sorting options
- **Recent activity** (default) — most recently replied
- **Newest** — most recently created
- **Most voted** — highest vote score
- **Most replies** — highest reply count

### Actions
- Click thread → open thread detail
- "New Thread" button → create thread (pre-selects this category)

---

## Screen: Thread Detail

**Route:** `/forum/thread/:threadId`

**Goal:** Read the full thread and its replies.

### Layout
- Breadcrumb: Forum > Category > Thread Title

#### Original post section
- Author avatar + display name + "Posted X time ago"
- Thread title (H1)
- Thread body (rendered markdown or plain text)
- Linked audiobook/podcast card (if linked)
- Vote buttons (upvote/downvote) with score
- Action menu: Edit, Delete (own posts only), Report

#### Replies section
- Sorted by date (oldest first)
- Each reply shows:
  - Author avatar + display name + time
  - Reply body
  - Vote buttons with score
  - Action menu: Edit, Delete (own), Report

#### Reply form (bottom)
- Textarea for reply body (10–5000 chars)
- "Post Reply" button
- Login prompt if not authenticated

### States
- **Thread locked** — hide reply form, show "This thread is locked" message
- **Empty replies** — "No replies yet. Be the first to respond!"
- **Author editing** — inline edit mode for own posts

---

## Screen: Create Thread

**Route:** `/forum/new`

**Goal:** Let an authenticated user create a new discussion.

### Fields
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Category | dropdown select | must select one | yes |
| Title | text input | 5–200 characters | yes |
| Body | textarea | 10–10000 characters | yes |
| Link Audiobook | search/select | optional audiobook from catalog | no |
| Link Podcast | search/select | optional podcast show | no |

### Actions
- **Post Thread** (primary) — creates the thread, navigates to it.
- **Cancel** — back to forum.

### Validation
- All required fields validated before submission.
- Character counters shown for title and body.

---

## Screen: Forum Search Results

**Route:** `/forum/search?q=...`

**Goal:** Show threads and replies matching the search query.

### Layout
- Search input (pre-filled with query)
- Results list showing:
  - Thread title + snippet of matching content
  - Category badge
  - Author + date
  - Reply count

### Empty state
- "No discussions found for '{query}'. Try different keywords or start a new thread."

---

## Component list

| Component | Purpose |
|-----------|---------|
| `ForumCategoryList` | Grid/list of forum categories |
| `ForumCategoryCard` | Single category with stats |
| `ThreadList` | Paginated list of threads |
| `ThreadListItem` | Single thread summary row |
| `ThreadSortBar` | Sort options for thread list |
| `ThreadDetail` | Full thread view with replies |
| `ThreadPost` | Original post or reply (reusable) |
| `VoteButtons` | Upvote/downvote with score |
| `ReplyForm` | Textarea + submit for replies |
| `CreateThreadForm` | Full thread creation form |
| `ForumSearchInput` | Search bar for forum |
| `ForumSearchResults` | Search results page |
| `LinkedContentBadge` | Badge showing linked audiobook/podcast |
| `PostActionMenu` | Edit/Delete/Report dropdown |
