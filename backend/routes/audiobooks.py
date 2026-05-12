"""
Audiobook catalog routes: list, detail, quick listen, similar.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required, verify_jwt_in_request

from extensions import db
from models import Audiobook, ListeningProgress, PrintBook

audiobooks_bp = Blueprint("audiobooks", __name__, url_prefix="/api/audiobooks")


def _audiobook_dict(ab, include_progress=False, user_id=None):
    d = {
        "id": ab.id,
        "title": ab.title,
        "author": ab.author,
        "narrator": ab.narrator,
        "narrator_type": ab.narrator_type,
        "duration_seconds": ab.duration_seconds,
        "language": ab.language,
        "category": ab.category,
        "synopsis": ab.synopsis,
        "cover_image_url": ab.cover_image_url,
        "audio_url": ab.audio_url,
        "is_playable": ab.is_playable,
        "average_rating": ab.average_rating,
        "review_count": ab.review_count,
        "print_price": ab.print_price,
        "print_available": ab.print_available,
        "created_at": ab.created_at.isoformat() if ab.created_at else None,
    }
    if include_progress and user_id:
        progress = ListeningProgress.query.filter_by(
            user_id=user_id, audiobook_id=ab.id
        ).first()
        if progress:
            d["progress"] = {
                "position_seconds": progress.position_seconds,
                "completed": progress.completed,
            }
    return d


@audiobooks_bp.route("", methods=["GET"])
def list_audiobooks():
    """GET /api/audiobooks with filters, search, and pagination."""
    # Pagination
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    limit = min(limit, 100)
    offset = (page - 1) * limit

    query = Audiobook.query

    # Search
    search = request.args.get("search", "").strip()
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Audiobook.title.ilike(like),
                Audiobook.author.ilike(like),
                Audiobook.category.ilike(like),
            )
        )

    # Filters
    language = request.args.get("language")
    if language:
        query = query.filter(Audiobook.language == language)

    category = request.args.get("category")
    if category:
        query = query.filter(Audiobook.category.ilike(f"%{category}%"))

    author = request.args.get("author")
    if author:
        query = query.filter(Audiobook.author.ilike(f"%{author}%"))

    min_rating = request.args.get("min_rating", type=float)
    if min_rating is not None:
        query = query.filter(Audiobook.average_rating >= min_rating)

    min_duration = request.args.get("min_duration", type=int)
    if min_duration is not None:
        query = query.filter(Audiobook.duration_seconds >= min_duration)

    max_duration = request.args.get("max_duration", type=int)
    if max_duration is not None:
        query = query.filter(Audiobook.duration_seconds <= max_duration)

    # Listening status filter (requires auth)
    listening = request.args.get("listening")
    if listening:
        try:
            verify_jwt_in_request(optional=True)
            uid = get_jwt_identity()
        except Exception:
            uid = None
        if uid:
            if listening == "in_progress":
                # Books with progress that are not completed
                in_progress_ids = db.session.query(ListeningProgress.audiobook_id).filter(
                    ListeningProgress.user_id == uid,
                    ListeningProgress.completed == False
                ).subquery()
                query = query.filter(Audiobook.id.in_(in_progress_ids))
            elif listening == "not_started":
                # Books the user has never listened to
                started_ids = db.session.query(ListeningProgress.audiobook_id).filter(
                    ListeningProgress.user_id == uid
                ).subquery()
                query = query.filter(~Audiobook.id.in_(started_ids))
            elif listening == "completed":
                completed_ids = db.session.query(ListeningProgress.audiobook_id).filter(
                    ListeningProgress.user_id == uid,
                    ListeningProgress.completed == True
                ).subquery()
                query = query.filter(Audiobook.id.in_(completed_ids))

    # Sorting
    sort = request.args.get("sort", "title")
    order = request.args.get("order", "asc")
    sort_col = getattr(Audiobook, sort, Audiobook.title)
    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    total = query.count()
    audiobooks = query.offset(offset).limit(limit).all()

    # Check if user is authenticated for progress
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        pass

    return jsonify({
        "audiobooks": [_audiobook_dict(ab, include_progress=True, user_id=user_id) for ab in audiobooks],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }), 200


@audiobooks_bp.route("/<string:audiobook_id>", methods=["GET"])
def get_audiobook(audiobook_id):
    """GET /api/audiobooks/:id"""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        pass

    data = _audiobook_dict(ab, include_progress=True, user_id=user_id)

    # Include print edition info
    if ab.print_available and ab.print_book:
        data["print_edition"] = {
            "id": ab.print_book.id,
            "price": ab.print_book.price,
            "stock_quantity": ab.print_book.stock_quantity,
            "isbn": ab.print_book.isbn,
            "pages": ab.print_book.pages,
            "publisher": ab.print_book.publisher,
        }

    return jsonify(data), 200


@audiobooks_bp.route("/<string:audiobook_id>/quick-listen", methods=["GET"])
def quick_listen(audiobook_id):
    """GET /api/audiobooks/:id/quick-listen — deterministic summary."""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    # Generate a deterministic summary from the synopsis
    synopsis = ab.synopsis or "No synopsis available for this audiobook."
    sentences = synopsis.split(". ")
    summary = ". ".join(sentences[:2]) + ("." if not sentences[0].endswith(".") else "")

    # Estimated quick listen time (10% of full duration, min 2 min)
    quick_duration = max(120, ab.duration_seconds // 10)

    return jsonify({
        "audiobook_id": ab.id,
        "title": ab.title,
        "summary": summary,
        "estimated_duration_seconds": quick_duration,
        "full_duration_seconds": ab.duration_seconds,
    }), 200


@audiobooks_bp.route("/<string:audiobook_id>/similar", methods=["GET"])
def similar_titles(audiobook_id):
    """GET /api/audiobooks/:id/similar — 5 similar titles with reasons."""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    # Score candidates
    candidates = Audiobook.query.filter(Audiobook.id != ab.id).all()
    scored = []

    for candidate in candidates:
        score = 0
        reasons = []

        if candidate.language == ab.language:
            score += 3
            reasons.append("Same language")
        if candidate.category and ab.category and candidate.category == ab.category:
            score += 5
            reasons.append(f"Same category: {ab.category}")
        if candidate.author == ab.author:
            score += 4
            reasons.append("Same author")

        # Duration similarity (within 50%)
        if ab.duration_seconds > 0:
            ratio = candidate.duration_seconds / ab.duration_seconds
            if 0.5 <= ratio <= 1.5:
                score += 2
                reasons.append("Similar length")

        if score > 0:
            scored.append((candidate, score, reasons))

    # Sort by score desc, take top 5
    scored.sort(key=lambda x: x[1], reverse=True)
    top = scored[:5]

    return jsonify({
        "audiobook_id": ab.id,
        "similar": [
            {
                "id": c.id,
                "title": c.title,
                "author": c.author,
                "cover_image_url": c.cover_image_url,
                "average_rating": c.average_rating,
                "reasons": reasons,
                "score": score,
            }
            for c, score, reasons in top
        ],
    }), 200


@audiobooks_bp.route("/<string:audiobook_id>/progress", methods=["POST"])
@jwt_required()
def save_progress(audiobook_id):
    """POST /api/audiobooks/:id/progress — save listening position."""
    ab = db.session.get(Audiobook, audiobook_id)
    if not ab:
        return jsonify({"error": "Audiobook not found"}), 404

    user_id = get_jwt_identity()
    data = request.get_json()
    if not data or "position_seconds" not in data:
        return jsonify({"error": "position_seconds is required"}), 400

    position = data["position_seconds"]
    completed = data.get("completed", False)

    progress = ListeningProgress.query.filter_by(
        user_id=user_id, audiobook_id=audiobook_id
    ).first()

    if progress:
        progress.position_seconds = position
        progress.completed = completed
    else:
        progress = ListeningProgress(
            user_id=user_id,
            audiobook_id=audiobook_id,
            position_seconds=position,
            completed=completed,
        )
        db.session.add(progress)

    db.session.commit()

    return jsonify({
        "audiobook_id": audiobook_id,
        "position_seconds": progress.position_seconds,
        "completed": progress.completed,
    }), 200
