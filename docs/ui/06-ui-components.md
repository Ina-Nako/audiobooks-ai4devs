# UI Components — AudioBooks

This document lists all reusable React components needed for the platform.

## Conventions

- Components are React functional components (`.jsx` files).
- Components should be small and composable.
- Every interactive component must support keyboard and screen readers.
- Prefer text labels; if using icons, add accessible labels.
- Use CSS custom properties (semantic tokens) for all colors and spacing.

---

## App shell components

### `AppShell`
**Purpose:** Shared layout wrapper for all pages.

**Contains:**
- `Header` (navigation + user menu)
- Main content region
- `MiniPlayer` (when audio is playing)
- `Footer`

**Accessibility:**
- Main region uses a landmark (`<main>`)
- Skip-to-content link

### `Header`
**Purpose:** Navigation, search, and user actions.

**Contains:**
- Logo / app title (links to Home)
- `MainNav` (Home, Catalog, Bookstore, Podcasts, Forum)
- `GlobalSearch` input
- `NotificationBell` (auth only)
- `UserMenu` (auth only) or Login/Sign Up buttons

### `MainNav`
**Purpose:** Primary navigation tabs.

**Behavior:**
- Active tab highlighted
- Responsive: horizontal tabs (desktop), hamburger/bottom bar (mobile)

### `Footer`
**Purpose:** Minimal footer with links (About, Contact, Terms).

---

## Auth components

### `AuthLayout`
**Purpose:** Centered card wrapper for login/signup/reset screens.

### `LoginForm`
**Purpose:** Email + password form for authentication.

### `SignUpForm`
**Purpose:** Registration form with display name, email, password, confirm password.

### `ForgotPasswordForm`
**Purpose:** Email-only form for password reset request.

### `ResetPasswordForm`
**Purpose:** New password + confirm password form for reset completion.

### `PasswordStrengthBar`
**Purpose:** Visual indicator of password strength (weak/medium/strong).

### `UserMenu`
**Purpose:** Dropdown for logged-in users showing Profile, Library, Orders, Settings, Log Out.

### `AuthGuard`
**Purpose:** Route wrapper that redirects unauthenticated users to login.

---

## Catalog components

### `GlobalSearch`
**Purpose:** App-wide search input in the header.

### `SearchInput`
**Purpose:** Page-level text search for catalog/bookstore/podcast/forum.

**Behavior:**
- Has a visible label
- Clear button when not empty
- Debounced updates allowed

### `FilterPanel`
**Purpose:** Group filter controls for catalog browsing.

**Includes:**
- Duration range control
- Language selector
- Category/topic selector
- Author/narrator selector
- Rating filter
- One extra filter
- "Clear filters" action

### `SelectField`
**Purpose:** Reusable dropdown/select.

**Accessibility:** Proper label association.

### `RangeField`
**Purpose:** Reusable numeric range (min/max).

**Behavior:**
- Validate min ≤ max
- Allow empty values to mean "no limit"

### `AudiobookCard`
**Purpose:** Show an audiobook summary in lists/grids.

**Shows:**
- Cover image
- Title
- Author
- Duration
- Language
- Category/topic (if available)
- Average rating (stars)

**Action:** Click/Enter opens details.

### `AudiobookList`
**Purpose:** Render a grid/list of `AudiobookCard` items.

**States:** Loading (skeletons), Empty results.

### `Pagination`
**Purpose:** Reusable pagination controls.

**Shows:** Previous, page numbers, Next, total count.

### `SortDropdown`
**Purpose:** Reusable sort-by selector.

---

## Details components

### `BackLink`
**Purpose:** Return to previous screen.

### `Breadcrumb`
**Purpose:** Hierarchical breadcrumb navigation.

### `MetadataList`
**Purpose:** Key/value list for book metadata.

**Behavior:**
- Hide fields that are missing
- Keep order consistent

### `PrimaryActionButton`
**Purpose:** The main action (Play, Add to Cart, Post).

**Behavior:**
- Disabled state includes a reason (tooltip or inline text)
- Loading state with spinner

### `QuickListenPanel`
**Purpose:** Entry point to Quick Listen from details page.

**Shows:**
- Short description ("Listen to a short summary")
- Estimated time (if available)
- Open action

### `SimilarTitlesList`
**Purpose:** Show 5 similar titles.

**Each item shows:**
- Cover thumbnail
- Title
- One-line reason (e.g., "Same topic + similar duration")

### `WishlistButton`
**Purpose:** Add/remove audiobook from wishlist (heart icon toggle).

**Requires auth.**

---

## Reviews and ratings components

### `StarRating`
**Purpose:** Display average rating as stars (read-only).

**Shows:** filled/half/empty stars + numeric average + review count.

### `StarRatingInput`
**Purpose:** Interactive star rating input for reviews.

**Behavior:** Hover highlights, click selects, keyboard accessible.

### `ReviewForm`
**Purpose:** Write a review (star rating + text).

**Requires auth.**

### `ReviewCard`
**Purpose:** Display a single review.

**Shows:** Author avatar, display name, date, star rating, review text.

### `ReviewList`
**Purpose:** Paginated list of reviews with sort options (date/rating).

### `RatingBreakdown`
**Purpose:** Bar chart showing count per star level (5★: 42, 4★: 28, etc.).

---

## Player components

### `MiniPlayer`
**Purpose:** Persistent player bar at the bottom of the viewport.

**Shows:**
- Cover thumbnail
- Title + author/host
- Play/Pause toggle
- Progress bar (compact)
- Speed indicator
- Expand button (opens full player)

**Behavior:**
- Hidden when nothing is playing
- Supports both audiobook and podcast playback

### `PlayerControls`
**Purpose:** Play/pause, skip, and speed controls.

**Must include:**
- Play/Pause toggle
- Skip forward/back (15s/30s)
- Speed control (0.5×–2.0×)

**Accessibility:**
- Buttons have accessible names
- Current speed announced to screen readers

### `ProgressBar`
**Purpose:** Show and control playback progress.

**Shows:**
- Seekable progress track
- Elapsed time
- Total time (if known)

### `NowPlayingHeader`
**Purpose:** Identify what is playing.

**Shows:**
- Cover image (large)
- Title
- Author/host
- "Audiobook" or "Podcast" label

### `SpeedControl`
**Purpose:** Playback speed selector.

**Options:** 0.5×, 0.75×, 1.0×, 1.25×, 1.5×, 2.0×.

---

## Bookstore components

### `PrintBookCard`
**Purpose:** Show a printed book in the bookstore grid.

**Shows:** Cover, title, author, price, availability badge, add to cart button.

### `BookstoreGrid`
**Purpose:** Grid layout for bookstore browsing.

### `BookstoreFilters`
**Purpose:** Sidebar filters for bookstore (genre, price range, availability).

### `BuyPrintPanel`
**Purpose:** Buy section on audiobook detail page.

**Shows:** Price, availability, quantity selector, add to cart.

### `QuantitySelector`
**Purpose:** Reusable +/- quantity input (1–10).

### `CartItemList`
**Purpose:** List of cart items with quantity controls and remove.

### `CartItem`
**Purpose:** Single cart item row.

### `CartSummary`
**Purpose:** Order summary sidebar (subtotal, shipping, total, checkout button).

### `CheckoutForm`
**Purpose:** Shipping information form.

### `OrderReview`
**Purpose:** Review items and totals before placing order.

### `OrderConfirmation`
**Purpose:** Success page after order with order number.

### `OrderHistoryList`
**Purpose:** List of past orders.

### `OrderHistoryItem`
**Purpose:** Single order summary row (date, status, total).

### `OrderDetail`
**Purpose:** Expanded order view with items and status timeline.

### `PriceBadge`
**Purpose:** Formatted price display.

### `AvailabilityBadge`
**Purpose:** In Stock (green) / Out of Stock (red) indicator.

---

## Podcast components

### `PodcastShowCard`
**Purpose:** Show card in the podcast hub grid.

**Shows:** Cover, title, host, category badge, episode count, subscribe toggle.

### `PodcastShowGrid`
**Purpose:** Grid layout for podcast shows.

### `PodcastShowHeader`
**Purpose:** Large header on podcast show detail page.

### `PodcastCategoryChips`
**Purpose:** Horizontal scrollable category filter chips.

### `EpisodeList`
**Purpose:** Paginated episode list within a show.

### `EpisodeListItem`
**Purpose:** Single episode row (number, title, date, duration, play, queue).

### `PodcastQueueList`
**Purpose:** Ordered queue list with reorder controls.

### `PodcastQueueItem`
**Purpose:** Single queue item (show cover, episode title, duration, move/remove).

### `SubscribeButton`
**Purpose:** Subscribe/unsubscribe toggle for a podcast show.

### `PodcastSearchInput`
**Purpose:** Search bar specific to the podcast hub.

---

## Forum components

### `ForumCategoryList`
**Purpose:** Grid/list of forum categories.

### `ForumCategoryCard`
**Purpose:** Single category card with thread count and last activity.

### `ThreadList`
**Purpose:** Paginated list of threads within a category.

### `ThreadListItem`
**Purpose:** Single thread summary row (title, author, replies, votes, last activity).

### `ThreadSortBar`
**Purpose:** Sort options for thread list (recent, newest, voted, replies).

### `ThreadDetail`
**Purpose:** Full thread view — original post + replies.

### `ThreadPost`
**Purpose:** Reusable component for both original post and replies.

**Shows:** Author avatar, name, time, body, vote buttons, action menu.

### `VoteButtons`
**Purpose:** Upvote/downvote with score display.

**Accessibility:** Buttons labeled "Upvote" / "Downvote", score announced.

### `ReplyForm`
**Purpose:** Textarea + submit button for replies.

### `CreateThreadForm`
**Purpose:** Full thread creation form (category, title, body, linked content).

### `ForumSearchInput`
**Purpose:** Search bar for forum content.

### `ForumSearchResults`
**Purpose:** Search results displaying matching threads and replies.

### `LinkedContentBadge`
**Purpose:** Small badge showing a linked audiobook or podcast on a thread.

### `PostActionMenu`
**Purpose:** Dropdown with Edit, Delete (own posts), Report.

---

## Notification components

### `NotificationBell`
**Purpose:** Bell icon in header with unread count badge.

**Behavior:**
- Click opens dropdown with 5 recent notifications
- "View all" link navigates to notifications page

### `NotificationDropdown`
**Purpose:** Dropdown panel showing recent notifications.

### `NotificationList`
**Purpose:** Full page list of all notifications.

### `NotificationItem`
**Purpose:** Single notification (type icon, title, message, time, read/unread).

**Action:** Click navigates to relevant page and marks as read.

---

## Profile components

### `ProfileHeader`
**Purpose:** Display name, avatar, member since date.

### `ProfileNav`
**Purpose:** Sidebar navigation within profile (History, Wishlist, Orders, Reviews, Forum, Subscriptions, Settings).

### `ListeningHistoryList`
**Purpose:** Audiobooks with progress bars.

### `WishlistList`
**Purpose:** List of saved audiobooks with remove action.

### `PurchaseHistoryList`
**Purpose:** List of orders (delegates to `OrderHistoryList`).

### `MyReviewsList`
**Purpose:** Reviews authored by the user.

### `ForumActivityList`
**Purpose:** Threads and replies authored by the user.

### `SettingsForm`
**Purpose:** Notification preferences, password change, display name edit.

---

## Feedback components

### `InlineAlert`
**Purpose:** Simple error/warning/info/success message.

**Use for:** Dataset loading errors, audio not available, form errors.

### `EmptyState`
**Purpose:** Friendly "nothing to show" message + action.

**Use for:** No search results, no similar titles, empty cart, empty queue.

### `Toast`
**Purpose:** Temporary feedback message.

**Use for:** "Added to cart", "Review submitted", "Subscribed", "Item removed (Undo)".

### `ConfirmDialog`
**Purpose:** Confirmation modal for destructive actions.

**Use for:** Delete post, clear cart, cancel order.

### `LoadingSkeleton`
**Purpose:** Placeholder skeleton while content loads.

**Variants:** Card skeleton, list item skeleton, text block skeleton.

---

## MVP component checklist

### Core shell
- [ ] AppShell + Header + MainNav + Footer
- [ ] MiniPlayer

### Auth
- [ ] AuthLayout + LoginForm + SignUpForm
- [ ] UserMenu + AuthGuard

### Audiobooks
- [ ] SearchInput + FilterPanel
- [ ] AudiobookList + AudiobookCard
- [ ] MetadataList + PrimaryActionButton + QuickListenPanel + SimilarTitlesList
- [ ] PlayerControls + ProgressBar + NowPlayingHeader + SpeedControl

### Reviews
- [ ] StarRating + StarRatingInput + ReviewForm + ReviewCard + ReviewList

### Bookstore
- [ ] PrintBookCard + BookstoreGrid + BuyPrintPanel
- [ ] CartItemList + CartSummary + CheckoutForm + OrderConfirmation
- [ ] OrderHistoryList + OrderDetail

### Podcasts
- [ ] PodcastShowCard + PodcastShowGrid + EpisodeList + EpisodeListItem
- [ ] PodcastQueueList + SubscribeButton

### Forum
- [ ] ForumCategoryList + ForumCategoryCard
- [ ] ThreadList + ThreadListItem + ThreadDetail + ThreadPost
- [ ] VoteButtons + ReplyForm + CreateThreadForm

### Profile
- [ ] ProfileHeader + ProfileNav
- [ ] ListeningHistoryList + WishlistList + SettingsForm

### Feedback
- [ ] InlineAlert + EmptyState + Toast + LoadingSkeleton
