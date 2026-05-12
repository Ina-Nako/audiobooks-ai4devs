"""
Wishlist routes: add, remove, list wishlisted audiobooks.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Wishlist, Audiobook

wishlist_bp = Blueprint("wishlist", __name__, url_prefix="/api/wishlist")


@wishlist_bp.route("", methods=["GET"])
@jwt_required()
def get_wishlist():
    """GET /api/wishlist — list user's wishlisted audiobooks."""
    user_id = get_jwt_identity()
    items = Wishlist.query.filter_by(user_id=user_id).order_by(Wishlist.added_at.desc()).all()

    result = []
    for item in items:
        ab = db.session.get(Audiobook, item.audiobook_id)
        result.append({
            "id": item.id,
            "audiobook_id": item.audiobook_id,
            "title": ab.title if ab else "Unknown",
            "author": ab.author if ab else "Unknown",
            "cover_image_url": ab.cover_image_url if ab else None,
            "added_at": item.added_at.isoformat(),
        })

    return jsonify({"items": result}), 200


@wishlist_bp.route("", methods=["POST"])
@jwt_required()
def add_to_wishlist():
    """POST /api/wishlist — add audiobook to wishlist."""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    audiobook_id = data.get("audiobook_id")

    if not audiobook_id:
        return jsonify({"error": "audiobook_id is required"}), 400

    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    existing = Wishlist.query.filter_by(user_id=user_id, audiobook_id=audiobook_id).first()
    if existing:
        return jsonify({"error": "Already in wishlist"}), 409

    item = Wishlist(user_id=user_id, audiobook_id=audiobook_id)
    db.session.add(item)
    db.session.commit()

    return jsonify({"id": item.id, "audiobook_id": item.audiobook_id, "added_at": item.added_at.isoformat()}), 201


@wishlist_bp.route("/<string:audiobook_id>", methods=["DELETE"])
@jwt_required()
def remove_from_wishlist(audiobook_id):
    """DELETE /api/wishlist/:audiobook_id — remove from wishlist."""
    user_id = get_jwt_identity()
    item = Wishlist.query.filter_by(user_id=user_id, audiobook_id=audiobook_id).first()

    if not item:
        return jsonify({"error": "Not in wishlist"}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Removed from wishlist"}), 200
