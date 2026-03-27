# API Requirements — AudioBooks (MVP)

## Domain Overview
AudioBooks is an accessible audiobook platform for browsing, discovering, and listening to audiobooks. The MVP provides catalog browsing with filters, audiobook details, Quick Listen summaries, and similar title recommendations.

## Target Users
- **Frontend developers**: build the React UI that consumes these endpoints.
- **End users (listeners)**: browse, filter, and play audiobooks locally.

## MVP Endpoints (4)

### 1. List and search audiobooks
`GET /api/audiobooks`

Browse the catalog with optional filters and pagination.

**Query parameters:**
- `q` (string) — search term (matches title, author, topic)
- `language` (string) — filter by language
- `durationMinSeconds` (integer) — minimum duration in seconds
- `durationMaxSeconds` (integer) — maximum duration in seconds
- `author` (string) — filter by author or narrator
- One extra filter field from the dataset (e.g., `narratorType` or `format`)
- `limit` (integer, default 20, max 100) — page size
- `offset` (integer, default 0) — pagination offset

**Response:**
- `items` — array of audiobook summaries (id, title, author, duration, language, category/topic)
- `total` — total count of matching results

### 2. Get audiobook details
`GET /api/audiobooks/<audiobook_id>`

Return full metadata for a single audiobook.

**Response fields** (when available):
- `id`, `title`, `author`, `narrator`, `narratorType` (human/AI)
- `durationSeconds`, `language`, `category`/`topic`
- `synopsis`/`description`
- `audioUrl` or `isPlayable` (boolean)

### 3. Quick Listen
`GET /api/audiobooks/<audiobook_id>/quick-listen`

Return a short summary and estimated listen time.

**Response fields:**
- `summaryText` — text summary (from dataset or first N sentences of synopsis)
- `summaryAudioUrl` — audio summary URL (if available)
- `estimatedListenTimeSeconds` — calculated from word count (e.g., word_count / 150 wpm)
- `notes` — explains when fallback logic was used

### 4. Similar titles
`GET /api/audiobooks/<audiobook_id>/similar`

Return up to 5 similar audiobooks with reasons.

**Query parameters:**
- `limit` (integer, default 5)

**Response:**
- `items` — array of similar audiobooks, each with:
  - `id`, `title`, `author`, `durationSeconds`, `language`
  - `reason` (string, e.g., "Same language + similar duration")

## Data Validation Rules

### Catalog & Content Metadata
- **Title**: 1–200 characters.
- **Synopsis**: 0–5,000 characters.
- **Language**: ISO 639-1 codes preferred.
- **Duration**: positive integer in seconds.

### Query Parameters
- **`q`**: 1–200 characters.
- **`limit`**: 1–100 (default 20).
- **`offset`**: 0 or positive integer.
- **`durationMinSeconds` / `durationMaxSeconds`**: 0 or positive integer; min ≤ max.

## Error Handling

All errors use a consistent JSON format:

```json
{
  "code": "NOT_FOUND",
  "message": "Audiobook not found"
}
```

**Error codes:**
- `400` — bad request (invalid query parameters)
- `404` — audiobook not found
- `500` — unexpected server error

## Non-Functional Requirements

### For the MVP
- Runs locally on `http://localhost:5000`.
- No authentication required.
- CORS enabled for the React frontend on `http://localhost:3000`.
- Responses should be fast enough for local use (no strict latency targets).
- Consistent error format across all endpoints.

### Out of scope
- Authentication / authorization
- Rate limiting
- DRM / streaming licenses
- Progress sync / bookmarks / voice notes
- Creator workflows / moderation
- Subscriptions / payments
- Production deployment / HTTPS
