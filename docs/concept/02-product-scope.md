# Product Scope — AudioBooks

## Purpose of this document

This document defines what the MVP includes, excludes, and must achieve.

## Scope objective

Build a small web app that runs locally and lets users browse audiobooks, open a book, and listen.

Prioritize a clear end-to-end flow (browse → details → listen) over advanced features.

## In scope

The following items are included in the first version of the project.

### 1. Data loading and preprocessing
- Load the audiobook dataset from the repository.
- Check required fields exist (at minimum: title, author, duration, language, and some way to know if audio is playable).
- Fill/handle missing values using simple, documented rules.
- Create a stable internal ID if the dataset does not have one.
- Output cleaned data for the app (and for any recommendation logic).

### 2. Catalog browser
- Show a list of audiobooks.
- Show key summary info (title, author, duration, language, and category/topic if available).
- Let the user open an audiobook details page.

### 3. Filters

The application must support filtering audiobooks by at least:
- Duration range.
- Language.
- Category/genre/topic (or the closest available field).
- Author (or narrator if author is missing).
- One more simple field (for example: narrator type, release year, or format).

### 4. Audiobook details page

Each audiobook must have a details view that shows (when available):
- Title.
- Author.
- Narrator (and narrator type: human/AI, if available).
- Duration.
- Language.
- Category/genre/topic.
- Description/synopsis.
- Audio availability/source info.

### 5. Player and accessibility controls

The application must include a player experience that supports:
- Start, pause, and resume.
- Playback speed control.
- Basic accessibility (keyboard navigation and screen-reader-friendly labels).

The MVP does not need every accessibility option, but it should not block them later.

### 6. Quick Listen (short summary)

The details page must include a “Quick Listen” option that provides:
- A short written and audio summary
- An estimated listen time.

Quick Listen can be implemented with a simple, repeatable approach 

### 7. Similar titles (comparable audiobooks)

The details page must display 5 similar audiobooks.

Similar titles should be selected using simple similarity rules based on:
- Shared category/genre/topic.
- Similar duration.
- Same language.
- Same author and/or narrator (when available).
- Other relevant structured features when available.

Each similar title should include a short reason explaining why it is similar.

### 8. Local execution

The full project must run locally for demonstration and learning purposes.

The repository must include enough setup instructions so another student or reviewer can run the project without guesswork.

## Out of scope

The following items are not required in the first version.

- User authentication.
- User accounts/profiles/subscription billing.
- Bookmarks and voice notes.
- Pitch and voice customization.
- Admin moderation and creator tools.
- Home screen with recommendations and "continue listening".
- High-contrast mode and dyslexia-friendly font (accessibility beyond keyboard + screen reader basics).
- Social features.
- External paid APIs.
- Production deployment.
- Full-text semantic search.
- Media pipelines beyond what is needed to play audio.
- In-app retraining or complex dashboards.
- Mobile app development.
- Forum to disccus different books
- Buying a book in printed form

These items can be added later only after the core product flow is complete and stable.

## MVP requirements

A version can be considered a valid MVP only if all of the following are true:

1. A user can open the application locally.
2. A user can browse the audiobook catalog.
3. A user can apply filters.
4. A user can open an audiobook details page.
5. A user can start playback.
6. A user can change playback speed.
7. A user can open Quick Listen and see the estimated time.
8. A user can see 5 similar titles with a short reason for each.

If any of these core steps is missing, the project should not be treated as complete.

## Functional expectations

The first version should satisfy the following functional expectations:

- The catalog page should load usable audiobook data.
- Filters should update the visible results correctly.
- The details page should show the main audiobook information clearly.
- Playback should work when audio is available (otherwise show a clear “not available” state).
- Quick Listen should come from project data or a repeatable process.
- Similar titles should come from the dataset and not be random.
- The website should be understandable without reading the source code.

## Non-functional expectations

The first version should also follow these quality expectations:

- Clear project structure.
- Readable code.
- Predictable local setup.
- Reasonable error handling for missing/incomplete metadata.
- Consistent naming across backend, frontend, and documentation.
- Documentation that supports step-by-step learning and AI-assisted development.

## Data assumptions

The project assumes the dataset may contain:
- Missing values (for example: narrator, genre, description).
- Inconsistent records (for example: genre/language names).
- Outliers (very short/very long durations).
- Missing unique identifiers.
- Optional media fields (some items may not have playable audio).

The implementation must handle these cases with simple and explicit rules rather than hidden assumptions.

## Feature prioritization

Features should be implemented in this priority order:

1. Data loading and preprocessing.
2. Catalog browser.
3. Filters.
4. Audiobook details page.
5. Player basics.
6. Accessibility basics.
7. Quick Listen.
8. Similar titles.
9. UI polish (optional).

This order is important because later features depend on the earlier ones.

## Change rules

If a feature does not improve the core flow, postpone it.

Prefer a small complete MVP over a large incomplete build.

## Definition of done

The first version is done when:
- The application runs locally.
- The main browse-to-details-to-listen flow works.
- Quick Listen is available and consistent.
- 5 similar titles are shown with simple justification.
- The repository includes clear setup and usage instructions.
- The codebase is organized enough for a student or AI coding agent to continue development safely.
