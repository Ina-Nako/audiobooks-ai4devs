"""
Bookstore routes: browse books, cart, checkout, orders.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import CartItem, Order, OrderItem, PrintBook, Audiobook

bookstore_bp = Blueprint("bookstore", __name__, url_prefix="/api")


def _book_dict(pb):
    ab = pb.audiobook
    return {
        "id": pb.id,
        "audiobook_id": pb.audiobook_id,
        "title": ab.title if ab else "Unknown",
        "author": ab.author if ab else "Unknown",
        "cover_image_url": ab.cover_image_url if ab else None,
        "price": pb.price,
        "stock_quantity": pb.stock_quantity,
        "isbn": pb.isbn,
        "pages": pb.pages,
        "publisher": pb.publisher,
        "in_stock": pb.stock_quantity > 0,
    }


def _cart_item_dict(item):
    pb = item.print_book
    ab = pb.audiobook if pb else None
    return {
        "id": item.id,
        "print_book_id": item.print_book_id,
        "title": ab.title if ab else "Unknown",
        "author": ab.author if ab else "Unknown",
        "cover_image_url": ab.cover_image_url if ab else None,
        "price": pb.price if pb else 0,
        "quantity": item.quantity,
        "subtotal": round((pb.price if pb else 0) * item.quantity, 2),
    }


def _order_dict(order):
    items = OrderItem.query.filter_by(order_id=order.id).all()
    return {
        "id": order.id,
        "status": order.status,
        "total_amount": order.total_amount,
        "shipping_name": order.shipping_name,
        "shipping_address": order.shipping_address,
        "shipping_city": order.shipping_city,
        "shipping_state": order.shipping_state,
        "shipping_zip": order.shipping_zip,
        "shipping_country": order.shipping_country,
        "created_at": order.created_at.isoformat(),
        "items": [
            {
                "id": oi.id,
                "print_book_id": oi.print_book_id,
                "title": oi.print_book.audiobook.title if oi.print_book and oi.print_book.audiobook else "Unknown",
                "quantity": oi.quantity,
                "unit_price": oi.unit_price,
                "subtotal": round(oi.unit_price * oi.quantity, 2),
            }
            for oi in items
        ],
    }


# ---------- Bookstore browse ----------

@bookstore_bp.route("/bookstore", methods=["GET"])
def list_books():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 20, type=int)
    search = request.args.get("search", "").strip()

    query = PrintBook.query.join(Audiobook)

    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(Audiobook.title.ilike(like), Audiobook.author.ilike(like))
        )

    min_price = request.args.get("min_price", type=float)
    if min_price is not None:
        query = query.filter(PrintBook.price >= min_price)

    max_price = request.args.get("max_price", type=float)
    if max_price is not None:
        query = query.filter(PrintBook.price <= max_price)

    in_stock = request.args.get("in_stock")
    if in_stock == "true":
        query = query.filter(PrintBook.stock_quantity > 0)

    sort = request.args.get("sort", "title")
    order = request.args.get("order", "asc")
    if sort == "price":
        sort_col = PrintBook.price
    elif sort == "title":
        sort_col = Audiobook.title
    else:
        sort_col = Audiobook.title

    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())

    total = query.count()
    books = query.offset((page - 1) * limit).limit(limit).all()

    return jsonify({
        "books": [_book_dict(b) for b in books],
        "total": total,
        "page": page,
        "limit": limit,
    }), 200


@bookstore_bp.route("/bookstore/<string:book_id>", methods=["GET"])
def get_book(book_id):
    pb = db.session.get(PrintBook, book_id)
    if not pb:
        return jsonify({"error": "Book not found"}), 404
    return jsonify(_book_dict(pb)), 200


# ---------- Cart ----------

@bookstore_bp.route("/cart", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=user_id).all()
    cart_items = [_cart_item_dict(i) for i in items]
    subtotal = sum(i["subtotal"] for i in cart_items)

    return jsonify({
        "items": cart_items,
        "item_count": len(cart_items),
        "subtotal": round(subtotal, 2),
        "shipping": 0.00 if subtotal >= 35 else 4.99,
        "total": round(subtotal + (0.00 if subtotal >= 35 else 4.99), 2),
    }), 200


@bookstore_bp.route("/cart/items", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "book_id or audiobook_id is required"}), 400

    book_id = data.get("book_id")
    audiobook_id = data.get("audiobook_id")
    quantity = data.get("quantity", 1)

    pb = None
    if book_id:
        # Try as PrintBook ID first
        pb = db.session.get(PrintBook, book_id)
        # If not found, try looking up by audiobook_id
        if not pb:
            pb = PrintBook.query.filter_by(audiobook_id=book_id).first()
    elif audiobook_id:
        pb = PrintBook.query.filter_by(audiobook_id=audiobook_id).first()

    if not pb:
        return jsonify({"error": "Print book not found"}), 404
    if pb.stock_quantity < quantity:
        return jsonify({"error": "Not enough stock"}), 400

    existing = CartItem.query.filter_by(user_id=user_id, print_book_id=pb.id).first()
    if existing:
        existing.quantity += quantity
    else:
        item = CartItem(user_id=user_id, print_book_id=pb.id, quantity=quantity)
        db.session.add(item)

    db.session.commit()
    return jsonify({"message": "Added to cart"}), 201


@bookstore_bp.route("/cart/items/<string:item_id>", methods=["PATCH"])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    item = db.session.get(CartItem, item_id)
    if not item or item.user_id != user_id:
        return jsonify({"error": "Cart item not found"}), 404

    data = request.get_json()
    quantity = data.get("quantity", 1)
    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify(_cart_item_dict(item)), 200


@bookstore_bp.route("/cart/items/<string:item_id>", methods=["DELETE"])
@jwt_required()
def remove_cart_item(item_id):
    user_id = get_jwt_identity()
    item = db.session.get(CartItem, item_id)
    if not item or item.user_id != user_id:
        return jsonify({"error": "Cart item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 200


# ---------- Orders ----------

@bookstore_bp.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({"error": "Shipping info required"}), 400

    required = ["shipping_name", "shipping_address", "shipping_city", "shipping_zip", "shipping_country"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Get cart items
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"error": "Cart is empty"}), 400

    # Validate stock and calculate total
    total = 0.0
    order_items_data = []
    for ci in cart_items:
        pb = db.session.get(PrintBook, ci.print_book_id)
        if not pb or pb.stock_quantity < ci.quantity:
            return jsonify({"error": f"Insufficient stock for item {ci.print_book_id}"}), 400
        order_items_data.append((ci, pb))
        total += pb.price * ci.quantity

    # Add shipping
    shipping = 0.00 if total >= 35 else 4.99
    total += shipping

    # Create order
    order = Order(
        user_id=user_id,
        status="confirmed",
        total_amount=round(total, 2),
        shipping_name=data["shipping_name"],
        shipping_address=data["shipping_address"],
        shipping_address_line2=data.get("shipping_address_line2"),
        shipping_city=data["shipping_city"],
        shipping_state=data.get("shipping_state"),
        shipping_zip=data["shipping_zip"],
        shipping_country=data["shipping_country"],
    )
    db.session.add(order)
    db.session.flush()

    # Create order items and reduce stock
    for ci, pb in order_items_data:
        oi = OrderItem(
            order_id=order.id,
            print_book_id=pb.id,
            quantity=ci.quantity,
            unit_price=pb.price,
        )
        db.session.add(oi)
        pb.stock_quantity -= ci.quantity

    # Clear cart
    for ci in cart_items:
        db.session.delete(ci)

    db.session.commit()

    return jsonify(_order_dict(order)), 201


@bookstore_bp.route("/orders", methods=["GET"])
@jwt_required()
def list_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify({"orders": [_order_dict(o) for o in orders]}), 200


@bookstore_bp.route("/orders/<string:order_id>", methods=["GET"])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()
    order = db.session.get(Order, order_id)
    if not order or order.user_id != user_id:
        return jsonify({"error": "Order not found"}), 404
    return jsonify(_order_dict(order)), 200
