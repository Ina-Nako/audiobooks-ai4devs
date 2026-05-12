# Product Scope — AudioBooks

## Purpose of this document

This document defines what the MVP includes, excludes, and must achieve.

## Scope objective

Build a web application that lets users browse and listen to audiobooks, buy printed copies, explore podcasts, and discuss books in a community forum — all behind a user authentication system.

Prioritize complete user flows (browse → listen, browse → buy, discuss → discover) over deep polish in any single area.

## In scope

The following items are included in this version of the project.

### 1. User authentication and profiles
- User registration (email + password).
- User login / logout with JWT tokens.
- Password reset flow.
- User profile page with editable display name and avatar.
- Personal library: listening history, wishlist, purchased books.
- Notification preferences.

### 2. Data loading and preprocessing
- Load the audiobook dataset from the repository.
- Check required fields exist (at minimum: title, author, duration, language, and some way to know if audio is playable).
- Fill/handle missing values using simple, documented rules.
- Create a stable internal ID if the dataset does not have one.
- Output cleaned data for the app (and for any recommendation logic).

### 3. Catalog browser
- Show a list of audiobooks.
- Show key summary info (title, author, duration, language, and category/topic if available).
- Let the user open an audiobook details page.
- Show average rating and review count per audiobook.

### 4. Filters

The application must support filtering audiobooks by at least:
- Duration range.
- Language.
- Category/genre/topic (or the closest available field).
- Author (or narrator if author is missing).
- Rating (minimum stars).
- One more simple field (for example: narrator type, release year, or format).

### 5. Audiobook details page

Each audiobook must have a details view that shows (when available):
- Title.
- Author.
- Narrator (and narrator type: human/AI, if available).
- Duration.
- Language.
- Category/genre/topic.
- Description/synopsis.
- Audio availability/source info.
- Average rating and review count.
- User reviews section.
- Option to buy the printed copy (links to bookstore).

### 6. Player and accessibility controls

The application must include a player experience that supports:
- Start, pause, and resume.
- Playback speed control.
- Progress tracking (elapsed / total time).
- Basic accessibility (keyboard navigation and screen-reader-friendly labels).
- Persistent mini-player across pages (so audio doesn't stop on navigation).

### 7. Quick Listen (short summary)

The details page must include a "Quick Listen" option that provides:
- A short written and audio summary.
- An estimated listen time.

### 8. Similar titles (comparable audiobooks)

The details page must display 5 similar audiobooks.

Similar titles should be selected using simple similarity rules based on:
- Shared category/genre/topic.
- Similar duration.
- Same language.
- Same author and/or narrator (when available).
- Other relevant structured features when available.

Each similar title should include a short reason explaining why it is similar.

### 9. Reviews and ratings

- Authenticated users can rate audiobooks (1–5 stars).
- Authenticated users can write text reviews.
- Detail pages show aggregate rating and a list of reviews.
- Reviews can be sorted by date or rating.
- Each user can submit one review per audiobook (editable).

### 10. Bookstore (printed copies)

- Audiobook detail pages link to a "Buy Printed Copy" option.
- Dedicated bookstore section listing available printed books.
- Book listing shows: title, author, cover image, price, availability.
- Shopping cart: add/remove items, update quantities.
- Checkout flow: shipping info, order summary, confirmation.
- Order history: authenticated users can view past orders and status.
- Note: payment processing is simulated (no real payment gateway in MVP).

### 11. Podcast hub

- Browse a catalog of book-related podcast shows.
- Each show has: title, description, cover image, host, category.
- Browse episodes within a show: title, description, duration, publish date.
- Play podcast episodes using the built-in audio player.
- Subscribe/unsubscribe to podcast shows.
- Manage a personal podcast queue (add/remove/reorder episodes).
- Filter podcasts by category (author interviews, book clubs, literary analysis, etc.).

### 12. Community forum

- Browse forum categories (Audiobook Discussions, Book Reviews, Recommendations, Podcast Talk, General).
- View thread list per category with: title, author, reply count, last activity.
- Create new discussion threads (title + body + category).
- Reply to threads.
- Upvote/downvote threads and replies.
- Edit and delete own posts.
- Search across forum threads and replies.
- Link threads to specific audiobooks or podcasts.
- Basic moderation: report posts (admin review is post-MVP).

### 13. Home page

- Featured/trending audiobooks.
- Latest podcast episodes.
- Active forum discussions.
- Personalized "continue listening" section (for logged-in users).
- Personalized recommendations (for logged-in users).

### 14. Notifications

- In-app notification bell with unread count.
- Notification types: forum replies to your threads, new episodes from subscribed podcasts, order status updates.
- Mark as read / mark all as read.

### 15. Local execution

The full project must run locally for demonstration and learning purposes.

The repository must include enough setup instructions so another developer can run the project without guesswork.

## Out of scope

The following items are not required in this version.

- Bookmarks and voice notes within audiobooks.
- Pitch and voice customization.
- Admin moderation panel and creator tools.
- High-contrast mode and dyslexia-friendly font (accessibility beyond keyboard + screen reader basics).
- External paid APIs or real payment gateways.
- Production deployment / HTTPS / CDN.
- Full-text semantic search.
- Media pipelines beyond what is needed to play audio.
- In-app retraining or complex dashboards.
- Mobile app development.
- Social sharing.
- Gift cards.
- Author verified accounts.
- AI-powered recommendations (simple rules-based for MVP).
- Rate limiting / DDoS protection.

These items can be added later only after the core platform is complete and stable.

## MVP requirements

A version can be considered a valid MVP only if all of the following are true:

1. A user can sign up and log in.
2. A user can browse the audiobook catalog.
3. A user can apply filters.
4. A user can open an audiobook details page.
5. A user can start playback and change speed.
6. A user can open Quick Listen and see the estimated time.
7. A user can see 5 similar titles with a short reason for each.
8. A user can rate and review an audiobook.
9. A user can browse and buy a printed copy (simulated payment).
10. A user can browse podcast shows and play episodes.
11. A user can create a forum thread and reply to existing threads.
12. A user can view their profile with listening history and purchases.
13. The home page shows featured content and personalized sections.

If any of these core steps is missing, the project should not be treated as complete.

## Functional expectations

The application should satisfy the following functional expectations:

- The catalog page should load usable audiobook data.
- Filters should update the visible results correctly.
- The details page should show the main audiobook information clearly.
- Playback should work when audio is available (otherwise show a clear "not available" state).
- Quick Listen should come from project data or a repeatable process.
- Similar titles should come from the dataset and not be random.
- Reviews display aggregate ratings accurately.
- The bookstore shows available books with prices and handles cart/checkout correctly.
- Podcast episodes play correctly through the audio player.
- Forum threads maintain correct ordering and reply counts.
- Authentication protects routes that require login.
- The website should be understandable without reading the source code.

## Non-functional expectations

The application should also follow these quality expectations:

- Clear project structure.
- Readable code.
- Predictable local setup.
- Reasonable error handling for missing/incomplete metadata.
- Consistent naming across backend, frontend, and documentation.
- Secure password handling (hashed, never stored in plain text).
- JWT tokens with reasonable expiration.
- Documentation that supports step-by-step learning and AI-assisted development.

## Data assumptions

The project assumes the dataset may contain:
- Missing values (for example: narrator, genre, description).
- Inconsistent records (for example: genre/language names).
- Outliers (very short/very long durations).
- Missing unique identifiers.
- Optional media fields (some items may not have playable audio).
- No pricing data (prices for printed copies will be seed data or defaults).
- No podcast data initially (seed data will be created).

The implementation must handle these cases with simple and explicit rules rather than hidden assumptions.

## Feature prioritization

Features should be implemented in this priority order:

1. Data loading and preprocessing.
2. User authentication (sign up, log in, JWT).
3. Catalog browser.
4. Filters.
5. Audiobook details page.
6. Player basics.
7. Accessibility basics.
8. Quick Listen.
9. Similar titles.
10. Reviews and ratings.
11. Bookstore (printed copies).
12. Podcast hub.
13. Community forum.
14. Home page with personalized sections.
15. Notifications.
16. User profile and library.
17. UI polish.

This order is important because later features depend on the earlier ones.

## Change rules

If a feature does not improve a core user flow, postpone it.

Prefer a complete set of working flows over deeply polished individual features.

## Definition of done

The project is done when:
- The application runs locally.
- Users can sign up, log in, and manage their profile.
- The main browse-to-details-to-listen flow works.
- Quick Listen is available and consistent.
- 5 similar titles are shown with simple justification.
- Users can rate and review audiobooks.
- Users can browse and buy printed copies.
- Users can browse and listen to podcasts.
- Users can create and participate in forum discussions.
- The home page shows relevant featured content.
- The repository includes clear setup and usage instructions.
- The codebase is organized enough for a developer or AI coding agent to continue development safely.
