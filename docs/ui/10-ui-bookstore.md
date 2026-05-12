# UI Bookstore Screens — AudioBooks

## Overview

The bookstore allows users to browse and purchase printed copies of books that are also available as audiobooks. The shopping experience includes a catalog, cart, checkout, and order tracking. Payment is simulated in the MVP (no real payment gateway).

---

## Screen: Bookstore Browse

**Route:** `/bookstore`

**Goal:** Let users find printed books to buy.

### Layout
- Page title: "Bookstore"
- Search bar
- Filters sidebar (genre, price range, availability)
- Grid of book cards

### Each book card shows
| Element | Source |
|---------|--------|
| Cover image | print_book.cover_image_url (or audiobook cover) |
| Title | audiobook.title |
| Author | audiobook.author |
| Price | print_book.price (formatted, e.g., "$14.99") |
| Availability | "In Stock" (green) / "Out of Stock" (red) |
| Rating | audiobook.average_rating (if reviewed) |
| "Add to Cart" button | or "Out of Stock" disabled state |
| "Listen" link | links to audiobook detail page |

### Filters
| Filter | Type | Notes |
|--------|------|-------|
| Genre/Category | multi-select checkboxes | from audiobook categories |
| Price range | range slider or min/max inputs | e.g., $0–$50 |
| Availability | toggle | "Show in-stock only" |
| Sort by | dropdown | Price (low–high), Price (high–low), Rating, Title A–Z |

### States
- **Loading** — skeleton cards
- **Empty** — "No printed books match your filters."
- **Not logged in** — "Add to Cart" prompts login

---

## Screen: Book Detail (Printed Copy)

**Route:** `/bookstore/:bookId`

This can be a section on the audiobook detail page OR a standalone page. The audiobook detail page should have a "Buy Printed Copy" panel.

### Buy Panel on Audiobook Detail
| Element | Notes |
|---------|-------|
| Section title | "Printed Edition" |
| Cover image | same as audiobook or specific print cover |
| Price | formatted |
| Availability | In Stock / Out of Stock |
| Format info | pages, ISBN, publisher |
| Quantity selector | number input, 1–10 |
| "Add to Cart" button | primary action |
| "View in Bookstore" link | navigates to bookstore with this book |

---

## Screen: Shopping Cart

**Route:** `/cart`

**Goal:** Let users review items before checkout.

**Requires authentication.**

### Layout
- Page title: "Shopping Cart"
- List of cart items
- Order summary sidebar

### Each cart item shows
| Element | Notes |
|---------|-------|
| Cover image | small thumbnail |
| Title + Author | |
| Unit price | |
| Quantity | adjustable (1–10, input or +/- buttons) |
| Item subtotal | price × quantity |
| Remove button | with confirmation or undo |

### Order summary sidebar
| Element | Notes |
|---------|-------|
| Subtotal | sum of all items |
| Shipping | flat rate or "Free" (simulated) |
| Total | subtotal + shipping |
| "Proceed to Checkout" button | primary |
| "Continue Shopping" link | back to bookstore |

### States
- **Empty cart** — "Your cart is empty. Browse the bookstore to find books."
- **Item removed** — toast with "Undo" action
- **Quantity exceeds stock** — inline warning

---

## Screen: Checkout

**Route:** `/checkout`

**Goal:** Collect shipping info and confirm the order.

**Requires authentication.**

### Layout
Step 1 and 2 can be on a single page or split into steps.

#### Step 1: Shipping Information
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Full Name | text | 2–100 chars | yes |
| Address Line 1 | text | 5–200 chars | yes |
| Address Line 2 | text | 0–200 chars | no |
| City | text | 2–100 chars | yes |
| State/Province | text | 2–100 chars | no |
| ZIP/Postal Code | text | 3–20 chars | yes |
| Country | dropdown select | from country list | yes |

#### Step 2: Order Review
- List of items with quantities and prices
- Shipping address summary
- Order total
- "Place Order" button (primary)
- "Edit Cart" link (back to cart)

#### Step 3: Confirmation
- "Order Confirmed!" message
- Order number
- Summary of items ordered
- Estimated delivery (simulated: "5–7 business days")
- "View Order" link → order history
- "Continue Browsing" link → home

### Payment simulation
- No payment form in MVP.
- "Place Order" completes immediately.
- A note on the checkout page: "Payment is simulated for demo purposes."

---

## Screen: Order History

**Route:** `/orders`

**Goal:** Let users see past orders and their statuses.

**Requires authentication.**

### Layout
- Page title: "My Orders"
- List of orders sorted by date (newest first)

### Each order shows
| Element | Notes |
|---------|-------|
| Order number | e.g., "#ORD-20260427-001" |
| Date | formatted order date |
| Status badge | Pending / Confirmed / Shipped / Delivered |
| Item count | "3 items" |
| Total | formatted amount |
| "View Details" link | expands or navigates to detail |

### Order detail (expanded or separate page)
- Shipping address
- List of items with quantities and unit prices
- Order total breakdown
- Status timeline (ordered → confirmed → shipped → delivered)

### Empty state
- "You haven't placed any orders yet. Visit the bookstore to find your next read."

---

## Component list

| Component | Purpose |
|-----------|---------|
| `BookstoreGrid` | Grid layout for printed book cards |
| `PrintBookCard` | Book card with price, availability, add-to-cart |
| `BookstoreFilters` | Sidebar filters (genre, price, availability) |
| `BuyPrintPanel` | Buy section on audiobook detail page |
| `CartItemList` | List of cart items with quantity controls |
| `CartItem` | Single cart item row |
| `CartSummary` | Order summary sidebar |
| `CheckoutForm` | Shipping information form |
| `OrderReview` | Review step before placing order |
| `OrderConfirmation` | Success page after order |
| `OrderHistoryList` | List of past orders |
| `OrderHistoryItem` | Single order summary row |
| `OrderDetail` | Expanded order with items and status timeline |
| `QuantitySelector` | Reusable +/- quantity input |
| `PriceBadge` | Formatted price display |
| `AvailabilityBadge` | In Stock / Out of Stock indicator |
