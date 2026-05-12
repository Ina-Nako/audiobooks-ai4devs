"""
Forum routes: categories, threads, replies, voting, search.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import ForumCategory, ForumReply, ForumThread, Notification, User, Vote

forum_bp = Blueprint("forum", __name__, url_prefix="/api/forum")


def _category_dict(cat):
    return {
        "id": cat.id,
        "name": cat.name,
        "description": cat.description,
        "slug": cat.slug,
        "sort_order": cat.sort_order,
        "thread_count": cat.threads.count(),
    }


def _thread_dict(thread):
    return {
        "id": thread.id,
        "category_id": thread.category_id,
        "user_id": thread.user_id,
        "author_name": thread.author.display_name if thread.author else "Unknown",
        "title": thread.title,
        "body": thread.body,
        "audiobook_id": thread.audiobook_id,
        "podcast_id": thread.podcast_id,
        "upvotes": thread.upvotes,
        "downvotes": thread.downvotes,
        "score": thread.upvotes - thread.downvotes,
        "reply_count": thread.reply_count,
        "is_pinned": thread.is_pinned,
        "is_locked": thread.is_locked,
        "created_at": thread.created_at.isoformat(),
        "updated_at": thread.updated_at.isoformat(),
    }


def _reply_dict(reply):
    return {
        "id": reply.id,
        "thread_id": reply.thread_id,
        "user_id": reply.user_id,
        "author_name": reply.author.display_name if reply.author else "Unknown",
        "body": reply.body,
        "upvotes": reply.upvotes,
        "downvotes": reply.downvotes,
        "score": reply.upvotes - reply.downvotes,
        "created_at": reply.created_at.isoformat(),
        "updated_at": reply.updated_at.isoformat(),
    }


# ---------- Categories ----------

@forum_bp.route("/categories", methods=["GET"])
def list_categories():
    cats = ForumCategory.query.order_by(ForumCategory.sort_order).all()
    return jsonify({"categories": [_category_dict(c) for c in cats]}), 200


# ---------- Threads ----------

@forum_bp.route("/categories/<string:category_id>/threads", methods=["GET"])
def list_threads(category_id):
    cat = db.session.get(ForumCategory, category_id)
    if not cat:
        return jsonify({"error": "Category not found"}), 404

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    sort = request.args.get("sort", "created_at")
    order = request.args.get("order", "desc")

    query = ForumThread.query.filter_by(category_id=category_id)

    if sort == "score":
        if order == "asc":
            query = query.order_by((ForumThread.upvotes - ForumThread.downvotes).asc())
        else:
            query = query.order_by((ForumThread.upvotes - ForumThread.downvotes).desc())
    else:
        sort_col = getattr(ForumThread, sort, ForumThread.created_at)
        if order == "desc":
            query = query.order_by(sort_col.desc())
        else:
            query = query.order_by(sort_col.asc())

    # Pinned first
    query = ForumThread.query.filter_by(category_id=category_id).order_by(
        ForumThread.is_pinned.desc()
    )
    if sort == "score":
        query = query.order_by((ForumThread.upvotes - ForumThread.downvotes).desc())
    else:
        sort_col = getattr(ForumThread, sort, ForumThread.created_at)
        if order == "desc":
            query = query.order_by(sort_col.desc())
        else:
            query = query.order_by(sort_col.asc())

    total = query.count()
    threads = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "category": _category_dict(cat),
        "threads": [_thread_dict(t) for t in threads],
        "total": total,
        "page": page,
    }), 200


@forum_bp.route("/threads", methods=["POST"])
@jwt_required()
def create_thread():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    category_id = data.get("category_id")
    title = data.get("title", "").strip()
    body = data.get("body", "").strip()

    if not category_id:
        return jsonify({"error": "category_id is required"}), 400
    if len(title) < 5 or len(title) > 200:
        return jsonify({"error": "Title must be 5–200 characters"}), 400
    if len(body) < 10 or len(body) > 10000:
        return jsonify({"error": "Body must be 10–10000 characters"}), 400

    cat = db.session.get(ForumCategory, category_id)
    if not cat:
        return jsonify({"error": "Category not found"}), 404

    thread = ForumThread(
        category_id=category_id,
        user_id=user_id,
        title=title,
        body=body,
        audiobook_id=data.get("audiobook_id"),
        podcast_id=data.get("podcast_id"),
    )
    db.session.add(thread)
    db.session.commit()

    return jsonify(_thread_dict(thread)), 201


@forum_bp.route("/threads/<string:thread_id>", methods=["GET"])
def get_thread(thread_id):
    thread = db.session.get(ForumThread, thread_id)
    if not thread:
        return jsonify({"error": "Thread not found"}), 404

    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    replies_query = ForumReply.query.filter_by(thread_id=thread_id).order_by(ForumReply.created_at.asc())
    total_replies = replies_query.count()
    replies = replies_query.offset((page - 1) * limit).limit(limit).all()

    data = _thread_dict(thread)
    data["replies"] = [_reply_dict(r) for r in replies]
    data["total_replies"] = total_replies

    return jsonify(data), 200


@forum_bp.route("/threads/<string:thread_id>", methods=["PUT"])
@jwt_required()
def update_thread(thread_id):
    user_id = get_jwt_identity()
    thread = db.session.get(ForumThread, thread_id)
    if not thread:
        return jsonify({"error": "Thread not found"}), 404
    if thread.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    data = request.get_json()
    if "title" in data:
        thread.title = data["title"].strip()
    if "body" in data:
        thread.body = data["body"].strip()

    db.session.commit()
    return jsonify(_thread_dict(thread)), 200


@forum_bp.route("/threads/<string:thread_id>", methods=["DELETE"])
@jwt_required()
def delete_thread(thread_id):
    user_id = get_jwt_identity()
    thread = db.session.get(ForumThread, thread_id)
    if not thread:
        return jsonify({"error": "Thread not found"}), 404
    if thread.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    # Delete replies and votes
    ForumReply.query.filter_by(thread_id=thread_id).delete()
    Vote.query.filter_by(target_type="thread", target_id=thread_id).delete()
    db.session.delete(thread)
    db.session.commit()
    return jsonify({"message": "Thread deleted"}), 200


# ---------- Replies ----------

@forum_bp.route("/threads/<string:thread_id>/replies", methods=["POST"])
@jwt_required()
def create_reply(thread_id):
    user_id = get_jwt_identity()
    thread = db.session.get(ForumThread, thread_id)
    if not thread:
        return jsonify({"error": "Thread not found"}), 404
    if thread.is_locked:
        return jsonify({"error": "Thread is locked"}), 403

    data = request.get_json()
    body = data.get("body", "").strip() if data else ""
    if len(body) < 1 or len(body) > 5000:
        return jsonify({"error": "Body must be 1–5000 characters"}), 400

    reply = ForumReply(thread_id=thread_id, user_id=user_id, body=body)
    db.session.add(reply)
    thread.reply_count += 1

    # Notify thread author about the new reply (skip if replying to own thread)
    if thread.user_id != user_id:
        replier = db.session.get(User, user_id)
        replier_name = replier.display_name if replier else "Someone"
        notif = Notification(
            user_id=thread.user_id,
            type="forum_reply",
            title="New reply to your thread",
            message=f"{replier_name} replied to \"{thread.title[:50]}\"",
            link=f"/forum/thread/{thread.id}"
        )
        db.session.add(notif)

    db.session.commit()

    return jsonify(_reply_dict(reply)), 201


@forum_bp.route("/replies/<string:reply_id>", methods=["DELETE"])
@jwt_required()
def delete_reply(reply_id):
    user_id = get_jwt_identity()
    reply = db.session.get(ForumReply, reply_id)
    if not reply:
        return jsonify({"error": "Reply not found"}), 404
    if reply.user_id != user_id:
        return jsonify({"error": "Not authorized"}), 403

    thread = db.session.get(ForumThread, reply.thread_id)
    if thread:
        thread.reply_count = max(0, thread.reply_count - 1)

    Vote.query.filter_by(target_type="reply", target_id=reply_id).delete()
    db.session.delete(reply)
    db.session.commit()
    return jsonify({"message": "Reply deleted"}), 200


# ---------- Voting ----------

@forum_bp.route("/vote", methods=["POST"])
@jwt_required()
def vote():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required"}), 400

    target_type = data.get("target_type")  # "thread" or "reply"
    target_id = data.get("target_id")
    value = data.get("value")  # +1 or -1

    if target_type not in ("thread", "reply"):
        return jsonify({"error": "target_type must be 'thread' or 'reply'"}), 400
    if value not in (1, -1):
        return jsonify({"error": "value must be 1 or -1"}), 400

    # Get target
    if target_type == "thread":
        target = db.session.get(ForumThread, target_id)
    else:
        target = db.session.get(ForumReply, target_id)

    if not target:
        return jsonify({"error": "Target not found"}), 404

    # Check existing vote
    existing = Vote.query.filter_by(
        user_id=user_id, target_type=target_type, target_id=target_id
    ).first()

    if existing:
        if existing.value == value:
            # Remove vote (toggle off)
            if value == 1:
                target.upvotes = max(0, target.upvotes - 1)
            else:
                target.downvotes = max(0, target.downvotes - 1)
            db.session.delete(existing)
        else:
            # Change vote direction
            if value == 1:
                target.upvotes += 1
                target.downvotes = max(0, target.downvotes - 1)
            else:
                target.downvotes += 1
                target.upvotes = max(0, target.upvotes - 1)
            existing.value = value
    else:
        # New vote
        new_vote = Vote(user_id=user_id, target_type=target_type, target_id=target_id, value=value)
        db.session.add(new_vote)
        if value == 1:
            target.upvotes += 1
        else:
            target.downvotes += 1

    db.session.commit()

    return jsonify({
        "target_type": target_type,
        "target_id": target_id,
        "upvotes": target.upvotes,
        "downvotes": target.downvotes,
        "score": target.upvotes - target.downvotes,
    }), 200


# ---------- Search ----------

@forum_bp.route("/search", methods=["GET"])
def search_forum():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"threads": [], "total": 0}), 200

    like = f"%{q}%"
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)

    query = ForumThread.query.filter(
        db.or_(ForumThread.title.ilike(like), ForumThread.body.ilike(like))
    ).order_by(ForumThread.created_at.desc())

    total = query.count()
    threads = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "threads": [_thread_dict(t) for t in threads],
        "total": total,
        "page": page,
    }), 200
