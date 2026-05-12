"""
Home page routes: featured, latest episodes, active discussions, continue listening, recommendations.
"""

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required, verify_jwt_in_request

from extensions import db
from models import (
    Audiobook,
    ForumThread,
    ListeningProgress,
    PodcastEpisode,
)

home_bp = Blueprint("home", __name__, url_prefix="/api/home")


@home_bp.route("/featured", methods=["GET"])
def featured():
    """Top-rated audiobooks."""
    books = Audiobook.query.order_by(Audiobook.average_rating.desc()).limit(6).all()
    return jsonify({
        "featured": [
            {
                "id": ab.id,
                "title": ab.title,
                "author": ab.author,
                "cover_image_url": ab.cover_image_url,
                "average_rating": ab.average_rating,
                "category": ab.category,
            }
            for ab in books
        ]
    }), 200


@home_bp.route("/latest-episodes", methods=["GET"])
def latest_episodes():
    """Recent podcast episodes."""
    episodes = PodcastEpisode.query.order_by(
        PodcastEpisode.publish_date.desc()
    ).limit(6).all()
    return jsonify({
        "episodes": [
            {
                "id": ep.id,
                "title": ep.title,
                "show_title": ep.show.title if ep.show else None,
                "show_id": ep.show_id,
                "duration_seconds": ep.duration_seconds,
                "publish_date": ep.publish_date.isoformat() if ep.publish_date else None,
            }
            for ep in episodes
        ]
    }), 200


@home_bp.route("/active-discussions", methods=["GET"])
def active_discussions():
    """Forum threads with recent activity."""
    threads = ForumThread.query.order_by(ForumThread.updated_at.desc()).limit(5).all()
    return jsonify({
        "discussions": [
            {
                "id": t.id,
                "title": t.title,
                "author_name": t.author.display_name if t.author else "Unknown",
                "reply_count": t.reply_count,
                "score": t.upvotes - t.downvotes,
                "category_id": t.category_id,
                "created_at": t.created_at.isoformat(),
            }
            for t in threads
        ]
    }), 200


@home_bp.route("/continue-listening", methods=["GET"])
@jwt_required()
def continue_listening():
    """User's in-progress audiobooks."""
    user_id = get_jwt_identity()
    progress_list = ListeningProgress.query.filter_by(
        user_id=user_id, completed=False
    ).order_by(ListeningProgress.updated_at.desc()).limit(6).all()

    items = []
    for p in progress_list:
        ab = db.session.get(Audiobook, p.audiobook_id)
        if ab:
            items.append({
                "id": ab.id,
                "title": ab.title,
                "author": ab.author,
                "cover_image_url": ab.cover_image_url,
                "position_seconds": p.position_seconds,
                "duration_seconds": ab.duration_seconds,
                "progress_percent": round((p.position_seconds / ab.duration_seconds) * 100, 1) if ab.duration_seconds else 0,
            })

    return jsonify({"continue_listening": items}), 200


@home_bp.route("/recommendations", methods=["GET"])
@jwt_required()
def recommendations():
    """Recommendations based on listening history genres."""
    user_id = get_jwt_identity()

    # Get user's listened categories
    progress_list = ListeningProgress.query.filter_by(user_id=user_id).all()
    listened_ids = [p.audiobook_id for p in progress_list]
    categories = set()

    for aid in listened_ids:
        ab = db.session.get(Audiobook, aid)
        if ab and ab.category:
            categories.add(ab.category)

    if not categories:
        # Fallback: top rated
        books = Audiobook.query.filter(
            Audiobook.id.notin_(listened_ids)
        ).order_by(Audiobook.average_rating.desc()).limit(6).all()
    else:
        books = Audiobook.query.filter(
            Audiobook.category.in_(categories),
            Audiobook.id.notin_(listened_ids),
        ).order_by(Audiobook.average_rating.desc()).limit(6).all()

    return jsonify({
        "recommendations": [
            {
                "id": ab.id,
                "title": ab.title,
                "author": ab.author,
                "cover_image_url": ab.cover_image_url,
                "average_rating": ab.average_rating,
                "category": ab.category,
            }
            for ab in books
        ]
    }), 200
