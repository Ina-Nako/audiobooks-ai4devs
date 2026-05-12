# AudioBooks — Listen, Read, Discuss

A full-featured audiobook platform where users can **listen to audiobooks**, **buy printed copies**, **explore podcasts**, and **engage with a community** of fellow readers and listeners.

## Overview

AudioBooks is a web application built with **Python Flask** (backend API) and **React** (frontend). It provides an accessible, audio-first experience with rich social and commerce features.

## Key Features

| Section | Description |
|---------|-------------|
| **Audiobook Catalog** | Browse, search, and filter audiobooks. Listen with a full-featured player (speed control, progress tracking). Quick Listen summaries for faster discovery. |
| **Bookstore** | Buy printed copies of audiobooks. Shopping cart, order history, and shipment tracking. |
| **Podcast Hub** | Discover and listen to book-related podcasts. Subscribe to shows, browse episodes, and manage a personal podcast queue. |
| **Community Forum** | Discuss audiobooks, printed books, and podcasts. Create threads, reply, upvote, and organize by categories (genres, recommendations, reviews). |
| **Reviews & Ratings** | Rate and review audiobooks and podcasts. See aggregate scores and featured reviews on detail pages. |
| **User Profiles** | Sign up / log in. Personal library, listening history, wishlist, purchase history, and forum activity. |
| **Notifications** | Alerts for new forum replies, podcast episodes, order updates, and community activity. |

## Project Structure

```
audiobooks-ai4devs/
├── README.md
├── AGENTS.md                          # Instructions for AI coding agents
├── docs/
│   ├── concept/
│   │   ├── 01-project-brief.md        # Vision and target users
│   │   ├── 02-product-scope.md        # What's in/out of scope
│   │   ├── 03-features-overview.md    # Detailed feature breakdown
│   │   └── development-roadmap.md     # Phase-by-phase build plan
│   ├── ui/
│   │   ├── 04-ui-style-guide.md       # Design tokens, layout, accessibility
│   │   ├── 05-ui-screens-and-flow.md  # All screens and user flows
│   │   ├── 06-ui-components.md        # Reusable React components
│   │   ├── 07-ui-auth.md              # Login, sign up, password reset screens
│   │   ├── 08-ui-forum.md             # Forum screens and interactions
│   │   ├── 09-ui-podcast.md           # Podcast hub screens
│   │   └── 10-ui-bookstore.md         # Bookstore and checkout screens
│   └── api/
│       ├── api-requirements.md        # Full API endpoint reference
│       └── api-contract.yaml          # OpenAPI specification
├── api_prototyper/                    # Early API prototyping artifacts
│   ├── api_requirements.md
│   ├── api_specification.json
│   └── api_specification.yaml
├── data/                              # Audiobook dataset and audio files
├── backend/                           # Flask API server
└── frontend/                          # React single-page application
```

## Tech Stack

- **Backend:** Python 3.11+, Flask, Flask-CORS, SQLAlchemy, Flask-JWT-Extended
- **Frontend:** React 18+, React Router, CSS Variables (semantic tokens)
- **Database:** SQLite (development) / PostgreSQL (production-ready)
- **Auth:** JWT-based authentication
- **Environment:** Linux / macOS / Windows compatible

## Getting Started

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

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api/`

## Documentation

Start with [docs/concept/01-project-brief.md](docs/concept/01-project-brief.md) for the project vision, then follow the numbered docs in order.

## License

This project is for educational and personal use.
