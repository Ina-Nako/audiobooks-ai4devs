# UI Screens and Flow — AudioBooks

This document defines all screens and the expected user flows for the full platform.

## Navigation model

### Main navigation (Header)
- **Home** — featured content and personalized sections
- **Catalog** — browse/search/filter audiobooks
- **Bookstore** — browse and buy printed copies
- **Podcasts** — browse podcast shows and episodes
- **Forum** — community discussions

### Secondary navigation (Header right)
- **Search** (global)
- **Notifications** bell (logged in)
- **User menu** (logged in) or Login/Sign Up buttons (logged out)

### Persistent element
- **Mini-player** — fixed bar at the bottom when audio is playing

---

## Screen 1 — Home

**Route:** `/`

**Goal:** Surface the most engaging content and get users listening/reading/discussing quickly.

### Sections (top to bottom)
1. **Hero banner** — featured audiobook or seasonal promotion
2. **Continue Listening** (auth only) — audiobooks with saved progress, resume button
3. **Trending Audiobooks** — top-rated or most-listened recently (carousel)
4. **New in the Bookstore** — recently added printed editions
5. **Latest Podcast Episodes** — newest episodes across all shows
6. **Active Discussions** — forum threads with recent activity
7. **Personalized Picks** (auth only) — based on listening history genres

### States
- **Logged out:** hide Continue Listening and Personalized Picks, show sign-up banner instead
- **Section error:** show inline error per section; don't break the page

---

## Screen 2 — Catalog (Browse/Search/Filter Audiobooks)

**Route:** `/catalog`

**Goal:** Let the user find an audiobook quickly.

### Must show
- Page title (Catalog)
- Search input
- Filters (duration, language, category/topic, author/narrator, rating, one extra)
- A grid/list of audiobook cards
- Pagination controls
- Results count ("Showing 1–20 of 156")

### Each card shows (when available)
- Cover image
- Title
- Author
- Duration
- Language
- Category/topic
- Average rating (stars)

### Actions
- Open audiobook details
- Clear filters
- Sort by (title, rating, duration, newest)

### Empty states
- No results: explain and offer "Clear filters"
- Dataset not loaded: show error + "Retry"

---

## Screen 3 — Audiobook Details

**Route:** `/audiobooks/:audiobookId`

**Goal:** Let the user decide to listen, buy, review, or explore.

### Must show
- Cover image
- Title
- Key metadata (author, narrator, duration, language, category/topic)
- Description/synopsis (expandable if long)
- Audio availability
- Average rating + review count

### Primary actions
- **Play** (if audio is available)

### Secondary actions
- **Quick Listen**
- **Add to Wishlist** (auth only)
- **Write a Review** (auth only)

### Additional sections
- **Buy Printed Copy** panel (if print edition available): price, availability, add to cart
- **Reviews** section: star breakdown, list of reviews (paginated, sortable)
- **Similar titles** section: 5 items with reasons

### States
- Audio not available: disable Play, show message
- No print edition: hide Buy panel
- Not logged in: "Log in to review" / "Log in to add to wishlist"

---

## Screen 4 — Player (Full Page)

**Route:** `/player`

**Goal:** Control playback with minimal friction.

### Must show
- Cover image (large)
- Current audiobook/podcast title
- Author/host
- Play/Pause button (large)
- Progress bar (seekable)
- Elapsed / Total time
- Playback speed control (0.5×, 0.75×, 1.0×, 1.25×, 1.5×, 2.0×)

### Optional
- Skip forward/back (15s / 30s)
- Chapter list (if available)

### Mini-player (persistent bar)
- Visible on all pages when audio is active
- Shows: cover thumbnail, title, play/pause, progress, speed
- Click to expand to full player page

---

## Screen 5 — Quick Listen

**Route:** `/audiobooks/:audiobookId/quick-listen`

**Goal:** Provide a short version + estimated time.

### Must show
- Quick Listen title (e.g., "Quick Listen: {Book Title}")
- Estimated listen time
- Summary content (text)
- Audio summary player (if audio summary exists)

### Actions
- Start Quick Listen playback (if audio summary exists)
- Back to audiobook details

---

## Screen 6 — Bookstore Browse

**Route:** `/bookstore`

**Goal:** Let users find printed books to buy.

### Must show
- Search bar
- Filters (genre, price range, availability)
- Grid of book cards (cover, title, author, price, availability, rating)
- Sort by (price, rating, title)
- Pagination

### Actions
- Open book detail / audiobook detail
- Add to cart
- "Listen" link to audiobook page

**See [10-ui-bookstore.md](10-ui-bookstore.md) for full detail.**

---

## Screen 7 — Shopping Cart

**Route:** `/cart`

**Requires auth.**

### Must show
- List of cart items (cover, title, quantity, unit price, subtotal, remove)
- Order summary sidebar (subtotal, shipping, total)

### Actions
- Adjust quantities / remove items
- Proceed to Checkout
- Continue Shopping

**See [10-ui-bookstore.md](10-ui-bookstore.md) for full detail.**

---

## Screen 8 — Checkout

**Route:** `/checkout`

**Requires auth.**

### Steps
1. Shipping information form
2. Order review + "Place Order"
3. Order confirmation

**See [10-ui-bookstore.md](10-ui-bookstore.md) for full detail.**

---

## Screen 9 — Podcast Hub

**Route:** `/podcasts`

**Goal:** Help users discover podcast shows.

### Must show
- Search bar
- Category filter chips
- Grid of podcast show cards

### Actions
- Open show detail
- Subscribe/unsubscribe

**See [09-ui-podcast.md](09-ui-podcast.md) for full detail.**

---

## Screen 10 — Podcast Show Detail

**Route:** `/podcasts/:showId`

### Must show
- Show header (cover, title, host, description, subscribe button)
- Episode list (paginated, newest first)

### Actions
- Play episode
- Add to queue

**See [09-ui-podcast.md](09-ui-podcast.md) for full detail.**

---

## Screen 11 — Podcast Queue

**Route:** `/podcasts/queue`

**Requires auth.**

### Must show
- Ordered list of queued episodes
- Reorder / remove controls

**See [09-ui-podcast.md](09-ui-podcast.md) for full detail.**

---

## Screen 12 — Forum Home

**Route:** `/forum`

### Must show
- Search bar
- List of forum categories with activity summaries

**See [08-ui-forum.md](08-ui-forum.md) for full detail.**

---

## Screen 13 — Forum Thread List

**Route:** `/forum/category/:slug`

### Must show
- Category title and description
- Paginated thread list with sorting options

**See [08-ui-forum.md](08-ui-forum.md) for full detail.**

---

## Screen 14 — Forum Thread Detail

**Route:** `/forum/thread/:threadId`

### Must show
- Original post with votes
- Reply list
- Reply form (auth only)

**See [08-ui-forum.md](08-ui-forum.md) for full detail.**

---

## Screen 15 — Create Forum Thread

**Route:** `/forum/new`

**Requires auth.**

### Must show
- Category selector, title, body, optional audiobook/podcast link

**See [08-ui-forum.md](08-ui-forum.md) for full detail.**

---

## Screen 16 — Login

**Route:** `/login`

**See [07-ui-auth.md](07-ui-auth.md) for full detail.**

---

## Screen 17 — Sign Up

**Route:** `/signup`

**See [07-ui-auth.md](07-ui-auth.md) for full detail.**

---

## Screen 18 — Password Reset

**Routes:** `/forgot-password`, `/reset-password/:token`

**See [07-ui-auth.md](07-ui-auth.md) for full detail.**

---

## Screen 19 — User Profile / Library

**Route:** `/profile`

**Requires auth.**

### Sections (tabbed or sidebar navigation)
1. **Profile Info** — display name, avatar, member since
2. **Listening History** — audiobooks with progress bars
3. **Wishlist** — saved audiobooks
4. **Purchase History** — orders with statuses
5. **My Reviews** — reviews authored
6. **Forum Activity** — threads and replies authored
7. **Podcast Subscriptions** — subscribed shows
8. **Settings** — notification preferences, password change

---

## Screen 20 — Order History

**Route:** `/orders`

**Requires auth.**

### Must show
- List of past orders (date, status, total, item count)
- Expandable detail per order

**See [10-ui-bookstore.md](10-ui-bookstore.md) for full detail.**

---

## Screen 21 — Notifications

**Route:** `/notifications`

**Requires auth.**

### Must show
- List of all notifications (type icon, title, message, time, read status)
- "Mark all as read" action
- Click to navigate to relevant page

---

## Core user flows

### Flow A — Browse and listen
1. Home or Catalog → search/filter → open audiobook details
2. Press Play → player opens
3. Adjust speed, track progress

### Flow B — Quick Listen
1. Audiobook details → "Quick Listen"
2. See estimated time, read/play summary

### Flow C — Similar titles
1. Audiobook details → scroll to "Similar titles"
2. Open similar title → see reason → optionally play

### Flow D — Buy a printed copy
1. Audiobook details → "Buy Printed Copy" → Add to Cart
2. Or: Bookstore → browse → Add to Cart
3. Cart → Checkout → Shipping → Place Order → Confirmation

### Flow E — Listen to a podcast
1. Podcast Hub → browse/filter → open show
2. Play episode → player opens (or add to queue)
3. Queue → manage order → play next

### Flow F — Forum discussion
1. Forum → browse category → open thread
2. Read thread → reply (or upvote/downvote)
3. Or: Forum → "New Thread" → write and post

### Flow G — Sign up and personalize
1. Visit site → see public content → click "Sign Up"
2. Create account → redirect to Home with personalized sections
3. Start listening → progress saved → "Continue Listening" appears on return

### Flow H — Review an audiobook
1. Audiobook details → "Write a Review" (or scroll to reviews)
2. Select star rating → write text → submit
3. Review appears on the page, average updates

---

## Route summary

| Route | Screen | Auth required |
|-------|--------|---------------|
| `/` | Home | no |
| `/catalog` | Catalog | no |
| `/audiobooks/:id` | Audiobook Details | no |
| `/audiobooks/:id/quick-listen` | Quick Listen | no |
| `/player` | Full Player | no |
| `/bookstore` | Bookstore Browse | no |
| `/bookstore/:id` | Book Detail | no |
| `/cart` | Shopping Cart | yes |
| `/checkout` | Checkout | yes |
| `/orders` | Order History | yes |
| `/podcasts` | Podcast Hub | no |
| `/podcasts/:showId` | Podcast Show Detail | no |
| `/podcasts/queue` | Podcast Queue | yes |
| `/podcasts/subscriptions` | My Subscriptions | yes |
| `/forum` | Forum Home | no |
| `/forum/category/:slug` | Thread List | no |
| `/forum/thread/:threadId` | Thread Detail | no |
| `/forum/new` | Create Thread | yes |
| `/forum/search` | Forum Search | no |
| `/login` | Login | no |
| `/signup` | Sign Up | no |
| `/forgot-password` | Forgot Password | no |
| `/reset-password/:token` | Reset Password | no |
| `/profile` | User Profile | yes |
| `/notifications` | Notifications | yes |

---

## MVP acceptance checklist

- [ ] Home page loads with featured content
- [ ] Catalog loads, filters work, details page opens
- [ ] Player works with speed control
- [ ] Quick Listen shows estimated time and summary
- [ ] Similar titles show 5 items with reasons
- [ ] Reviews can be submitted and displayed
- [ ] Bookstore shows books, cart works, checkout completes
- [ ] Podcast shows are browsable, episodes are playable
- [ ] Forum categories visible, threads created, replies posted, voting works
- [ ] Login/signup works, protected routes redirect
- [ ] Profile shows library, history, and purchases
- [ ] Notifications appear for relevant events
