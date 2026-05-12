# API Requirements — AudioBooks (Full Platform)

## Domain Overview

AudioBooks is a full audiobook platform with catalog browsing, playback, printed book purchasing, podcast listening, community forum, and user authentication. This document defines all API endpoints needed for the complete platform.

## Tech Stack
- **Framework:** Python Flask
- **Auth:** JWT (Flask-JWT-Extended)
- **Database:** SQLAlchemy (SQLite dev / PostgreSQL production)
- **CORS:** Flask-CORS (frontend on `http://localhost:3000`)

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Create a new user account.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1",
  "display_name": "Jane Reader"
}
```

**Response (201):**
```json
{
  "user": { "id": "uuid", "email": "...", "display_name": "..." },
  "access_token": "jwt...",
  "refresh_token": "jwt..."
}
```

**Validation:** email unique + valid format, password min 8 chars + 1 uppercase + 1 number, display_name 2–50 chars.

### `POST /api/auth/login`
Authenticate and receive tokens.

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass1"
}
```

**Response (200):** Same shape as register.

### `POST /api/auth/refresh`
Refresh an expired access token.

**Headers:** `Authorization: Bearer <refresh_token>`

**Response (200):**
```json
{
  "access_token": "jwt..."
}
```

### `POST /api/auth/forgot-password`
Request a password reset email.

**Request body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):** Always returns success (don't reveal if email exists).

### `POST /api/auth/reset-password`
Set a new password using a reset token.

**Request body:**
```json
{
  "token": "reset-token",
  "new_password": "NewSecure1"
}
```

### `POST /api/auth/logout`
Invalidate the current token (optional — JWT revocation list).

---

## 2. User Profile Endpoints

### `GET /api/users/me`
Get the current user's profile.

**Auth required.**

**Response:**
```json
{
  "id": "uuid",
  "email": "...",
  "display_name": "...",
  "avatar_url": "...",
  "created_at": "...",
  "stats": {
    "books_listened": 12,
    "reviews_written": 5,
    "forum_posts": 23,
    "orders_placed": 3
  }
}
```

### `PATCH /api/users/me`
Update profile (display_name, avatar_url).

**Auth required.**

### `GET /api/users/me/listening-history`
Get audiobooks the user has listened to with progress.

**Auth required. Paginated.**

### `GET /api/users/me/wishlist`
Get the user's wishlist.

**Auth required. Paginated.**

### `POST /api/users/me/wishlist`
Add an audiobook to the wishlist.

**Auth required.**

**Request body:**
```json
{
  "audiobook_id": "abc123"
}
```

### `DELETE /api/users/me/wishlist/:audiobook_id`
Remove an audiobook from the wishlist.

**Auth required.**

---

## 3. Audiobook Endpoints

### `GET /api/audiobooks`
List and search audiobooks with filters and pagination.

**Query parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | search in title/author/topic |
| `language` | string | — | filter by language |
| `category` | string | — | filter by category/genre |
| `author` | string | — | filter by author |
| `minRating` | float | — | minimum average rating |
| `durationMinSeconds` | int | — | minimum duration |
| `durationMaxSeconds` | int | — | maximum duration |
| `narratorType` | string | — | "human" or "ai" |
| `hasPrintEdition` | boolean | — | only books with print copies |
| `sortBy` | string | "title" | title, rating, duration, newest |
| `limit` | int | 20 | page size (1–100) |
| `offset` | int | 0 | pagination offset |

**Response (200):**
```json
{
  "items": [
    {
      "id": "abc123",
      "title": "...",
      "author": "...",
      "duration_seconds": 36000,
      "language": "en",
      "category": "Fiction",
      "cover_image_url": "...",
      "average_rating": 4.2,
      "review_count": 15,
      "is_playable": true,
      "has_print_edition": true
    }
  ],
  "total": 156,
  "limit": 20,
  "offset": 0
}
```

### `GET /api/audiobooks/:audiobook_id`
Get full audiobook details.

**Response (200):**
```json
{
  "id": "abc123",
  "title": "...",
  "author": "...",
  "narrator": "...",
  "narrator_type": "human",
  "duration_seconds": 36000,
  "language": "en",
  "category": "Fiction",
  "synopsis": "...",
  "cover_image_url": "...",
  "audio_url": "...",
  "is_playable": true,
  "average_rating": 4.2,
  "review_count": 15,
  "print_edition": {
    "id": "uuid",
    "price": 14.99,
    "stock_quantity": 25,
    "isbn": "...",
    "pages": 350,
    "publisher": "..."
  }
}
```

### `GET /api/audiobooks/:audiobook_id/quick-listen`
Get a short summary and estimated listen time.

**Response (200):**
```json
{
  "summary_text": "...",
  "summary_audio_url": "..." ,
  "estimated_listen_time_seconds": 180,
  "notes": "Summary generated from first 3 sentences of synopsis."
}
```

### `GET /api/audiobooks/:audiobook_id/similar`
Get up to 5 similar audiobooks with reasons.

**Query parameters:**
- `limit` (int, default 5)

**Response (200):**
```json
{
  "items": [
    {
      "id": "def456",
      "title": "...",
      "author": "...",
      "duration_seconds": 32000,
      "language": "en",
      "cover_image_url": "...",
      "reason": "Same language + similar duration"
    }
  ]
}
```

### `POST /api/audiobooks/:audiobook_id/progress`
Save listening progress.

**Auth required.**

**Request body:**
```json
{
  "position_seconds": 1234,
  "completed": false
}
```

---

## 4. Reviews Endpoints

### `GET /api/audiobooks/:audiobook_id/reviews`
Get reviews for an audiobook.

**Query parameters:**
- `sortBy` (string): "newest", "oldest", "highest", "lowest" (default "newest")
- `limit` (int, default 10)
- `offset` (int, default 0)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "user": { "id": "uuid", "display_name": "...", "avatar_url": "..." },
      "rating": 5,
      "text": "...",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 15,
  "average_rating": 4.2,
  "rating_breakdown": { "5": 8, "4": 3, "3": 2, "2": 1, "1": 1 }
}
```

### `POST /api/audiobooks/:audiobook_id/reviews`
Submit a review.

**Auth required.**

**Request body:**
```json
{
  "rating": 5,
  "text": "An incredible listen!"
}
```

### `PUT /api/audiobooks/:audiobook_id/reviews/:review_id`
Update own review.

**Auth required.**

### `DELETE /api/audiobooks/:audiobook_id/reviews/:review_id`
Delete own review.

**Auth required.**

---

## 5. Bookstore Endpoints

### `GET /api/bookstore`
List printed books available for purchase.

**Query parameters:**
- `q` (string) — search
- `category` (string) — filter by genre
- `minPrice` / `maxPrice` (float) — price range
- `inStock` (boolean) — only available items
- `sortBy` (string) — "price_asc", "price_desc", "rating", "title"
- `limit` / `offset` — pagination

**Response:** Same structure as audiobook list, with `price`, `stock_quantity`, `isbn` fields.

### `GET /api/bookstore/:book_id`
Get printed book details.

### `GET /api/cart`
Get the current user's shopping cart.

**Auth required.**

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "book": { "id": "uuid", "title": "...", "author": "...", "price": 14.99, "cover_image_url": "..." },
      "quantity": 2,
      "subtotal": 29.98
    }
  ],
  "total_items": 3,
  "total_amount": 44.97,
  "shipping": 0.00,
  "grand_total": 44.97
}
```

### `POST /api/cart/items`
Add item to cart.

**Auth required.**

**Request body:**
```json
{
  "book_id": "uuid",
  "quantity": 1
}
```

### `PATCH /api/cart/items/:item_id`
Update quantity.

**Auth required.**

### `DELETE /api/cart/items/:item_id`
Remove item from cart.

**Auth required.**

### `POST /api/orders`
Place an order (checkout).

**Auth required.**

**Request body:**
```json
{
  "shipping_name": "Jane Doe",
  "shipping_address": "123 Book St",
  "shipping_address_line2": "Apt 4B",
  "shipping_city": "Portland",
  "shipping_state": "OR",
  "shipping_zip": "97201",
  "shipping_country": "US"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "order_number": "ORD-20260427-001",
  "status": "confirmed",
  "items": [...],
  "total_amount": 44.97,
  "created_at": "..."
}
```

### `GET /api/orders`
Get order history.

**Auth required. Paginated.**

### `GET /api/orders/:order_id`
Get order details.

**Auth required.**

---

## 6. Podcast Endpoints

### `GET /api/podcasts`
List podcast shows.

**Query parameters:**
- `q` (string) — search in title/host/description
- `category` (string) — filter by category
- `limit` / `offset` — pagination

### `GET /api/podcasts/:show_id`
Get podcast show details with recent episodes.

### `GET /api/podcasts/:show_id/episodes`
List episodes for a show.

**Query parameters:**
- `limit` / `offset` — pagination
- `sortBy` — "newest" (default), "oldest"

### `GET /api/podcasts/episodes/:episode_id`
Get single episode details.

### `POST /api/podcasts/:show_id/subscribe`
Subscribe to a show.

**Auth required.**

### `DELETE /api/podcasts/:show_id/subscribe`
Unsubscribe from a show.

**Auth required.**

### `GET /api/podcasts/subscriptions`
Get user's subscribed shows.

**Auth required.**

### `GET /api/podcasts/queue`
Get user's episode queue.

**Auth required.**

### `POST /api/podcasts/queue`
Add an episode to the queue.

**Auth required.**

**Request body:**
```json
{
  "episode_id": "uuid"
}
```

### `PATCH /api/podcasts/queue/:queue_item_id`
Reorder a queue item (change position).

**Auth required.**

### `DELETE /api/podcasts/queue/:queue_item_id`
Remove an episode from the queue.

**Auth required.**

---

## 7. Forum Endpoints

### `GET /api/forum/categories`
List all forum categories.

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Audiobook Discussions",
      "description": "Talk about audiobooks you're listening to",
      "slug": "audiobook-discussions",
      "thread_count": 42,
      "last_activity": "..."
    }
  ]
}
```

### `GET /api/forum/categories/:slug/threads`
List threads in a category.

**Query parameters:**
- `sortBy` — "recent" (default), "newest", "most_voted", "most_replies"
- `limit` / `offset` — pagination

### `GET /api/forum/threads/:thread_id`
Get a thread with its replies.

**Query parameters:**
- `limit` / `offset` — for reply pagination

**Response:**
```json
{
  "id": "uuid",
  "title": "...",
  "body": "...",
  "category": { "id": "uuid", "name": "...", "slug": "..." },
  "user": { "id": "uuid", "display_name": "...", "avatar_url": "..." },
  "audiobook": { "id": "abc123", "title": "..." },
  "podcast": null,
  "upvotes": 12,
  "downvotes": 2,
  "reply_count": 5,
  "is_pinned": false,
  "is_locked": false,
  "created_at": "...",
  "updated_at": "...",
  "replies": {
    "items": [...],
    "total": 5
  }
}
```

### `POST /api/forum/threads`
Create a new thread.

**Auth required.**

**Request body:**
```json
{
  "category_id": "uuid",
  "title": "Best sci-fi audiobooks?",
  "body": "Looking for recommendations...",
  "audiobook_id": null,
  "podcast_id": null
}
```

### `PUT /api/forum/threads/:thread_id`
Edit own thread (title, body).

**Auth required.**

### `DELETE /api/forum/threads/:thread_id`
Delete own thread.

**Auth required.**

### `POST /api/forum/threads/:thread_id/replies`
Post a reply.

**Auth required.**

**Request body:**
```json
{
  "body": "I recommend..."
}
```

### `PUT /api/forum/replies/:reply_id`
Edit own reply.

**Auth required.**

### `DELETE /api/forum/replies/:reply_id`
Delete own reply.

**Auth required.**

### `POST /api/forum/vote`
Vote on a thread or reply.

**Auth required.**

**Request body:**
```json
{
  "target_type": "thread",
  "target_id": "uuid",
  "value": 1
}
```

`value`: 1 (upvote), -1 (downvote), 0 (remove vote).

### `POST /api/forum/report`
Report a thread or reply.

**Auth required.**

**Request body:**
```json
{
  "target_type": "thread",
  "target_id": "uuid",
  "reason": "Spam"
}
```

### `GET /api/forum/search`
Search forum threads and replies.

**Query parameters:**
- `q` (string, required)
- `limit` / `offset`

---

## 8. Notification Endpoints

### `GET /api/notifications`
Get user's notifications.

**Auth required.**

**Query parameters:**
- `unread_only` (boolean, default false)
- `limit` / `offset`

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "forum_reply",
      "title": "New reply to your thread",
      "message": "John replied to 'Best sci-fi audiobooks?'",
      "link": "/forum/thread/uuid",
      "is_read": false,
      "created_at": "..."
    }
  ],
  "total": 15,
  "unread_count": 3
}
```

### `PATCH /api/notifications/:notification_id`
Mark a notification as read.

**Auth required.**

### `POST /api/notifications/mark-all-read`
Mark all notifications as read.

**Auth required.**

---

## 9. Home Page Endpoints

### `GET /api/home/featured`
Get featured/trending audiobooks.

### `GET /api/home/latest-episodes`
Get latest podcast episodes across all shows.

### `GET /api/home/active-discussions`
Get forum threads with recent activity.

### `GET /api/home/continue-listening`
Get user's in-progress audiobooks.

**Auth required.**

### `GET /api/home/recommendations`
Get personalized audiobook picks.

**Auth required.**

---

## Error Handling

All errors use a consistent JSON format:

```json
{
  "code": "NOT_FOUND",
  "message": "Audiobook not found",
  "details": {}
}
```

**HTTP status codes:**
| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Invalid query parameters, validation errors |
| 401 | Unauthorized | Missing or expired JWT token |
| 403 | Forbidden | Trying to edit another user's review |
| 404 | Not Found | Audiobook/thread/order not found |
| 409 | Conflict | Duplicate email, already reviewed |
| 422 | Unprocessable Entity | Business logic error (out of stock) |
| 500 | Internal Server Error | Unexpected server failure |

**Validation error detail:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request",
  "details": {
    "email": "Invalid email format",
    "password": "Must be at least 8 characters"
  }
}
```

---

## Non-Functional Requirements

### For the MVP
- Runs locally on `http://localhost:5000`.
- JWT auth with bcrypt password hashing.
- CORS enabled for `http://localhost:3000`.
- Consistent error format across all endpoints.
- All list endpoints support pagination (limit/offset/total).
- Protected endpoints return 401 without valid token.

### Out of scope
- Rate limiting
- DRM / streaming licenses
- Real payment processing
- Email sending (password reset tokens returned directly)
- File upload (avatars use URL)
- WebSocket (notifications are polled)
- Production deployment
