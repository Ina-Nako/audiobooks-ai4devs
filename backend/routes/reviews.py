"""
Review routes: CRUD for audiobook reviews.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Audiobook, Review

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/audiobooks")


def _review_dict(review):
    return {
        "id": review.id,
        "user_id": review.user_id,
        "audiobook_id": review.audiobook_id,
        "rating": review.rating,
        "text": review.text,
        "created_at": review.created_at.isoformat(),
        "updated_at": review.updated_at.isoformat(),
        "user_display_name": review.user.display_name if review.user else None,
    }


def _recalculate_rating(audiobook_id):
    """Recalculate average rating and review count for an audiobook."""
    reviews = Review.query.filter_by(audiobook_id=audiobook_id).all()
    ab = db.session.get(Audiobook, audiobook_id)
    if ab:
        ab.review_count = len(reviews)
        ab.average_rating = (
            round(sum(r.rating for r in reviews) / len(reviews), 2)
            if reviews
            else 0.0
        )
        db.session.commit()


@reviews_bp.route("/<string:audiobook_id>/reviews", methods=["GET"])
def list_reviews(audiobook_id):
    """GET /api/audiobooks/:id/reviews"""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    sort = request.args.get("sort", "created_at")
    order = request.args.get("order", "desc")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    query = Review.query.filter_by(audiobook_id=audiobook_id)

    sort_col = getattr(Review, sort, Review.created_at)
    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    total = query.count()
    reviews = query.offset((page - 1) * limit).limit(limit).all()

    # Rating breakdown
    all_reviews = Review.query.filter_by(audiobook_id=audiobook_id).all()
    breakdown = {i: 0 for i in range(1, 6)}
    for r in all_reviews:
        breakdown[r.rating] += 1

    return jsonify({
        "reviews": [_review_dict(r) for r in reviews],
        "total": total,
        "page": page,
        "average_rating": ab.average_rating,
        "rating_breakdown": breakdown,
    }), 200


@reviews_bp.route("/<string:audiobook_id>/reviews", methods=["POST"])
@jwt_required()
def create_review(audiobook_id):
    """POST /api/audiobooks/:id/reviews"""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    rating = data.get("rating")
    if not rating or not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be an integer 1-5"}), 400

    # Check for existing review
    existing = Review.query.filter_by(user_id=user_id, audiobook_id=audiobook_id).first()
    if existing:
        return jsonify({"error": "You already reviewed this audiobook"}), 409

    review = Review(
        user_id=user_id,
        audiobook_id=audiobook_id,
        rating=rating,
        text=data.get("text", ""),
    )
    db.session.add(review)
    db.session.commit()
    _recalculate_rating(audiobook_id)

    return jsonify(_review_dict(review)), 201


@reviews_bp.route("/<string:audiobook_id>/reviews/<string:review_id>", methods=["PUT"])
@jwt_required()
def update_review(audiobook_id, review_id):
    """PUT /api/audiobooks/:id/reviews/:review_id"""
    review = db.session.get(Review, review_id)
    if not review or review.audiobook_id != audiobook_id:
        return jsonify({"error": "Review not found"}), 404

    user_id = get_jwt_identity()
    if review.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    if "rating" in data:
        rating = data["rating"]
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be an integer 1-5"}), 400
        review.rating = rating

    if "text" in data:
        review.text = data["text"]

    db.session.commit()
    _recalculate_rating(audiobook_id)

    return jsonify(_review_dict(review)), 200


@reviews_bp.route("/<string:audiobook_id>/reviews/<string:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(audiobook_id, review_id):
    """DELETE /api/audiobooks/:id/reviews/:review_id"""
    review = db.session.get(Review, review_id)
    if not review or review.audiobook_id != audiobook_id:
        return jsonify({"error": "Review not found"}), 404

    user_id = get_jwt_identity()
    if review.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    db.session.delete(review)
    db.session.commit()
    _recalculate_rating(audiobook_id)

    return jsonify({"message": "Review deleted"}), 200
