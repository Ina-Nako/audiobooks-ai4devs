"""
User profile routes: GET /api/users/me, PATCH /api/users/me
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import (
    ForumReply,
    ForumThread,
    ListeningProgress,
    Order,
    Review,
    User,
)

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


def _user_profile(user):
    """Build the full user profile response with stats."""
    # Compute stats
    books_listened = ListeningProgress.query.filter_by(user_id=user.id).count()
    reviews_written = Review.query.filter_by(user_id=user.id).count()
    threads = ForumThread.query.filter_by(user_id=user.id).count()
    replies = ForumReply.query.filter_by(user_id=user.id).count()
    forum_posts = threads + replies
    orders_placed = Order.query.filter_by(user_id=user.id).count()

    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at.isoformat(),
        "stats": {
            "books_listened": books_listened,
            "reviews_written": reviews_written,
            "forum_posts": forum_posts,
            "orders_placed": orders_placed,
        },
    }


# --------------------------------------------------------------------------
# GET /api/users/me
# --------------------------------------------------------------------------
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(_user_profile(user)), 200


# --------------------------------------------------------------------------
# PATCH /api/users/me
# --------------------------------------------------------------------------
@users_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_me():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # Update allowed fields
    if "display_name" in data:
        display_name = data["display_name"].strip()
        if len(display_name) < 2 or len(display_name) > 50:
            return jsonify({"error": "Display name must be 2–50 characters"}), 400
        user.display_name = display_name

    if "avatar_url" in data:
        avatar_url = data["avatar_url"]
        if avatar_url and len(avatar_url) > 500:
            return jsonify({"error": "Avatar URL too long"}), 400
        user.avatar_url = avatar_url

    db.session.commit()

    return jsonify(_user_profile(user)), 200
