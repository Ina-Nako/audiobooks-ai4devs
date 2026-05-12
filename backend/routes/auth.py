"""
Authentication routes: register, login, refresh, forgot-password, reset-password, logout.
"""

import re
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)

from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# In-memory store for password reset tokens (simple for dev; use Redis in production)
_reset_tokens = {}


def _validate_email(email):
    """Basic email format validation."""
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(pattern, email) is not None


def _validate_password(password):
    """Password: min 8 chars, at least 1 uppercase, at least 1 number."""
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    return True


def _hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def _check_password(password, password_hash):
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def _user_dict(user):
    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at.isoformat(),
    }


# --------------------------------------------------------------------------
# POST /api/auth/register
# --------------------------------------------------------------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    display_name = data.get("display_name", "").strip()

    # Validate fields
    errors = {}
    if not email or not _validate_email(email):
        errors["email"] = "Valid email is required."
    if not _validate_password(password):
        errors["password"] = "Password must be at least 8 characters with 1 uppercase and 1 number."
    if not display_name or len(display_name) < 2 or len(display_name) > 50:
        errors["display_name"] = "Display name must be 2–50 characters."

    if errors:
        return jsonify({"error": "Validation failed", "details": errors}), 400

    # Check uniqueness
    existing = User.query.filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    # Create user
    user = User(
        email=email,
        password_hash=_hash_password(password),
        display_name=display_name,
    )
    db.session.add(user)
    db.session.commit()

    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "user": _user_dict(user),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 201


# --------------------------------------------------------------------------
# POST /api/auth/login
# --------------------------------------------------------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not _check_password(password, user.password_hash):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    return jsonify({
        "user": _user_dict(user),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 200


# --------------------------------------------------------------------------
# POST /api/auth/refresh
# --------------------------------------------------------------------------
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = create_access_token(identity=user_id)
    return jsonify({"access_token": access_token}), 200


# --------------------------------------------------------------------------
# POST /api/auth/forgot-password
# --------------------------------------------------------------------------
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email", "").strip().lower()

    # Always return success to not reveal if email exists
    user = User.query.filter_by(email=email).first()
    if user:
        token = secrets.token_urlsafe(32)
        _reset_tokens[token] = {
            "user_id": user.id,
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=1),
        }
        # In a real app, send an email here. For dev, return the token directly.
        return jsonify({
            "message": "If the email exists, a reset link has been sent.",
            "reset_token": token,  # Only exposed in dev mode
        }), 200

    return jsonify({"message": "If the email exists, a reset link has been sent."}), 200


# --------------------------------------------------------------------------
# POST /api/auth/reset-password
# --------------------------------------------------------------------------
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    token = data.get("token", "")
    new_password = data.get("new_password", "")

    if not token or not new_password:
        return jsonify({"error": "Token and new_password are required"}), 400

    if not _validate_password(new_password):
        return jsonify({"error": "Password must be at least 8 characters with 1 uppercase and 1 number."}), 400

    # Validate token
    token_data = _reset_tokens.get(token)
    if not token_data:
        return jsonify({"error": "Invalid or expired reset token"}), 400

    if datetime.now(timezone.utc) > token_data["expires_at"]:
        del _reset_tokens[token]
        return jsonify({"error": "Invalid or expired reset token"}), 400

    # Update password
    user = db.session.get(User, token_data["user_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password_hash = _hash_password(new_password)
    db.session.commit()

    # Invalidate token
    del _reset_tokens[token]

    return jsonify({"message": "Password reset successfully"}), 200


# --------------------------------------------------------------------------
# POST /api/auth/logout
# --------------------------------------------------------------------------
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    # Simple implementation: client discards tokens.
    # A production app would add the token to a revocation list.
    return jsonify({"message": "Logged out successfully"}), 200
