# UI Auth Screens — AudioBooks

## Overview

Authentication screens handle user registration, login, and password recovery. They should be clean, minimal, and accessible.

---

## Screen: Login

**Route:** `/login`

**Goal:** Let an existing user authenticate.

### Layout
- Centered card on the page (max-width 420px).
- App logo/title at the top.
- Form fields stacked vertically.

### Fields
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Email | email input | valid email format | yes |
| Password | password input | min 8 characters | yes |

### Actions
- **Log In** (primary button) — submits the form.
- **Forgot password?** (text link) — navigates to password reset.
- **Sign up** (text link) — navigates to registration.

### States
- **Default** — empty form, Log In button enabled.
- **Loading** — button shows spinner, form disabled.
- **Error** — inline error message below the form (e.g., "Invalid email or password").
- **Success** — redirect to the page the user came from (or Home).

### Accessibility
- All inputs have visible labels (not just placeholders).
- Error messages are associated with inputs via `aria-describedby`.
- Focus moves to the first error field on submission failure.

---

## Screen: Sign Up (Registration)

**Route:** `/signup`

**Goal:** Let a new user create an account.

### Fields
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Display Name | text input | 2–50 characters | yes |
| Email | email input | valid email, unique | yes |
| Password | password input | min 8 chars, 1 uppercase, 1 number | yes |
| Confirm Password | password input | must match password | yes |

### Actions
- **Create Account** (primary button) — submits the form.
- **Already have an account? Log in** (text link) — navigates to login.

### States
- **Default** — empty form.
- **Validation errors** — inline per-field errors shown on blur or submit.
- **Loading** — button shows spinner.
- **Email taken** — specific error message for duplicate email.
- **Success** — auto-login and redirect to Home with a welcome message.

### Password strength indicator
- Visual bar below password field: weak (red), medium (yellow), strong (green).
- Text hint: "Use 8+ characters with uppercase and numbers."

---

## Screen: Password Reset Request

**Route:** `/forgot-password`

**Goal:** Let a user request a password reset link.

### Fields
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Email | email input | valid email format | yes |

### Actions
- **Send Reset Link** (primary button).
- **Back to login** (text link).

### States
- **Success** — "If an account with this email exists, a reset link has been sent." (don't reveal if email exists)
- **Loading** — button shows spinner.

---

## Screen: Password Reset (Set New Password)

**Route:** `/reset-password/:token`

**Goal:** Let a user set a new password after clicking the reset link.

### Fields
| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| New Password | password input | min 8 chars, 1 uppercase, 1 number | yes |
| Confirm Password | password input | must match | yes |

### Actions
- **Reset Password** (primary button).

### States
- **Invalid/expired token** — show error, link to request a new reset.
- **Success** — "Password updated. Redirecting to login..."

---

## Auth Guard Behavior

### Protected routes
Pages that require authentication:
- Profile / Library
- Shopping Cart / Checkout
- Create Forum Thread / Reply
- Write Review
- Podcast Subscriptions / Queue

### Redirect behavior
- Unauthenticated user visits a protected route → redirect to `/login` with a `?redirect=` parameter.
- After successful login → redirect back to the original page.

### Auth state in the UI
- **Logged out:** Header shows "Log In" and "Sign Up" buttons.
- **Logged in:** Header shows user avatar, display name, notification bell, and a dropdown with: Profile, My Library, My Orders, Settings, Log Out.

---

## Component list

| Component | Purpose |
|-----------|---------|
| `AuthLayout` | Centered card wrapper for all auth screens |
| `LoginForm` | Email + password form |
| `SignUpForm` | Registration form with validation |
| `ForgotPasswordForm` | Email-only form for reset request |
| `ResetPasswordForm` | New password form |
| `PasswordStrengthBar` | Visual password strength indicator |
| `UserMenu` | Dropdown for logged-in users in the header |
| `AuthGuard` | Route wrapper that redirects unauthenticated users |
