"""
AudioBooks Flask application factory.
"""

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from extensions import db


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=["http://localhost:3000"])
    JWTManager(app)

    # Import models so they are registered with SQLAlchemy
    import models  # noqa: F401

    # Register blueprints
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.audiobooks import audiobooks_bp
    from routes.reviews import reviews_bp
    from routes.bookstore import bookstore_bp
    from routes.podcasts import podcasts_bp
    from routes.forum import forum_bp
    from routes.notifications import notifications_bp
    from routes.home import home_bp
    from routes.wishlist import wishlist_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(audiobooks_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(bookstore_bp)
    app.register_blueprint(podcasts_bp)
    app.register_blueprint(forum_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(wishlist_bp)

    # Health check endpoint
    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    # Create all tables
    with app.app_context():
        db.create_all()

    return app


if __name__ == "__main__":
    app = create_app()

    # Seed database on first run (if tables are empty)
    with app.app_context():
        from models import Audiobook
        if Audiobook.query.first() is None:
            from seed_data import seed_all
            seed_all()

    app.run(debug=True, port=5000)
