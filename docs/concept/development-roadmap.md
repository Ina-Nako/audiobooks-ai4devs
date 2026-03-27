# Development Roadmap — AudioBooks

## Purpose

This document outlines the incremental steps to build the MVP.

Each phase is small, has clear success criteria, and builds on the previous one.

Use this as a checklist for manual development or when prompting AI coding agents.

**Tech stack:** Python Flask (backend API) · React (frontend)

**Environment:** Windows. All commands must work in a standard Windows terminal (PowerShell or CMD).

---

## Phase 0 — Repo setup

**Status:** ⚠️ Partial

**Goal:** Make the repo agent-ready with complete documentation and consistent filenames.

**Deliverables:**
- [ ] `AGENTS.md` at root (what to build, how to run, rules for agents).
- [x] `docs/concept/01-project-brief.md`
- [x] `docs/concept/02-product-scope.md`
- [ ] `docs/concept/03-dataset-overview.md` (create)
- [ ] `docs/concept/04-data-preprocessing.md` (create)
- [x] `docs/ui/04-ui-style-guide.md`
- [x] `docs/ui/05-ui-screens-and-flow.md`
- [x] `docs/ui/06-ui-components.md`
- [ ] `docs/api/07-api-requirements.md` (create — MVP-only version covering the 4 endpoints, not the full production spec in `api_prototyper/`)
- [ ] `docs/api/08-api-contract.yaml` (create — simplified OpenAPI for the 4 MVP endpoints only)
- [ ] `data/` folder with the audiobook dataset (create, e.g. `data/audiobooks.json` or `data/audiobooks.csv`)
- [ ] Simple `README.md` at root (replace placeholder with runnable instructions).

**Success criteria:**
- Root repo has clear guidance for humans and agents.
- Doc filenames in `AGENTS.md` match real paths.
- Dataset location and format are clearly documented.

---

## Phase 1 — Backend scaffold + data loading + preprocessing

**Status:** ⏳ Not started

**Goal:** Create the Flask app, load and preprocess the dataset, and expose 4 API endpoints with correct JSON shapes (stubs allowed for Quick Listen/similar).

**Estimated effort:** 2–3 hours.

**Docs to read:**
- `docs/concept/02-product-scope.md`
- `docs/ui/05-ui-screens-and-flow.md`
- `docs/api/07-api-requirements.md` (MVP endpoints)
- `docs/api/08-api-contract.yaml` (MVP contract)

**Instructions for agent:**
- Create `backend/` folder with this structure:
  ```
  backend/
  ├── app.py              # Flask app entry point
  ├── preprocessing.py    # Data loading and cleaning
  ├── requirements.txt    # Python dependencies
  └── README.md           # Local setup instructions
  ```
- In `preprocessing.py`:
  - Load the dataset from `data/`.
  - Generate a stable `audiobook_id` if the dataset does not have one.
  - Normalize key fields used by UI and filtering:
    - title, author, narrator (optional), duration (seconds), language, topic/genre (optional)
    - audio availability/source fields (file path or URL, or an `is_playable` boolean)
  - Handle nulls with simple rules (document in `04-data-preprocessing.md`).
  - Output a cleaned dataset format the app can use (e.g., JSON).
  - Log a small data-quality summary (row count, missing counts for key fields).
- In `app.py`:
  - Create a Flask app with CORS enabled.
  - Load preprocessed data at startup.
  - Implement 4 endpoints (all under `/api/`):
    - `GET /api/audiobooks` — return audiobook summaries with pagination (`limit`, `offset`) and basic filtering.
    - `GET /api/audiobooks/<audiobook_id>` — return audiobook details.
    - `GET /api/audiobooks/<audiobook_id>/quick-listen` — return stub JSON (for now).
    - `GET /api/audiobooks/<audiobook_id>/similar` — return stub JSON (for now).
  - Implement a consistent `ErrorResponse` JSON format for 400, 404, 500 errors.
- In `requirements.txt` include: `flask`, `flask-cors`, `pandas`.

**Success criteria:**
- `cd backend && pip install -r requirements.txt && python app.py` starts the server on port 5000.
- All 4 endpoints return valid JSON and stable shapes.
- `GET /api/audiobooks` returns real items from the dataset.
- Error responses follow one consistent schema.

---

## Phase 2 — Full backend data integration (filters + real details)

**Status:** ⏳ Not started

**Goal:** Implement full filtering and ensure details output is complete and stable. Keep Quick Listen and Similar endpoints as stubs.

**Estimated effort:** 1–2 hours.

**Instructions for agent:**
- Implement real filtering for `GET /api/audiobooks`:
  - `q` (search in title/author/topic)
  - `language`
  - `durationMinSeconds`, `durationMaxSeconds`
  - `author` (or `narrator`)
  - one extra field that exists in the dataset (e.g., `narratorType` or `format`)
- Implement pagination with `limit` (default 20) and `offset` (default 0).
- Return `total` count alongside filtered `items`.
- Implement real details for `GET /api/audiobooks/<audiobook_id>`:
  - Return all fields required by the Details screen (title, author, narrator, duration, language, topic/genre, synopsis/description, audio availability/source).

**Success criteria:**
- Each filter parameter correctly narrows results.
- Pagination returns correct subsets and accurate `total` count.
- Details endpoint never crashes on missing optional fields.

---

## Phase 3 — Player basics (local playback)

**Status:** ⏳ Not started

**Goal:** Make basic playback work locally (play/pause + speed control) for audiobooks that have playable audio.

**Estimated effort:** 2–3 hours.

**Instructions for agent:**
- Decide how audio is stored for the MVP:
  - **Recommended:** local files under `data/audio/` served by Flask as static files.
- Update preprocessing + details output so every audiobook includes one of:
  - a `audio_url` (preferred), or
  - an `audio_path` that can be translated into a URL.
- Add a simple player implementation:
  - Use an HTML5 `<audio>` element.
  - Implement a speed control using `audio.playbackRate`.
  - Do not autoplay on page load.
- Handle “Audio not available”:
  - show a clear message and disable the Play action.

**Success criteria:**
- At least one audiobook can be played locally.
- Speed control changes playback speed.
- The player is keyboard accessible.

---

## Phase 4 — Quick Listen (real output)

**Status:** ⏳ Not started

**Goal:** Make Quick Listen real and repeatable (no hand-written per-book content).

**Estimated effort:** 1–2 hours.

**Instructions for agent:**
- Decide Quick Listen format for MVP:
  - **Recommended:** written summary + audio summary (if available) + estimated listen time.
- Implement `GET /api/audiobooks/<audiobook_id>/quick-listen`:
  - Return `summary_text` (from dataset field if available, otherwise a simple fallback like the first N sentences of the synopsis).
  - Return `summary_audio_url` (if an audio summary exists in the dataset or can be served).
  - Return `estimated_listen_time_seconds` using a simple rule (example: word_count / 150 wpm).
  - Return `notes` when fallbacks are used.

**Success criteria:**
- Endpoint returns stable results for the same audiobook.
- Estimated time is consistent and non-zero when summary exists.
- No per-book manual outputs.

---

## Phase 5 — Similar titles (real output)

**Status:** ⏳ Not started

**Goal:** Return 5 similar titles with a short reason for each.

**Estimated effort:** 1–2 hours.

**Instructions for agent:**
- Implement `GET /api/audiobooks/<audiobook_id>/similar`:
  - Score all other audiobooks using simple rules:
    - same language
    - same topic/genre (if available)
    - similar duration (absolute difference)
    - same author/narrator (when available)
  - Return top `limit` results (default 5).
  - Add `reason` string per item (e.g., “Same language + similar duration”).
- Edge cases:
  - If fewer than 5 strong matches exist, return the best available matches (still deterministic, not random).

**Success criteria:**
- Endpoint returns 5 items with reasons.
- Results are deterministic (not random).

---

## Phase 6 — Frontend: React app

**Status:** ⏳ Not started

**Goal:** Build the MVP screens as a React single-page app that consumes the Flask API.

**Estimated effort:** 3–4 hours.

**Docs to read:**
- `docs/ui/04-ui-style-guide.md`
- `docs/ui/05-ui-screens-and-flow.md`
- `docs/ui/06-ui-components.md`

**Instructions for agent:**
- Create a `frontend/` folder at the repo root using Create React App or Vite:
  ```
  frontend/
  ├── public/
  ├── src/
  │   ├── App.jsx
  │   ├── index.jsx
  │   ├── api/
  │   │   └── audiobooks.js        # API client (fetch calls to Flask backend)
  │   ├── pages/
  │   │   ├── CatalogPage.jsx       # Screen 1: search + filters + audiobook cards
  │   │   ├── AudiobookDetailPage.jsx  # Screen 2: metadata + quick listen + similar
  │   │   ├── PlayerPage.jsx        # Screen 3: player controls
  │   │   └── QuickListenPage.jsx   # Screen 4: summary + estimated time
  │   ├── components/
  │   │   ├── SearchInput.jsx
  │   │   ├── FilterPanel.jsx
  │   │   ├── AudiobookCard.jsx
  │   │   ├── SimilarCard.jsx
  │   │   ├── PlayerControls.jsx
  │   │   ├── ProgressBar.jsx
  │   │   └── InlineAlert.jsx
  │   └── styles/
  │       └── App.css
  ├── package.json
  └── README.md
  ```
- Use React Router for client-side navigation:
  - `/` → redirect to `/catalog`
  - `/catalog` → `CatalogPage`
  - `/audiobooks/:audiobookId` → `AudiobookDetailPage`
  - `/player/:audiobookId` → `PlayerPage`
  - `/audiobooks/:audiobookId/quick-listen` → `QuickListenPage`
- API calls go to `http://localhost:5000/api/` (Flask backend with CORS).
- Implement accessibility basics from the style guide:
  - keyboard reachable controls
  - visible focus
  - accessible names for icon-only buttons
- For styling, prefer CSS variables for semantic tokens (no need to hard-code hex colors in MVP).

**Success criteria:**
- Full user flow works: open app → browse → filter → open details → play → change speed → open quick listen → see similar.
- Pages are readable and usable with keyboard.

---

## Phase 7 — UI polish + accessibility pass

**Status:** ⏳ Not started

**Goal:** Improve visual quality and handle edge cases without adding new features.

**Estimated effort:** 1–2 hours.

**Instructions for agent:**
- Handle missing data:
  - show “Unknown” or hide optional metadata fields
  - show “Audio not available” when not playable
  - show “No summary available” when Quick Listen cannot be generated
- Improve empty/error states:
  - “No results” + clear filters action
  - retry action for dataset/API errors
- Verify responsive layout for narrow screens.

**Success criteria:**
- No broken layouts on missing data.
- Core flow is comfortable at desktop width and usable on small screens.

---

## Phase 8 — Testing and stabilization

**Status:** ⏳ Not started

**Goal:** Add basic tests, fix issues, and ensure setup is simple.

**Estimated effort:** 1–2 hours.

**Instructions for agent:**
- Backend tests (using `pytest`):
  - `GET /api/audiobooks` returns items
  - filters narrow results
  - unknown `audiobook_id` returns 404
  - Quick Listen endpoint returns stable output
  - Similar titles endpoint returns 5 deterministic items (when dataset size allows)
- Update root `README.md` with Windows-compatible commands:
  ```bash
  # Backend
  cd backend
  pip install -r requirements.txt
  python app.py

  # Frontend (in a separate terminal)
  cd frontend
  npm install
  npm start
  ```
  - How to open the app: `http://localhost:3000`.
  - How to run backend tests: `cd backend && pytest`.

**Success criteria:**
- Project runs locally end-to-end from a fresh clone.
- Tests pass.
- README has clear, working Windows commands.

---

## Completion checklist

When all phases are ✅:

- [ ] Full user flow works locally.
- [ ] Filters work.
- [ ] Playback works when audio is available.
- [ ] Speed control works.
- [ ] Quick Listen shows summary + estimated time.
- [ ] Similar titles show 5 items with reasons.
- [ ] UI matches the UI docs.
- [ ] Repo has clear setup instructions.
- [ ] Code is readable for students.
- [ ] Error responses are consistent.

## Notes for AI agents

- Work one phase at a time.
- Reference the relevant docs for each phase.
- Keep changes small and focused.
- Use Flask for the backend API and React for the frontend — do not switch frameworks.

Total estimated time: ~11–16 hours across phases (depends on dataset quality and audio handling).
