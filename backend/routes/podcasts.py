"""
Podcast routes: shows, episodes, subscriptions, queue.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import PodcastEpisode, PodcastQueue, PodcastShow, PodcastSubscription

podcasts_bp = Blueprint("podcasts", __name__, url_prefix="/api/podcasts")


def _show_dict(show, user_id=None):
    d = {
        "id": show.id,
        "title": show.title,
        "description": show.description,
        "host": show.host,
        "cover_image_url": show.cover_image_url,
        "category": show.category,
        "website_url": show.website_url,
        "episode_count": show.episodes.count(),
        "created_at": show.created_at.isoformat(),
    }
    if user_id:
        sub = PodcastSubscription.query.filter_by(user_id=user_id, show_id=show.id).first()
        d["is_subscribed"] = sub is not None
    return d


def _episode_dict(ep):
    return {
        "id": ep.id,
        "show_id": ep.show_id,
        "title": ep.title,
        "description": ep.description,
        "duration_seconds": ep.duration_seconds,
        "audio_url": ep.audio_url,
        "publish_date": ep.publish_date.isoformat() if ep.publish_date else None,
        "episode_number": ep.episode_number,
        "season_number": ep.season_number,
    }


@podcasts_bp.route("", methods=["GET"])
def list_shows():
    search = request.args.get("search", "").strip()
    category = request.args.get("category")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    query = PodcastShow.query
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(PodcastShow.title.ilike(like), PodcastShow.host.ilike(like))
        )
    if category:
        query = query.filter(PodcastShow.category.ilike(f"%{category}%"))

    total = query.count()
    shows = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "shows": [_show_dict(s) for s in shows],
        "total": total,
        "page": page,
    }), 200


@podcasts_bp.route("/<string:show_id>", methods=["GET"])
def get_show(show_id):
    show = db.session.get(PodcastShow, show_id)
    if not show:
        return jsonify({"error": "Show not found"}), 404
    return jsonify(_show_dict(show)), 200


@podcasts_bp.route("/<string:show_id>/episodes", methods=["GET"])
def list_episodes(show_id):
    show = db.session.get(PodcastShow, show_id)
    if not show:
        return jsonify({"error": "Show not found"}), 404

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    query = PodcastEpisode.query.filter_by(show_id=show_id).order_by(
        PodcastEpisode.publish_date.desc()
    )
    total = query.count()
    episodes = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "episodes": [_episode_dict(ep) for ep in episodes],
        "total": total,
        "page": page,
    }), 200


@podcasts_bp.route("/<string:show_id>/subscribe", methods=["POST"])
@jwt_required()
def subscribe(show_id):
    show = db.session.get(PodcastShow, show_id)
    if not show:
        return jsonify({"error": "Show not found"}), 404

    user_id = get_jwt_identity()
    existing = PodcastSubscription.query.filter_by(user_id=user_id, show_id=show_id).first()
    if existing:
        return jsonify({"message": "Already subscribed"}), 200

    sub = PodcastSubscription(user_id=user_id, show_id=show_id)
    db.session.add(sub)
    db.session.commit()
    return jsonify({"message": "Subscribed"}), 201


@podcasts_bp.route("/<string:show_id>/unsubscribe", methods=["POST"])
@jwt_required()
def unsubscribe(show_id):
    user_id = get_jwt_identity()
    sub = PodcastSubscription.query.filter_by(user_id=user_id, show_id=show_id).first()
    if sub:
        db.session.delete(sub)
        db.session.commit()
    return jsonify({"message": "Unsubscribed"}), 200


@podcasts_bp.route("/queue", methods=["GET"])
@jwt_required()
def get_queue():
    user_id = get_jwt_identity()
    items = PodcastQueue.query.filter_by(user_id=user_id).order_by(PodcastQueue.position).all()
    return jsonify({
        "queue": [
            {
                "id": item.id,
                "episode": _episode_dict(item.episode) if item.episode else None,
                "position": item.position,
            }
            for item in items
        ]
    }), 200


@podcasts_bp.route("/queue", methods=["POST"])
@jwt_required()
def add_to_queue():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or "episode_id" not in data:
        return jsonify({"error": "episode_id is required"}), 400

    episode = db.session.get(PodcastEpisode, data["episode_id"])
    if not episode:
        return jsonify({"error": "Episode not found"}), 404

    # Get next position
    last = PodcastQueue.query.filter_by(user_id=user_id).order_by(
        PodcastQueue.position.desc()
    ).first()
    position = (last.position + 1) if last else 1

    item = PodcastQueue(
        user_id=user_id, episode_id=data["episode_id"], position=position
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Added to queue", "position": position}), 201


@podcasts_bp.route("/queue/<string:item_id>", methods=["DELETE"])
@jwt_required()
def remove_from_queue(item_id):
    user_id = get_jwt_identity()
    item = db.session.get(PodcastQueue, item_id)
    if not item or item.user_id != user_id:
        return jsonify({"error": "Queue item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Removed from queue"}), 200
