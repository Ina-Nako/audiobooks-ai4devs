"""
SQLAlchemy models for the AudioBooks platform.
All 18 tables as defined in docs/concept/03-features-overview.md.
"""

import uuid
from datetime import datetime, timezone

from extensions import db


def generate_uuid():
    return str(uuid.uuid4())


def utcnow():
    return datetime.now(timezone.utc)


# --------------------------------------------------------------------------
# 1. User
# --------------------------------------------------------------------------
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(50), nullable=False)
    avatar_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    # Relationships
    reviews = db.relationship("Review", backref="user", lazy="dynamic")
    listening_progress = db.relationship("ListeningProgress", backref="user", lazy="dynamic")
    cart_items = db.relationship("CartItem", backref="user", lazy="dynamic")
    orders = db.relationship("Order", backref="user", lazy="dynamic")
    podcast_subscriptions = db.relationship("PodcastSubscription", backref="user", lazy="dynamic")
    podcast_queue = db.relationship("PodcastQueue", backref="user", lazy="dynamic")
    forum_threads = db.relationship("ForumThread", backref="author", lazy="dynamic")
    forum_replies = db.relationship("ForumReply", backref="author", lazy="dynamic")
    votes = db.relationship("Vote", backref="user", lazy="dynamic")
    notifications = db.relationship("Notification", backref="user", lazy="dynamic")
    wishlists = db.relationship("Wishlist", backref="user", lazy="dynamic")

    def __repr__(self):
        return f"<User {self.display_name}>"


# --------------------------------------------------------------------------
# 2. Audiobook
# --------------------------------------------------------------------------
class Audiobook(db.Model):
    __tablename__ = "audiobooks"

    id = db.Column(db.String(100), primary_key=True)  # stable ID from dataset
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    narrator = db.Column(db.String(200), nullable=True)
    narrator_type = db.Column(db.String(10), nullable=True)  # "human" or "ai"
    duration_seconds = db.Column(db.Integer, nullable=False)
    language = db.Column(db.String(10), nullable=False)  # ISO 639-1
    category = db.Column(db.String(100), nullable=True)
    synopsis = db.Column(db.Text, nullable=True)
    cover_image_url = db.Column(db.String(500), nullable=True)
    audio_url = db.Column(db.String(500), nullable=True)
    is_playable = db.Column(db.Boolean, nullable=False, default=False)
    average_rating = db.Column(db.Float, nullable=True, default=0.0)
    review_count = db.Column(db.Integer, nullable=True, default=0)
    print_price = db.Column(db.Float, nullable=True)
    print_available = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    # Relationships
    reviews = db.relationship("Review", backref="audiobook", lazy="dynamic")
    listening_progress = db.relationship("ListeningProgress", backref="audiobook", lazy="dynamic")
    print_book = db.relationship("PrintBook", backref="audiobook", uselist=False)
    wishlists = db.relationship("Wishlist", backref="audiobook", lazy="dynamic")

    def __repr__(self):
        return f"<Audiobook {self.title}>"


# --------------------------------------------------------------------------
# 3. ListeningProgress
# --------------------------------------------------------------------------
class ListeningProgress(db.Model):
    __tablename__ = "listening_progress"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    audiobook_id = db.Column(db.String(100), db.ForeignKey("audiobooks.id"), nullable=False)
    position_seconds = db.Column(db.Integer, nullable=False, default=0)
    completed = db.Column(db.Boolean, nullable=False, default=False)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "audiobook_id", name="uq_user_audiobook_progress"),
    )

    def __repr__(self):
        return f"<ListeningProgress user={self.user_id} book={self.audiobook_id}>"


# --------------------------------------------------------------------------
# 4. Review
# --------------------------------------------------------------------------
class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    audiobook_id = db.Column(db.String(100), db.ForeignKey("audiobooks.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    text = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "audiobook_id", name="uq_user_audiobook_review"),
    )

    def __repr__(self):
        return f"<Review user={self.user_id} rating={self.rating}>"


# --------------------------------------------------------------------------
# 5. PrintBook
# --------------------------------------------------------------------------
class PrintBook(db.Model):
    __tablename__ = "print_books"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    audiobook_id = db.Column(db.String(100), db.ForeignKey("audiobooks.id"), nullable=False, unique=True)
    price = db.Column(db.Float, nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    isbn = db.Column(db.String(20), nullable=True)
    pages = db.Column(db.Integer, nullable=True)
    publisher = db.Column(db.String(200), nullable=True)
    cover_image_url = db.Column(db.String(500), nullable=True)

    # Relationships
    cart_items = db.relationship("CartItem", backref="print_book", lazy="dynamic")
    order_items = db.relationship("OrderItem", backref="print_book", lazy="dynamic")

    def __repr__(self):
        return f"<PrintBook {self.audiobook_id}>"


# --------------------------------------------------------------------------
# 6. CartItem
# --------------------------------------------------------------------------
class CartItem(db.Model):
    __tablename__ = "cart_items"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    print_book_id = db.Column(db.String(36), db.ForeignKey("print_books.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    __table_args__ = (
        db.UniqueConstraint("user_id", "print_book_id", name="uq_user_cart_item"),
    )

    def __repr__(self):
        return f"<CartItem user={self.user_id} book={self.print_book_id}>"


# --------------------------------------------------------------------------
# 7. Order
# --------------------------------------------------------------------------
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(20), nullable=False, default="confirmed")
    total_amount = db.Column(db.Float, nullable=False)
    shipping_name = db.Column(db.String(100), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_address_line2 = db.Column(db.String(200), nullable=True)
    shipping_city = db.Column(db.String(100), nullable=False)
    shipping_state = db.Column(db.String(100), nullable=True)
    shipping_zip = db.Column(db.String(20), nullable=False)
    shipping_country = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    # Relationships
    items = db.relationship("OrderItem", backref="order", lazy="dynamic")

    def __repr__(self):
        return f"<Order {self.id} status={self.status}>"


# --------------------------------------------------------------------------
# 8. OrderItem
# --------------------------------------------------------------------------
class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    order_id = db.Column(db.String(36), db.ForeignKey("orders.id"), nullable=False)
    print_book_id = db.Column(db.String(36), db.ForeignKey("print_books.id"), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<OrderItem order={self.order_id}>"


# --------------------------------------------------------------------------
# 9. PodcastShow
# --------------------------------------------------------------------------
class PodcastShow(db.Model):
    __tablename__ = "podcast_shows"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    host = db.Column(db.String(200), nullable=False)
    cover_image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(100), nullable=False)
    website_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    # Relationships
    episodes = db.relationship("PodcastEpisode", backref="show", lazy="dynamic")
    subscriptions = db.relationship("PodcastSubscription", backref="show", lazy="dynamic")

    def __repr__(self):
        return f"<PodcastShow {self.title}>"


# --------------------------------------------------------------------------
# 10. PodcastEpisode
# --------------------------------------------------------------------------
class PodcastEpisode(db.Model):
    __tablename__ = "podcast_episodes"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    show_id = db.Column(db.String(36), db.ForeignKey("podcast_shows.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    duration_seconds = db.Column(db.Integer, nullable=False)
    audio_url = db.Column(db.String(500), nullable=False)
    publish_date = db.Column(db.Date, nullable=False)
    episode_number = db.Column(db.Integer, nullable=True)
    season_number = db.Column(db.Integer, nullable=True)

    # Relationships
    queue_entries = db.relationship("PodcastQueue", backref="episode", lazy="dynamic")

    def __repr__(self):
        return f"<PodcastEpisode {self.title}>"


# --------------------------------------------------------------------------
# 11. PodcastSubscription
# --------------------------------------------------------------------------
class PodcastSubscription(db.Model):
    __tablename__ = "podcast_subscriptions"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    show_id = db.Column(db.String(36), db.ForeignKey("podcast_shows.id"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "show_id", name="uq_user_podcast_subscription"),
    )

    def __repr__(self):
        return f"<PodcastSubscription user={self.user_id} show={self.show_id}>"


# --------------------------------------------------------------------------
# 12. PodcastQueue
# --------------------------------------------------------------------------
class PodcastQueue(db.Model):
    __tablename__ = "podcast_queue"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    episode_id = db.Column(db.String(36), db.ForeignKey("podcast_episodes.id"), nullable=False)
    position = db.Column(db.Integer, nullable=False)
    added_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    def __repr__(self):
        return f"<PodcastQueue user={self.user_id} pos={self.position}>"


# --------------------------------------------------------------------------
# 13. ForumCategory
# --------------------------------------------------------------------------
class ForumCategory(db.Model):
    __tablename__ = "forum_categories"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    sort_order = db.Column(db.Integer, nullable=False, default=0)

    # Relationships
    threads = db.relationship("ForumThread", backref="category", lazy="dynamic")

    def __repr__(self):
        return f"<ForumCategory {self.name}>"


# --------------------------------------------------------------------------
# 14. ForumThread
# --------------------------------------------------------------------------
class ForumThread(db.Model):
    __tablename__ = "forum_threads"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    category_id = db.Column(db.String(36), db.ForeignKey("forum_categories.id"), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    audiobook_id = db.Column(db.String(100), db.ForeignKey("audiobooks.id"), nullable=True)
    podcast_id = db.Column(db.String(36), db.ForeignKey("podcast_shows.id"), nullable=True)
    upvotes = db.Column(db.Integer, nullable=False, default=0)
    downvotes = db.Column(db.Integer, nullable=False, default=0)
    reply_count = db.Column(db.Integer, nullable=False, default=0)
    is_pinned = db.Column(db.Boolean, nullable=False, default=False)
    is_locked = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    # Relationships
    replies = db.relationship("ForumReply", backref="thread", lazy="dynamic")

    def __repr__(self):
        return f"<ForumThread {self.title}>"


# --------------------------------------------------------------------------
# 15. ForumReply
# --------------------------------------------------------------------------
class ForumReply(db.Model):
    __tablename__ = "forum_replies"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    thread_id = db.Column(db.String(36), db.ForeignKey("forum_threads.id"), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    body = db.Column(db.Text, nullable=False)
    upvotes = db.Column(db.Integer, nullable=False, default=0)
    downvotes = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    def __repr__(self):
        return f"<ForumReply thread={self.thread_id}>"


# --------------------------------------------------------------------------
# 16. Vote
# --------------------------------------------------------------------------
class Vote(db.Model):
    __tablename__ = "votes"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    target_type = db.Column(db.String(10), nullable=False)  # "thread" or "reply"
    target_id = db.Column(db.String(36), nullable=False)
    value = db.Column(db.Integer, nullable=False)  # +1 or -1

    __table_args__ = (
        db.UniqueConstraint("user_id", "target_type", "target_id", name="uq_user_vote"),
    )

    def __repr__(self):
        return f"<Vote user={self.user_id} {self.target_type}={self.target_id}>"


# --------------------------------------------------------------------------
# 17. Notification
# --------------------------------------------------------------------------
class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(30), nullable=False)  # "forum_reply", "podcast_episode", "order_update"
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    link = db.Column(db.String(500), nullable=True)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    def __repr__(self):
        return f"<Notification {self.type} user={self.user_id}>"


# --------------------------------------------------------------------------
# 18. Wishlist
# --------------------------------------------------------------------------
class Wishlist(db.Model):
    __tablename__ = "wishlists"

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    audiobook_id = db.Column(db.String(100), db.ForeignKey("audiobooks.id"), nullable=False)
    added_at = db.Column(db.DateTime, nullable=False, default=utcnow)

    __table_args__ = (
        db.UniqueConstraint("user_id", "audiobook_id", name="uq_user_wishlist"),
    )

    def __repr__(self):
        return f"<Wishlist user={self.user_id} book={self.audiobook_id}>"
