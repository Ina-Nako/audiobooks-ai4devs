# Features Overview — AudioBooks

## Purpose of this document

This document provides a detailed breakdown of every feature area in the platform, with user stories, data models, and acceptance criteria.

---

## 1. Authentication & User Management

### User stories
- As a visitor, I can sign up with my email and password so I have a personal account.
- As a user, I can log in to access my library, forum posts, and purchases.
- As a user, I can reset my password if I forget it.
- As a user, I can edit my display name and avatar.
- As a user, I can log out from any device.

### Data model: User
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | auto-generated |
| email | string | yes | unique, validated format |
| password_hash | string | yes | bcrypt hashed |
| display_name | string | yes | 2–50 characters |
| avatar_url | string | no | URL or default placeholder |
| created_at | datetime | yes | auto |
| updated_at | datetime | yes | auto |

### Acceptance criteria
- Passwords are hashed with bcrypt (never stored in plain text).
- JWT access tokens expire after 1 hour; refresh tokens after 7 days.
- Email is unique and validated on registration.
- Protected endpoints return 401 without a valid token.

---

## 2. Audiobook Catalog & Player

### User stories
- As a user, I can browse all audiobooks in a paginated list.
- As a user, I can search audiobooks by title, author, or topic.
- As a user, I can filter by language, duration, genre, author, and rating.
- As a user, I can open a detail page to see full metadata.
- As a user, I can play/pause an audiobook and control speed.
- As a user, I can see my playback progress saved across sessions.
- As a user, I can use Quick Listen for a short summary.
- As a user, I can discover 5 similar titles with reasons.

### Data model: Audiobook
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | stable ID |
| title | string | yes | 1–200 chars |
| author | string | yes | |
| narrator | string | no | |
| narrator_type | string | no | "human" or "ai" |
| duration_seconds | integer | yes | positive |
| language | string | yes | ISO 639-1 |
| category | string | no | genre/topic |
| synopsis | text | no | 0–5000 chars |
| cover_image_url | string | no | |
| audio_url | string | no | null if not playable |
| is_playable | boolean | yes | derived from audio_url |
| average_rating | float | no | 0.0–5.0, computed |
| review_count | integer | no | computed |
| print_price | decimal | no | null if no print edition |
| print_available | boolean | yes | default false |
| created_at | datetime | yes | |

### Data model: ListeningProgress
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| audiobook_id | string | yes | FK → Audiobook |
| position_seconds | integer | yes | last position |
| completed | boolean | yes | default false |
| updated_at | datetime | yes | |

### Acceptance criteria
- Catalog supports pagination (limit/offset) with total count.
- All filters can be combined.
- Player persists position for logged-in users.
- Quick Listen returns a deterministic summary.
- Similar titles are sorted by relevance score, not random.

---

## 3. Reviews & Ratings

### User stories
- As a user, I can rate an audiobook from 1 to 5 stars.
- As a user, I can write a text review for an audiobook.
- As a user, I can edit or delete my own review.
- As a visitor, I can see reviews and average ratings on any audiobook.

### Data model: Review
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| audiobook_id | string | yes | FK → Audiobook |
| rating | integer | yes | 1–5 |
| text | text | no | 0–2000 chars |
| created_at | datetime | yes | |
| updated_at | datetime | yes | |

**Constraint:** unique (user_id, audiobook_id) — one review per user per book.

### Acceptance criteria
- Average rating recalculates on review create/update/delete.
- Reviews are paginated and sortable by date or rating.
- Only the review author can edit/delete.

---

## 4. Bookstore (Printed Copies)

### User stories
- As a user, I can browse printed books available for purchase.
- As a user, I can add a book to my shopping cart.
- As a user, I can adjust quantities or remove items from my cart.
- As a user, I can checkout with a shipping address and see an order confirmation.
- As a user, I can view my order history and current order status.

### Data model: PrintBook
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| audiobook_id | string | yes | FK → Audiobook (same book) |
| price | decimal | yes | in USD |
| stock_quantity | integer | yes | 0 = out of stock |
| isbn | string | no | |
| pages | integer | no | |
| publisher | string | no | |
| cover_image_url | string | no | |

### Data model: CartItem
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| print_book_id | UUID | yes | FK → PrintBook |
| quantity | integer | yes | 1+ |

### Data model: Order
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| status | string | yes | "pending", "confirmed", "shipped", "delivered" |
| total_amount | decimal | yes | |
| shipping_name | string | yes | |
| shipping_address | text | yes | |
| shipping_address_line2 | text | no | optional second line |
| shipping_city | string | yes | |
| shipping_state | string | no | state/province |
| shipping_zip | string | yes | |
| shipping_country | string | yes | |
| created_at | datetime | yes | |
| updated_at | datetime | yes | |

### Data model: OrderItem
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| order_id | UUID | yes | FK → Order |
| print_book_id | UUID | yes | FK → PrintBook |
| quantity | integer | yes | |
| unit_price | decimal | yes | snapshot at time of order |

### Acceptance criteria
- Cart persists across sessions for logged-in users.
- Checkout reduces stock quantity.
- Orders show correct totals and item breakdown.
- Payment is simulated (always succeeds).
- Order status starts as "confirmed" after checkout.

---

## 5. Podcast Hub

### User stories
- As a user, I can browse a catalog of podcast shows.
- As a user, I can filter podcasts by category.
- As a user, I can open a show and see its episodes.
- As a user, I can play a podcast episode in the built-in player.
- As a user, I can subscribe to a show and see new episodes.
- As a user, I can manage a personal episode queue.

### Data model: PodcastShow
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| title | string | yes | |
| description | text | no | |
| host | string | yes | |
| cover_image_url | string | no | |
| category | string | yes | e.g., "Author Interviews", "Book Clubs" |
| website_url | string | no | |
| created_at | datetime | yes | |

### Data model: PodcastEpisode
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| show_id | UUID | yes | FK → PodcastShow |
| title | string | yes | |
| description | text | no | |
| duration_seconds | integer | yes | |
| audio_url | string | yes | |
| publish_date | date | yes | |
| episode_number | integer | no | |
| season_number | integer | no | |

### Data model: PodcastSubscription
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| show_id | UUID | yes | FK → PodcastShow |
| created_at | datetime | yes | |

### Data model: PodcastQueue
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| episode_id | UUID | yes | FK → PodcastEpisode |
| position | integer | yes | order in queue |
| added_at | datetime | yes | |

### Acceptance criteria
- Shows are browsable and filterable by category.
- Episodes are listed in reverse chronological order.
- Player handles both audiobook and podcast playback.
- Queue is orderable (drag-and-drop not required; up/down buttons are fine).

---

## 6. Community Forum

### User stories
- As a user, I can browse forum categories and see active threads.
- As a user, I can create a new discussion thread.
- As a user, I can reply to an existing thread.
- As a user, I can upvote or downvote threads and replies.
- As a user, I can edit or delete my own posts.
- As a user, I can search forum content.
- As a user, I can link a thread to a specific audiobook or podcast.
- As a user, I can report inappropriate content.

### Data model: ForumCategory
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| name | string | yes | e.g., "Audiobook Discussions" |
| description | string | no | |
| slug | string | yes | URL-friendly |
| sort_order | integer | yes | display order |

### Data model: ForumThread
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| category_id | UUID | yes | FK → ForumCategory |
| user_id | UUID | yes | FK → User (author) |
| title | string | yes | 5–200 chars |
| body | text | yes | 10–10000 chars |
| audiobook_id | string | no | FK → Audiobook (optional link) |
| podcast_id | UUID | no | FK → PodcastShow (optional link) |
| upvotes | integer | yes | default 0 |
| downvotes | integer | yes | default 0 |
| reply_count | integer | yes | computed, default 0 |
| is_pinned | boolean | yes | default false |
| is_locked | boolean | yes | default false |
| created_at | datetime | yes | |
| updated_at | datetime | yes | |

### Data model: ForumReply
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| thread_id | UUID | yes | FK → ForumThread |
| user_id | UUID | yes | FK → User |
| body | text | yes | 1–5000 chars |
| upvotes | integer | yes | default 0 |
| downvotes | integer | yes | default 0 |
| created_at | datetime | yes | |
| updated_at | datetime | yes | |

### Data model: Vote
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| target_type | string | yes | "thread" or "reply" |
| target_id | UUID | yes | FK → ForumThread or ForumReply |
| value | integer | yes | +1 or -1 |

**Constraint:** unique (user_id, target_type, target_id) — one vote per user per target.

### Acceptance criteria
- Thread list shows reply count and last activity.
- Voting updates counts immediately.
- Users can only edit/delete their own posts.
- Search returns threads and replies matching the query.
- Linked audiobooks/podcasts show a clickable reference.

---

## 7. Notifications

### Data model: Notification
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| type | string | yes | "forum_reply", "podcast_episode", "order_update" |
| title | string | yes | |
| message | string | yes | |
| link | string | no | URL to navigate to |
| is_read | boolean | yes | default false |
| created_at | datetime | yes | |

### Acceptance criteria
- Notification bell shows unread count.
- Clicking a notification marks it as read and navigates to the relevant page.
- "Mark all as read" clears the unread count.

---

## 8. Home Page

### Sections
1. **Hero banner** — featured audiobook or promotion.
2. **Continue Listening** — (logged-in users) audiobooks with saved progress.
3. **Trending Audiobooks** — top-rated or most-listened recently.
4. **Latest Podcast Episodes** — newest episodes across all shows.
5. **Active Discussions** — forum threads with recent activity.
6. **Personalized Picks** — (logged-in users) based on listening history genres.

### Acceptance criteria
- Sections load independently (one failing section doesn't break the page).
- Continue Listening and Personalized Picks only show for authenticated users.
- Unauthenticated users see public sections + a sign-up prompt.

---

## 9. User Profile & Library

### Sections
1. **Profile Info** — display name, avatar, member since date.
2. **Listening History** — audiobooks listened to, with progress.
3. **Wishlist** — saved audiobooks for later.
4. **Purchase History** — orders and their statuses.
5. **My Reviews** — reviews written by the user.
6. **Forum Activity** — threads and replies by the user.
7. **Podcast Subscriptions** — subscribed shows.
8. **Settings** — notification preferences, password change.

### Data model: Wishlist
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | UUID | yes | |
| user_id | UUID | yes | FK → User |
| audiobook_id | string | yes | FK → Audiobook |
| added_at | datetime | yes | |

### Acceptance criteria
- Profile is only accessible to the authenticated user (own profile).
- All sections load with proper empty states.
- Wishlist add/remove is available on audiobook detail pages.
