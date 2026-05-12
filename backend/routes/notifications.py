"""
Notification routes: list, mark read.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Notification

notifications_bp = Blueprint("notifications", __name__, url_prefix="/api/notifications")


def _notification_dict(n):
    return {
        "id": n.id,
        "type": n.type,
        "title": n.title,
        "message": n.message,
        "link": n.link,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat(),
    }


@notifications_bp.route("", methods=["GET"])
@jwt_required()
def list_notifications():
    user_id = get_jwt_identity()
    unread_only = request.args.get("unread") == "true"
    limit = request.args.get("limit", 20, type=int)

    query = Notification.query.filter_by(user_id=user_id)
    if unread_only:
        query = query.filter_by(is_read=False)

    query = query.order_by(Notification.created_at.desc())
    total = query.count()
    notifications = query.limit(limit).all()

    unread_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()

    return jsonify({
        "notifications": [_notification_dict(n) for n in notifications],
        "total": total,
        "unread_count": unread_count,
    }), 200


@notifications_bp.route("/<string:notification_id>/read", methods=["POST"])
@jwt_required()
def mark_read(notification_id):
    user_id = get_jwt_identity()
    n = db.session.get(Notification, notification_id)
    if not n or n.user_id != user_id:
        return jsonify({"error": "Notification not found"}), 404

    n.is_read = True
    db.session.commit()
    return jsonify(_notification_dict(n)), 200


@notifications_bp.route("/read-all", methods=["POST"])
@jwt_required()
def mark_all_read():
    user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200
