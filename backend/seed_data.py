"""
Seed data for the AudioBooks platform.
Populates the database with sample audiobooks, podcast shows/episodes,
forum categories, and print books.
"""

from datetime import date, datetime, timezone

from extensions import db
from models import (
    Audiobook,
    ForumCategory,
    PodcastEpisode,
    PodcastShow,
    PrintBook,
)


def utcnow():
    return datetime.now(timezone.utc)


def seed_audiobooks():
    """Insert sample audiobooks into the database."""
    audiobooks = [
        Audiobook(
            id="ab-001",
            title="The Great Gatsby",
            author="F. Scott Fitzgerald",
            narrator="Jake Gyllenhaal",
            narrator_type="human",
            duration_seconds=17280,
            language="en",
            category="Classic Literature",
            synopsis="A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.",
            audio_url="https://ia600500.us.archive.org/4/items/great_gatsby_1404_librivox/greatgatsby_01_fitzgerald_64kb.mp3",
            is_playable=True,
            average_rating=4.5,
            review_count=12,
            print_available=True,
            print_price=12.99,
        ),
        Audiobook(
            id="ab-002",
            title="1984",
            author="George Orwell",
            narrator="Stephen Fry",
            narrator_type="human",
            duration_seconds=41400,
            language="en",
            category="Dystopian Fiction",
            synopsis="A dystopian novel set in a totalitarian society ruled by Big Brother.",
            audio_url="https://ia800204.us.archive.org/29/items/art_of_war_librivox/art_of_war_01_sun_tzu_64kb.mp3",
            is_playable=True,
            average_rating=4.7,
            review_count=28,
            print_available=True,
            print_price=14.99,
        ),
        Audiobook(
            id="ab-003",
            title="Sapiens: A Brief History of Humankind",
            author="Yuval Noah Harari",
            narrator="Derek Perkins",
            narrator_type="human",
            duration_seconds=54000,
            language="en",
            category="Non-Fiction",
            synopsis="An exploration of how Homo sapiens came to dominate the world.",
            audio_url="https://ia801409.us.archive.org/16/items/prideandprejudice_1012_librivox/prideandprejudice_01_austen_64kb.mp3",
            is_playable=True,
            average_rating=4.6,
            review_count=45,
            print_available=True,
            print_price=18.99,
        ),
        Audiobook(
            id="ab-004",
            title="Don Quijote de la Mancha",
            author="Miguel de Cervantes",
            narrator="AI Narrator",
            narrator_type="ai",
            duration_seconds=136800,
            language="es",
            category="Classic Literature",
            synopsis="Las aventuras del ingenioso hidalgo Don Quijote de la Mancha.",
            audio_url="https://ia800502.us.archive.org/4/items/don_quixote_01_1001_librivox/don_quixote_001_cervantes_64kb.mp3",
            is_playable=True,
            average_rating=4.3,
            review_count=8,
            print_available=True,
            print_price=22.99,
        ),
        Audiobook(
            id="ab-005",
            title="Atomic Habits",
            author="James Clear",
            narrator="James Clear",
            narrator_type="human",
            duration_seconds=19440,
            language="en",
            category="Self-Help",
            synopsis="Tiny changes, remarkable results. A proven framework for improving every day.",
            audio_url="https://ia902300.us.archive.org/26/items/treasure_island_0711_librivox/treasure_island_01_stevenson_64kb.mp3",
            is_playable=True,
            average_rating=4.8,
            review_count=67,
            print_available=True,
            print_price=16.99,
        ),
        Audiobook(
            id="ab-006",
            title="The Hobbit",
            author="J.R.R. Tolkien",
            narrator="Andy Serkis",
            narrator_type="human",
            duration_seconds=39600,
            language="en",
            category="Fantasy",
            synopsis="Bilbo Baggins is swept into an epic quest to reclaim the lost Dwarf Kingdom of Erebor.",
            audio_url="https://ia800500.us.archive.org/4/items/adventures_of_sherlock_holmes_0711_librivox/adventureofsherlock_01_doyle_64kb.mp3",
            is_playable=True,
            average_rating=4.9,
            review_count=102,
            print_available=True,
            print_price=15.99,
        ),
        Audiobook(
            id="ab-007",
            title="Le Petit Prince",
            author="Antoine de Saint-Exupéry",
            narrator="Bernard Giraudeau",
            narrator_type="human",
            duration_seconds=7200,
            language="fr",
            category="Children's Literature",
            synopsis="Un pilote échoué dans le désert rencontre un petit prince venu d'une autre planète.",
            audio_url="https://ia800207.us.archive.org/5/items/metamorphosis_librivox/metamorphosis_01_kafka_64kb.mp3",
            is_playable=True,
            average_rating=4.6,
            review_count=15,
            print_available=True,
            print_price=9.99,
        ),
        Audiobook(
            id="ab-008",
            title="Thinking, Fast and Slow",
            author="Daniel Kahneman",
            narrator="Patrick Egan",
            narrator_type="human",
            duration_seconds=72000,
            language="en",
            category="Psychology",
            synopsis="An exploration of the two systems that drive the way we think.",
            audio_url="https://ia800500.us.archive.org/25/items/alice_in_wonderland_librivox/wonderland_ch_01_carroll_64kb.mp3",
            is_playable=True,
            average_rating=4.4,
            review_count=33,
            print_available=True,
            print_price=19.99,
        ),
        Audiobook(
            id="ab-009",
            title="Dune",
            author="Frank Herbert",
            narrator="Scott Brick",
            narrator_type="human",
            duration_seconds=79200,
            language="en",
            category="Science Fiction",
            synopsis="Set in the distant future, the saga of Paul Atreides on the desert planet Arrakis.",
            audio_url="https://ia800204.us.archive.org/29/items/art_of_war_librivox/art_of_war_02_sun_tzu_64kb.mp3",
            is_playable=True,
            average_rating=4.7,
            review_count=55,
            print_available=True,
            print_price=17.99,
        ),
        Audiobook(
            id="ab-010",
            title="The Art of War",
            author="Sun Tzu",
            narrator="Aidan Gillen",
            narrator_type="human",
            duration_seconds=5400,
            language="en",
            category="Philosophy",
            synopsis="Ancient Chinese military treatise on strategy and tactics.",
            audio_url="https://ia800204.us.archive.org/29/items/art_of_war_librivox/art_of_war_03_sun_tzu_64kb.mp3",
            is_playable=True,
            average_rating=4.2,
            review_count=19,
            print_available=False,
            print_price=None,
        ),
    ]

    for book in audiobooks:
        existing = db.session.get(Audiobook, book.id)
        if not existing:
            db.session.add(book)

    db.session.commit()
    print(f"  ✓ Seeded {len(audiobooks)} audiobooks")


def seed_print_books():
    """Create print book entries for audiobooks that have print editions."""
    audiobooks = Audiobook.query.filter_by(print_available=True).all()
    count = 0

    for ab in audiobooks:
        existing = PrintBook.query.filter_by(audiobook_id=ab.id).first()
        if not existing:
            book = PrintBook(
                audiobook_id=ab.id,
                price=ab.print_price or 14.99,
                stock_quantity=25,
                pages=300,
                publisher="AudioBooks Press",
            )
            db.session.add(book)
            count += 1

    db.session.commit()
    print(f"  ✓ Seeded {count} print books")


def seed_podcast_shows():
    """Insert sample podcast shows and episodes."""
    shows = [
        {
            "id": "pod-001",
            "title": "Between the Pages",
            "description": "Weekly deep dives into the world's greatest books with author interviews and analysis.",
            "host": "Sarah Mitchell",
            "category": "Author Interviews",
            "episodes": [
                {"title": "Talking Dystopia with Modern Authors", "duration_seconds": 2700, "publish_date": date(2025, 4, 1), "episode_number": 1},
                {"title": "The Art of World-Building in Fantasy", "duration_seconds": 3200, "publish_date": date(2025, 4, 8), "episode_number": 2},
                {"title": "Why Classics Still Matter", "duration_seconds": 2400, "publish_date": date(2025, 4, 15), "episode_number": 3},
            ],
        },
        {
            "id": "pod-002",
            "title": "The Book Club Hour",
            "description": "Join our virtual book club as we discuss one book per month, chapter by chapter.",
            "host": "David & Lisa Chen",
            "category": "Book Clubs",
            "episodes": [
                {"title": "April Pick: Sapiens — Chapters 1-5", "duration_seconds": 3600, "publish_date": date(2025, 4, 3), "episode_number": 1},
                {"title": "April Pick: Sapiens — Chapters 6-10", "duration_seconds": 3300, "publish_date": date(2025, 4, 10), "episode_number": 2},
            ],
        },
        {
            "id": "pod-003",
            "title": "Literary Lens",
            "description": "Academic literary analysis made accessible. We break down themes, symbolism, and narrative techniques.",
            "host": "Prof. James Ward",
            "category": "Literary Analysis",
            "episodes": [
                {"title": "Unreliable Narrators in Modern Fiction", "duration_seconds": 2100, "publish_date": date(2025, 3, 28), "episode_number": 1},
                {"title": "The Hero's Journey: Beyond Joseph Campbell", "duration_seconds": 2800, "publish_date": date(2025, 4, 4), "episode_number": 2},
                {"title": "Magical Realism: Where Reality and Fantasy Meet", "duration_seconds": 2500, "publish_date": date(2025, 4, 11), "episode_number": 3},
                {"title": "Postmodern Storytelling Techniques", "duration_seconds": 3000, "publish_date": date(2025, 4, 18), "episode_number": 4},
            ],
        },
        {
            "id": "pod-004",
            "title": "Narrator's Craft",
            "description": "Behind the scenes of audiobook narration — how voice actors bring stories to life.",
            "host": "Emma Rodriguez",
            "category": "Behind the Scenes",
            "episodes": [
                {"title": "From Script to Studio: A Day in Narration", "duration_seconds": 1800, "publish_date": date(2025, 4, 5), "episode_number": 1},
                {"title": "Character Voices: Creating Distinct Personalities", "duration_seconds": 2200, "publish_date": date(2025, 4, 12), "episode_number": 2},
            ],
        },
    ]

    count_shows = 0
    count_episodes = 0

    for show_data in shows:
        existing = db.session.get(PodcastShow, show_data["id"])
        if not existing:
            show = PodcastShow(
                id=show_data["id"],
                title=show_data["title"],
                description=show_data["description"],
                host=show_data["host"],
                category=show_data["category"],
            )
            db.session.add(show)
            count_shows += 1

            for ep_data in show_data["episodes"]:
                episode = PodcastEpisode(
                    show_id=show_data["id"],
                    title=ep_data["title"],
                    duration_seconds=ep_data["duration_seconds"],
                    audio_url=f"/api/audio/podcasts/{show_data['id']}/ep-{ep_data['episode_number']}.mp3",
                    publish_date=ep_data["publish_date"],
                    episode_number=ep_data["episode_number"],
                    season_number=1,
                )
                db.session.add(episode)
                count_episodes += 1

    db.session.commit()
    print(f"  ✓ Seeded {count_shows} podcast shows with {count_episodes} episodes")


def seed_forum_categories():
    """Insert the 5 seed forum categories defined in the UI docs."""
    categories = [
        {"name": "Audiobook Discussions", "slug": "audiobook-discussions", "description": "Talk about audiobooks you're listening to or have finished.", "sort_order": 1},
        {"name": "Book Recommendations", "slug": "book-recommendations", "description": "Ask for and share book recommendations with the community.", "sort_order": 2},
        {"name": "Podcast Talk", "slug": "podcast-talk", "description": "Discuss podcast episodes, suggest new shows, and share favorites.", "sort_order": 3},
        {"name": "Reviews & Opinions", "slug": "reviews-opinions", "description": "Share your reviews and hot takes on books and audiobooks.", "sort_order": 4},
        {"name": "General", "slug": "general", "description": "Off-topic chat, introductions, and community announcements.", "sort_order": 5},
    ]

    count = 0
    for cat_data in categories:
        existing = ForumCategory.query.filter_by(slug=cat_data["slug"]).first()
        if not existing:
            cat = ForumCategory(**cat_data)
            db.session.add(cat)
            count += 1

    db.session.commit()
    print(f"  ✓ Seeded {count} forum categories")


def seed_all():
    """Run all seed functions."""
    print("Seeding database...")
    seed_audiobooks()
    seed_print_books()
    seed_podcast_shows()
    seed_forum_categories()
    print("Done! Database seeded successfully.")


if __name__ == "__main__":
    from app import create_app

    app = create_app()
    with app.app_context():
        seed_all()
