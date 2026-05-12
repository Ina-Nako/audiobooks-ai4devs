# UI Style Guide — AudioBooks

This style guide defines the visual design system for the full platform. It covers audiobooks, bookstore, podcasts, forum, auth, and shared components.

## Goals

- Audio-first: the player is always easy to reach via a persistent mini-player.
- Accessible by default: keyboard, focus states, and screen reader labels are not optional.
- Fast to understand: minimal UI, clear copy, predictable layout.
- Consistent across all sections: audiobooks, bookstore, podcasts, and forum share the same design language.

## Design principles

1. **Clarity over density**: show the few fields users need to make a decision.
2. **Consistency**: the same action should look and behave the same everywhere.
3. **Progress visibility**: always show listening progress, cart state, and notification counts.
4. **Graceful missing data**: if a field is missing, hide it or show a sensible default — never break layouts.
5. **Authenticated vs. guest**: degrade gracefully for visitors, encourage sign-up naturally.

## Layout

### App shell
- **Header**: logo, main navigation tabs, search bar, notification bell (logged in), user menu (logged in) or Login/Sign Up buttons (logged out).
- **Main navigation tabs**: Home, Catalog, Bookstore, Podcasts, Forum.
- **Main content area**: single region below the header.
- **Persistent mini-player**: fixed bar at the bottom of the viewport. Shows current audiobook/podcast playing, play/pause, progress bar, and speed control. Visible on all pages when something is playing.
- **Footer**: links to about, contact, terms (minimal).

### Page layouts
- **List/Browse pages** (Catalog, Bookstore, Podcasts, Forum): sidebar filters (collapsible on mobile) + main content grid/list.
- **Detail pages** (Audiobook, Book, Podcast Show, Thread): two-column on desktop (content + sidebar), single column on mobile.
- **Auth pages** (Login, Sign Up, Reset Password): centered card, max-width 420px.
- **Profile/Settings**: left sidebar navigation + main content.

### Responsive breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column, collapsible filters, bottom nav |
| Tablet | 768–1024px | Two columns where appropriate |
| Desktop | > 1024px | Full layout with sidebars |

## Typography

- Use the platform/system font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- Prefer sentence case for labels and buttons.
- Headings: H1 for page titles, H2 for sections, H3 for subsections.
- Body text: 16px base size, 1.5 line-height.
- Avoid long paragraphs; break text into readable blocks.

## Color and theming (semantic tokens)

Use semantic CSS custom properties that can be themed later:

### Core tokens
| Token | Role | Example |
|-------|------|---------|
| `--color-bg` | app background | #FAFAFA |
| `--color-surface` | cards, panels, modals | #FFFFFF |
| `--color-text` | primary text | #1A1A1A |
| `--color-text-muted` | secondary text, metadata | #6B7280 |
| `--color-border` | dividers, card borders | #E5E7EB |
| `--color-accent` | primary actions, links | #4F46E5 |
| `--color-accent-hover` | hover state for accent | #4338CA |
| `--color-danger` | errors, destructive actions | #DC2626 |
| `--color-success` | success states, in-stock | #16A34A |
| `--color-warning` | warnings, medium states | #F59E0B |
| `--color-info` | informational | #3B82F6 |

### Section-specific tokens
| Token | Role |
|-------|------|
| `--color-player-bg` | mini-player background |
| `--color-player-progress` | progress bar fill |
| `--color-forum-upvote` | upvote active color |
| `--color-forum-downvote` | downvote active color |
| `--color-rating-star` | filled star color |
| `--color-price` | price text (bookstore) |

### Contrast requirement
- All text must meet WCAG 2.1 AA contrast (4.5:1 for normal text, 3:1 for large text).

## Spacing and sizing

- Use a spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.
- Touch/click targets: minimum 44×44 px for interactive controls.
- Card padding: 16px (mobile), 24px (desktop).
- Grid gap: 16px (mobile), 24px (desktop).

## Cards

Cards are used extensively across all sections:
- **Audiobook cards** (catalog, similar titles, home)
- **Book cards** (bookstore)
- **Podcast show cards** (podcast hub)
- **Thread cards** (forum)

All cards share:
- Subtle border (`--color-border`) or light shadow.
- Rounded corners (8px).
- Hover state: slight elevation or border color change.
- Focused state: visible outline (2px solid `--color-accent`).

## Buttons and actions

### Button hierarchy
| Level | Use | Style |
|-------|-----|-------|
| Primary | One per visible context (Play, Add to Cart, Post Thread) | Solid accent color |
| Secondary | Supporting actions (Quick Listen, Add to Queue) | Outlined or light bg |
| Tertiary | Low-emphasis (Clear filters, Cancel) | Text-only |
| Danger | Destructive (Delete post, Remove from cart) | Red outlined or text |

### Button states
- Default, Hover, Active, Disabled (with reason), Loading (spinner replaces label).
- Disabled buttons should include a tooltip explaining why (e.g., "Log in to add to cart").

## Forms

- All inputs have visible labels (not only placeholders).
- Error messages appear below the input, associated with `aria-describedby`.
- Use sensible defaults (show all items when no filters applied).
- Filters should be reversible with a "Clear filters" action.
- Search inputs have a clear (×) button when not empty.

## Navigation components

### Main navigation (Header)
- Horizontal tabs on desktop: Home, Catalog, Bookstore, Podcasts, Forum.
- Active tab has underline or background accent.
- On mobile: hamburger menu or bottom tab bar.

### Breadcrumbs
- Used in: Forum (Forum > Category > Thread), Bookstore, Podcast detail pages.
- Clickable ancestor links.

### Pagination
- Used in: Catalog, Bookstore, Forum thread lists, Episode lists.
- Show: Previous, page numbers, Next.
- Show total count: "Showing 1–20 of 156 results."

## Loading, empty, and error states

| State | Design | Example |
|-------|--------|---------|
| Loading | Skeleton screens or shimmer placeholders | Card outlines with animated gradient |
| Empty | Illustration (optional) + message + action | "No results. Clear filters." |
| Error | Alert bar or inline message + retry | "Failed to load catalog. Retry." |
| Not auth | Feature teaser + login prompt | "Log in to write a review." |

## Player (mini-player bar)

- Fixed to bottom of viewport.
- 60px height.
- Shows: cover thumbnail, title, artist/host, play/pause, progress bar, speed, close/minimize.
- Clicking the title area expands to the full player page.
- When nothing is playing, the bar is hidden.
- Supports both audiobook and podcast playback.

## Ratings and reviews

- Star rating: 5 stars, half-star display for averages.
- Filled star color: `--color-rating-star` (gold/amber).
- Interactive stars (on hover for rating input).
- Review text displayed in cards with author, date, and star rating.

## Forum-specific styling

- Vote buttons: up arrow (accent when active), down arrow (downvote color when active), score between.
- Thread cards: tighter layout to fit more threads per page.
- Reply indentation: none (flat replies, not nested).
- Post body: supports basic formatting (bold, italic, links, line breaks).
- Pinned threads: highlighted with a pin icon and subtle background.

## Notifications

- Bell icon in header with red badge showing unread count.
- Dropdown panel (max 5 recent) with "View all" link.
- Each notification: icon (type), title, message preview, time, read/unread indicator.
- On mobile: full page instead of dropdown.

## Accessibility requirements

### Keyboard
- All interactive elements reachable with Tab.
- Visible focus indicator on all focusable controls (2px solid outline).
- Logical focus order matching visual order.
- Escape closes modals, dropdowns, and menus.
- Enter/Space activates buttons and links.

### Screen readers
- Every icon-only button has an accessible name (ARIA label).
- Headings are hierarchical (H1 → H2 → H3).
- Announce important changes (e.g., "Playback started", "Item added to cart", "Review submitted").
- Form errors are announced when they appear.
- Page title updates on navigation.

### Motion and audio
- Do not rely on animations to communicate state.
- Do not autoplay audio on page load.
- Provide reduced-motion support via `prefers-reduced-motion`.

## Copy guidelines

- Use short verbs: "Play", "Pause", "Buy", "Post", "Reply", "Subscribe".
- Prefer concrete labels: "Duration" instead of "Length", "Price" instead of "Cost".
- Use consistent terminology across sections.
- Error messages should explain what went wrong and what to do next.

## MVP UI checklist

### Audiobooks
- [ ] Catalog is browsable and filterable
- [ ] Detail page shows metadata, play, quick listen, similar, reviews
- [ ] Player works with speed control

### Auth
- [ ] Login, sign up, and password reset work
- [ ] Header shows correct state (logged in vs. out)

### Bookstore
- [ ] Books are browsable with prices
- [ ] Cart and checkout flow works
- [ ] Order history is accessible

### Podcasts
- [ ] Shows are browsable by category
- [ ] Episodes are playable
- [ ] Queue management works

### Forum
- [ ] Categories and threads are browsable
- [ ] Create thread and reply works
- [ ] Voting works

### Profile
- [ ] Library shows listening history and purchases
- [ ] Settings are editable
