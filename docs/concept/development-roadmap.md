# Development Roadmap — AudioBooks

## Purpose

This document outlines the incremental steps to build the full platform.

Each phase is small, has clear success criteria, and builds on the previous one.

Use this as a checklist for manual development or when prompting AI coding agents.

**Tech stack:** Python Flask + SQLAlchemy (backend API) · React (frontend)

**Environment:** Linux / macOS / Windows. All commands should work cross-platform.

---

## Phase 0 — Repo setup and documentation

**Status:** ✅ Complete

**Goal:** Complete documentation that describes every feature, screen, API endpoint, and component.

**Deliverables:**
- [x] `README.md` — project overview and setup instructions
- [x] `docs/concept/01-project-brief.md` — vision and target users
- [x] `docs/concept/02-product-scope.md` — what's in/out of scope
- [x] `docs/concept/03-features-overview.md` — detailed features with data models
- [x] `docs/concept/development-roadmap.md` — this file
- [x] `docs/ui/04-ui-style-guide.md` — design system
- [x] `docs/ui/05-ui-screens-and-flow.md` — all screens and routes
- [x] `docs/ui/06-ui-components.md` — reusable React components
- [x] `docs/ui/07-ui-auth.md` — auth screens
- [x] `docs/ui/08-ui-forum.md` — forum screens
- [x] `docs/ui/09-ui-podcast.md` — podcast screens
- [x] `docs/ui/10-ui-bookstore.md` — bookstore screens
- [x] `docs/api/api-requirements.md` — full API endpoint reference
- [ ] `AGENTS.md` — instructions for AI coding agents
- [ ] `data/` folder with audiobook dataset + seed data

---

## Phase 1 — Backend scaffold + database + data loading

**Status:** ⏳ Not started

**Goal:** Set up the Flask app with SQLAlchemy, define all database models, load seed data, and expose the first set of API endpoints.

**Estimated effort:** 3–4 hours

**Docs to read:**
- `docs/concept/02-product-scope.md`
- `docs/concept/03-features-overview.md` (data models)
- `docs/api/api-requirements.md`

**Instructions for agent:**

Create `backend/` folder:
```
backend/
├── app.py                  # Flask app entry point
├── config.py               # App configuration
├── models/                 # SQLAlchemy models
│   ├── __init__.py
│   ├── user.py
│   ├── audiobook.py
│   ├── review.py
│   ├── print_book.py
│   ├── order.py
│   ├── podcast.py
│   ├── forum.py
│   └── notification.py
├── routes/                 # API route blueprints
│   ├── __init__.py
│   ├── auth.py
│   ├── users.py
│   ├── audiobooks.py
│   ├── reviews.py
│   ├── bookstore.py
│   ├── podcasts.py
│   ├── forum.py
│   ├── notifications.py
│   └── home.py
├── services/               # Business logic
│   ├── __init__.py
│   ├── auth_service.py
│   ├── audiobook_service.py
│   ├── review_service.py
│   ├── bookstore_service.py
│   ├── podcast_service.py
│   ├── forum_service.py
│   └── notification_service.py
├── preprocessing.py        # Data loading and cleaning
├── seed_data.py            # Seed data generator
├── requirements.txt
└── README.md
```

- Define all SQLAlchemy models from `03-features-overview.md`.
- Use SQLite for development (`audiobooks.db`).
- Create `preprocessing.py` to load audiobook dataset from `data/`.
- Create `seed_data.py` to generate seed data for podcasts, forum categories, and print books.
- Set up Flask with CORS, blueprints, and error handling.

**Success criteria:**
- `cd backend && pip install -r requirements.txt && python app.py` starts the server.
- Database is created with all tables.
- Seed data populates the database on first run.

---

## Phase 2 — Authentication

**Status:** ⏳ Not started

**Goal:** Implement user registration, login, JWT tokens, and route protection.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Implement `POST /api/auth/register` with bcrypt password hashing.
- Implement `POST /api/auth/login` with JWT access + refresh tokens.
- Implement `POST /api/auth/refresh` for token renewal.
- Implement `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` (token returned directly, no email).
- Create `@jwt_required` decorator for protected routes.
- Implement `GET /api/users/me` and `PATCH /api/users/me`.

**Success criteria:**
- Register creates a user (password hashed).
- Login returns valid JWT tokens.
- Protected endpoints return 401 without token.
- Token refresh works.

---

## Phase 3 — Audiobook catalog + filters + details

**Status:** ⏳ Not started

**Goal:** Full audiobook catalog with search, filters, pagination, and detail pages.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Implement `GET /api/audiobooks` with all filters and pagination.
- Implement `GET /api/audiobooks/:id` with full details.
- Load real audiobook data from the dataset.
- Handle missing/incomplete metadata gracefully.
- Include `average_rating`, `review_count`, and `print_edition` in responses.

**Success criteria:**
- All filter parameters work individually and combined.
- Pagination returns correct subsets and `total` counts.
- Details endpoint never crashes on missing optional fields.

---

## Phase 4 — Quick Listen + Similar titles

**Status:** ⏳ Not started

**Goal:** Implement Quick Listen summaries and similar title recommendations.

**Estimated effort:** 1–2 hours

**Instructions for agent:**
- Implement `GET /api/audiobooks/:id/quick-listen` with summary text from synopsis and estimated listen time.
- Implement `GET /api/audiobooks/:id/similar` with scoring based on language, category, duration, author.
- Both endpoints must return deterministic results.

**Success criteria:**
- Quick Listen returns stable, non-random summaries.
- Similar returns 5 items with reasons.

---

## Phase 5 — Player + listening progress

**Status:** ⏳ Not started

**Goal:** Audio playback support and progress saving.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Serve audio files from `data/audio/` as static files.
- Implement `POST /api/audiobooks/:id/progress` to save listening position.
- Implement `GET /api/users/me/listening-history` to retrieve progress.
- Every audiobook response includes `audio_url` or `is_playable: false`.

**Success criteria:**
- At least one audiobook can be played.
- Progress saves and restores across sessions for logged-in users.

---

## Phase 6 — Reviews and ratings

**Status:** ⏳ Not started

**Goal:** Users can rate and review audiobooks.

**Estimated effort:** 1–2 hours

**Instructions for agent:**
- Implement CRUD for reviews: `GET`, `POST`, `PUT`, `DELETE` on `/api/audiobooks/:id/reviews`.
- Enforce one review per user per audiobook.
- Compute and cache `average_rating` and `review_count` on audiobook.
- Support sorting reviews by date or rating.
- Include `rating_breakdown` in response.

**Success criteria:**
- Reviews create/update/delete correctly.
- Average rating recalculates after changes.
- Duplicate review returns 409.

---

## Phase 7 — Bookstore + cart + orders

**Status:** ⏳ Not started

**Goal:** Browse printed books, manage cart, checkout with simulated payment.

**Estimated effort:** 3–4 hours

**Instructions for agent:**
- Implement `GET /api/bookstore` with filters and pagination.
- Implement cart endpoints: `GET /api/cart`, `POST/PATCH/DELETE /api/cart/items`.
- Implement `POST /api/orders` (checkout — reduces stock, creates order).
- Implement `GET /api/orders` and `GET /api/orders/:id`.
- Seed print book data linked to audiobooks.
- Payment is simulated (always succeeds).

**Success criteria:**
- Can add/remove/update cart items.
- Checkout creates an order and reduces stock.
- Orders show correct totals and statuses.
- Out-of-stock items cannot be ordered.

---

## Phase 8 — Podcast hub

**Status:** ⏳ Not started

**Goal:** Browse podcast shows, play episodes, subscribe, and manage queue.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Implement `GET /api/podcasts` with search and category filter.
- Implement `GET /api/podcasts/:show_id` and `GET /api/podcasts/:show_id/episodes`.
- Implement subscribe/unsubscribe endpoints.
- Implement podcast queue CRUD.
- Seed podcast data (shows + episodes).

**Success criteria:**
- Shows are browsable and filterable.
- Episodes list correctly within shows.
- Subscribe/unsubscribe toggles work.
- Queue items can be added, reordered, and removed.

---

## Phase 9 — Community forum

**Status:** ⏳ Not started

**Goal:** Full forum with categories, threads, replies, and voting.

**Estimated effort:** 3–4 hours

**Instructions for agent:**
- Implement `GET /api/forum/categories`.
- Implement thread CRUD and listing by category.
- Implement reply CRUD.
- Implement voting (upvote/downvote with toggle).
- Implement forum search.
- Implement thread linking to audiobooks/podcasts.
- Seed forum categories.

**Success criteria:**
- Categories load with thread counts.
- Threads create/list/sort correctly within categories.
- Replies add to threads with correct counts.
- Voting increments/decrements and prevents duplicate votes.
- Search returns matching threads and replies.

---

## Phase 10 — Notifications

**Status:** ⏳ Not started

**Goal:** In-app notifications for forum replies, podcast episodes, and order updates.

**Estimated effort:** 1–2 hours

**Instructions for agent:**
- Create notifications when: reply posted to user's thread, order status changes, new episode in subscribed show.
- Implement `GET /api/notifications` with unread filter.
- Implement mark-as-read and mark-all-read.

**Success criteria:**
- Notifications are created by relevant actions.
- Unread count is accurate.
- Mark-all-read clears the count.

---

## Phase 11 — Home page endpoints

**Status:** ⏳ Not started

**Goal:** Serve data for the home page sections.

**Estimated effort:** 1 hour

**Instructions for agent:**
- `GET /api/home/featured` — top-rated audiobooks.
- `GET /api/home/latest-episodes` — recent podcast episodes.
- `GET /api/home/active-discussions` — threads with recent replies.
- `GET /api/home/continue-listening` — user's in-progress audiobooks (auth).
- `GET /api/home/recommendations` — based on user's listening history genres (auth).

**Success criteria:**
- Each endpoint returns a small, curated list.
- Auth-only endpoints return user-specific data.

---

## Phase 12 — Frontend: React app scaffold

**Status:** ⏳ Not started

**Goal:** Set up the React app with routing, auth context, and the app shell.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
Create `frontend/` folder using Vite:
```
frontend/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api/                    # API client modules
│   │   ├── client.js           # Base fetch with auth headers
│   │   ├── auth.js
│   │   ├── audiobooks.js
│   │   ├── reviews.js
│   │   ├── bookstore.js
│   │   ├── podcasts.js
│   │   ├── forum.js
│   │   └── notifications.js
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state + JWT storage
│   │   └── PlayerContext.jsx   # Global player state
│   ├── pages/                  # One file per screen
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   ├── AudiobookDetailPage.jsx
│   │   ├── QuickListenPage.jsx
│   │   ├── PlayerPage.jsx
│   │   ├── BookstorePage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderHistoryPage.jsx
│   │   ├── PodcastHubPage.jsx
│   │   ├── PodcastShowPage.jsx
│   │   ├── PodcastQueuePage.jsx
│   │   ├── ForumHomePage.jsx
│   │   ├── ForumCategoryPage.jsx
│   │   ├── ForumThreadPage.jsx
│   │   ├── CreateThreadPage.jsx
│   │   ├── ForumSearchPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignUpPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── ResetPasswordPage.jsx
│   │   ├── ProfilePage.jsx
│   │   └── NotificationsPage.jsx
│   ├── components/             # From 06-ui-components.md
│   │   ├── shell/
│   │   ├── auth/
│   │   ├── catalog/
│   │   ├── details/
│   │   ├── reviews/
│   │   ├── player/
│   │   ├── bookstore/
│   │   ├── podcasts/
│   │   ├── forum/
│   │   ├── notifications/
│   │   ├── profile/
│   │   └── feedback/
│   └── styles/
│       ├── variables.css       # CSS custom properties
│       └── App.css
├── package.json
└── README.md
```

- Set up React Router with all routes from `05-ui-screens-and-flow.md`.
- Implement `AuthContext` (JWT storage in localStorage, login/logout/register).
- Implement `PlayerContext` (current track, play/pause/speed/progress).
- Implement `AuthGuard` component for protected routes.
- Build `AppShell` with header, navigation, mini-player, footer.
- API calls go to `http://localhost:5000/api/`.

**Success criteria:**
- App runs with `npm run dev` on port 3000.
- All routes render placeholder pages.
- Login/register/logout flow works.
- Navigation and layout render correctly.

---

## Phase 13 — Frontend: Catalog + Details + Player

**Status:** ⏳ Not started

**Goal:** Full audiobook browsing, detail pages, and working player.

**Estimated effort:** 4–5 hours

**Instructions for agent:**
- Build `CatalogPage` with search, filters, grid, pagination.
- Build `AudiobookDetailPage` with metadata, play button, quick listen, similar, reviews display, buy panel.
- Build `PlayerPage` and `MiniPlayer` with full controls.
- Build `QuickListenPage`.
- Implement all catalog and detail components from `06-ui-components.md`.

**Success criteria:**
- Full browse → detail → play flow works.
- Filters update results correctly.
- Player persists across page navigation.
- Quick Listen and Similar sections display correctly.

---

## Phase 14 — Frontend: Auth screens + Reviews

**Status:** ⏳ Not started

**Goal:** Login, sign up, password reset screens, and review writing.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Build `LoginPage`, `SignUpPage`, `ForgotPasswordPage`, `ResetPasswordPage`.
- Build `ReviewForm`, `ReviewCard`, `ReviewList`, `StarRatingInput` components.
- Integrate reviews into `AudiobookDetailPage`.

**Success criteria:**
- Users can register, login, and reset password.
- Authenticated users can write, edit, and delete reviews.
- Rating and reviews display correctly on detail pages.

---

## Phase 15 — Frontend: Bookstore + Cart + Checkout

**Status:** ⏳ Not started

**Goal:** Full bookstore browsing and purchase flow.

**Estimated effort:** 3–4 hours

**Instructions for agent:**
- Build `BookstorePage` with filters and grid.
- Build `CartPage` with quantity controls and summary.
- Build `CheckoutPage` with shipping form, order review, and confirmation.
- Build `OrderHistoryPage` with order details.
- Build `BuyPrintPanel` on audiobook detail page.

**Success criteria:**
- Full browse → add to cart → checkout → confirmation flow works.
- Order appears in history.

---

## Phase 16 — Frontend: Podcast Hub

**Status:** ⏳ Not started

**Goal:** Podcast browsing, episode playback, and queue management.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Build `PodcastHubPage` with category filters and show grid.
- Build `PodcastShowPage` with episode list.
- Build `PodcastQueuePage` with reorder/remove controls.
- Integrate podcast playback with the shared player.

**Success criteria:**
- Podcasts are browsable and filterable.
- Episodes play through the shared player.
- Queue management works.

---

## Phase 17 — Frontend: Forum

**Status:** ⏳ Not started

**Goal:** Full forum with categories, threads, replies, and voting.

**Estimated effort:** 3–4 hours

**Instructions for agent:**
- Build `ForumHomePage` with category cards.
- Build `ForumCategoryPage` with thread list and sorting.
- Build `ForumThreadPage` with original post, replies, voting, and reply form.
- Build `CreateThreadPage` with category select, title, body, and content linking.
- Build `ForumSearchPage`.

**Success criteria:**
- Full browse → read → reply flow works.
- Voting updates immediately.
- Thread creation and search work.

---

## Phase 18 — Frontend: Profile + Notifications + Home

**Status:** ⏳ Not started

**Goal:** Profile page, notification system, and home page.

**Estimated effort:** 3–4 hours

**Instructions for agent:**
- Build `ProfilePage` with all sections (history, wishlist, orders, reviews, forum activity, subscriptions, settings).
- Build `NotificationsPage` and `NotificationBell` + dropdown.
- Build `HomePage` with all sections (hero, continue listening, trending, bookstore, podcasts, discussions, picks).

**Success criteria:**
- Profile shows accurate user data.
- Notifications display and mark-as-read works.
- Home page loads all sections with proper fallbacks.

---

## Phase 19 — UI polish + accessibility pass

**Status:** ⏳ Not started

**Goal:** Improve visual quality, handle edge cases, and ensure accessibility.

**Estimated effort:** 2–3 hours

**Instructions for agent:**
- Handle all missing data states gracefully.
- Implement loading skeletons, empty states, and error states everywhere.
- Verify keyboard navigation across all pages.
- Add ARIA labels to all icon-only buttons.
- Verify responsive layout at all breakpoints.
- Test the mini-player across different pages.
- Ensure toasts/confirmations appear where appropriate.

**Success criteria:**
- No broken layouts on missing data.
- All interactive elements are keyboard accessible.
- Loading/empty/error states are clear and actionable.

---

## Phase 20 — Testing and stabilization

**Status:** ⏳ Not started

**Goal:** Add tests, fix bugs, and ensure reliable local setup.

**Estimated effort:** 3–4 hours

**Instructions for agent:**

**Backend tests (pytest):**
- Auth: register, login, token refresh, protected routes
- Audiobooks: list, filter, detail, quick listen, similar
- Reviews: create, edit, delete, average calculation
- Bookstore: cart CRUD, checkout, order history
- Podcasts: list, detail, subscribe, queue
- Forum: categories, threads, replies, voting, search
- Notifications: creation, listing, mark-as-read
- Error responses: 400, 401, 403, 404, 409

**Frontend tests (optional):**
- Key user flows with React Testing Library

**Root README update:**
```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev
```

**Success criteria:**
- All backend tests pass.
- Project runs locally end-to-end from a fresh clone.
- README has clear, working commands.

---

## Completion checklist

When all phases are ✅:

- [ ] Docs are complete and up to date
- [ ] Backend starts and all endpoints work
- [ ] User can register, login, reset password
- [ ] Catalog browse → details → play flow works
- [ ] Quick Listen and Similar titles work
- [ ] Reviews can be written and displayed
- [ ] Bookstore browse → cart → checkout → order history works
- [ ] Podcast shows browsable, episodes playable, queue works
- [ ] Forum categories → threads → replies → voting works
- [ ] Home page loads featured content
- [ ] Profile shows user data, history, and settings
- [ ] Notifications appear and mark-as-read works
- [ ] UI is accessible (keyboard, screen reader, states)
- [ ] Tests pass
- [ ] README has clear setup instructions

## Estimated total time: ~35–50 hours across all phases

---

## Notes for AI agents

- Work one phase at a time.
- Reference the relevant docs for each phase.
- Keep changes small and focused.
- Use Flask + SQLAlchemy for the backend API and React (Vite) for the frontend — do not switch frameworks.
- Run the app after each phase to verify it works before moving on.
- When in doubt, refer to `docs/api/api-requirements.md` for exact endpoint shapes.
