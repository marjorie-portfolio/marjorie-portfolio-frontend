# API Contract

> **Source of truth: the backend** (`marjorie-portfolio-backend`).
> Generated from the backend code. Never invent an endpoint, field, or response shape that is not in this file. If one is missing or marked `UNKNOWN`, stop and ask.
> This version includes the current authentication, role, item-type, expiration, and cleanup changes.

## Frontend rules

- Use the existing Axios client for every request. Never call Axios from a component.
- Base URL: `import.meta.env.VITE_API_URL` (local: `http://localhost:8000`). **There is no `/api` prefix.**
- Auth uses HTTP-only cookies (`accessToken`, `refreshToken`). The Axios client must use `withCredentials: true`. Never store tokens in JS.
- Endpoints marked **multipart** take `FormData`. Do not set the `Content-Type` header manually; let the browser add the boundary.
- Backend CORS only allows `CLIENT_URL` (`http://localhost:5173`) with credentials.
- Every Prisma `DateTime` arrives as an ISO-8601 string.
- Naming is mixed on purpose, so copy the field names exactly: Section and Card use `snake_case` (`display_order`), SectionItem uses `camelCase` (`displayOrder`). Expiration fields are always `expires_at` (snake_case), even on SectionItem.
- **Guest accounts:** anything a `guest` creates (sections and items) expires 5 minutes after creation and is deleted by the backend on the next list request. The UI must tolerate guest-created content disappearing.

## Server configuration

Defined in `src/server.js` and `src/app.js`.

- Port: `8000`, no global prefix.
- JSON parser: `express.json()`; cookies: `cookie-parser`.
- CORS: origin `process.env.CLIENT_URL`, credentials enabled.
- Error middleware: `src/middleware/error.middleware.js`.
- Required env vars: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Routers mounted at: `/auth`, `/analytics`, `/section`, `/item`, `/cards`, `/activity-logs`.
- Uploads (Multer memory storage): field name `image`, image MIME types only, max 5 MB, max 2 files.

## Summary

| Method | Path | Auth | Body | Purpose |
|---|---|---|---|---|
| POST | `/auth/register` | none | JSON | Create account |
| POST | `/auth/login` | none | JSON | Log in, set cookies |
| POST | `/auth/logout` | none | none | Clear cookies |
| POST | `/auth/refresh` | refresh cookie | none | Refresh session |
| GET | `/auth/currentUser` | yes | none | Current user + dashboard data |
| GET | `/section/` | none | none | List sections (optional `?sectionId=`) |
| POST | `/section/register-section` | yes | JSON | Create section (guest sections expire) |
| PATCH | `/section/edit-section/:sectionId` | yes | multipart | Edit section 
| DELETE | `/section/delete-section/:sectionId` | yes | none | Delete section and its items/cards |
| GET | `/item/` | none | none | List items (optional `?sectionId=`) |
| POST | `/item/:sectionId/items` | **yes** | multipart | Create item (`itemType` required) |
| PATCH | `/item/:sectionId/items/:itemId` | **yes** | multipart | Update item (`itemType` required) |
| PATCH | `/item/:sectionId/items/reorder` | **yes** | Update ites displayOrder | 
| DELETE | `/item/:sectionId/items/:itemId` | **yes** | none | Delete item (`displayOrder` must be array)
| GET | `/cards` or `/cards/:sectionId` | none | none | List cards |
| POST | `/cards/register-cards/:sectionId` | yes | JSON | Create many cards |
| PATCH | `/cards/update-card/:cardId` | yes | JSON | Update card |
| DELETE | `/cards/delete-cards/` | yes | JSON | Delete cards by id |
| POST | `/analytics/record-visits` | none | none | Record a visit |
| GET | `/analytics/visits` | none | none | Visit count |
| GET | `/activity-logs/` | yes | none | Recent activity |

## Known backend issues (do not work around silently)

| Endpoint | Problem | Frontend handling |
|---|---|---|
| `PATCH /section/edit-section/:sectionId` | Controller reads `req.file.image` instead of `req.file`; service stores the update in `item` but returns undefined `section`; service references undefined `sectionType`; uploaded image values are computed but never written to the Section model. Success response is `UNKNOWN`. | Do not build section rename/image edit until the backend is fixed. |
| `GET /activity-logs/` | Controller never imports `prisma`, so it throws a `ReferenceError`. Success response is `UNKNOWN`. | Do not rely on it until fixed. |
| `PATCH /item/:sectionId/items/:itemId` | Service returns the item directly, but the controller destructures `{ updated }`, so `data` serializes as `{}`. The success message also wrongly says `"Item added successfully."` | Do **not** read `data.updated`. After a successful PATCH, refetch the item/section or merge your own local values. Ignore the backend message. |
| `POST /auth/refresh` | Selects only `id` from the user but passes `user.role` to token generation, so refreshed tokens may lose the `role` claim. | A refreshed session may no longer count as `guest`/other role. Do not rely on role surviving a refresh. |
| `POST /cards/register-cards/:sectionId` | Reads `section.id` before checking `section` exists, so a missing section may return a generic 500 instead of 400. | Handle both 400 and 500. |

## Global error responses

Every error returns `{ "message": string }`.

| Status | When | Message |
|---|---|---|
| 400 | Validation or missing field | endpoint-specific |
| 400 | Prisma unique constraint | `"A record with that <field> already exists."` |
| 400 | Prisma foreign key failure | `"Related record does not exist (invalid sectionId?)."` |
| 400 | Multer | `"File is too large"` or `"Unexpected file field \"<name>\""` |
| 401 | Auth failure | `"Invalid access token"`, `"Unauthorized"`, `"Session expired, please log in again"` |
| 404 | Prisma record missing | `"Record not found."` |
| 500 | Anything else | `"Server Error Marj"` |

---

# Auth

## POST `/auth/register`

Body (JSON):

| Field | Type | Rules |
|---|---|---|
| `email` | string | valid email |
| `username` | string | 3 to 30 chars |
| `first_name` | string | min 1 |
| `last_name` | string | min 1 |
| `password` | string | 6 to 20 chars, needs an uppercase, a lowercase, and a special character |

Success `201`:

```json
{
  "message": "Account created successfully.",
  "user": { "id": "uuid", "firstName": "string", "lastName": "string", "email": "string" }
}
```

The response does not return `username`, `role`, or `password`.

Errors `400`: validation messages (e.g. `"Invalid email address"`), `"User already exists"`.

## POST `/auth/login`

Body (JSON): `{ emailOrUsername: string, password: string }` (both required).

Success `200`: `{ "message": "Login successful." }` and sets `accessToken` (15 min) and `refreshToken` (24 h) cookies.

The JWT payload is `{ id: string; role?: string }`. The role is read server-side (`req.user.role`); the frontend cannot read it from the cookie.

Errors: `400` `"Email or username is required"` / `"Password is required"` / `"User doesn't exist"`; `401` `"Invalid email/username or password"`.

## POST `/auth/logout`

No body. Success `200`: `{ "message": "Logged out successfully." }` and clears both cookies.

## POST `/auth/refresh`

No body. Needs the `refreshToken` cookie. Success `200`: `{ "message": "Session refreshed" }` and resets both cookies. See Known issues regarding the `role` claim.

Errors `401`: `"Refresh token not found"`, `"Invalid or expired refresh token"`, `"User not found"`.

## GET `/auth/currentUser`

Auth required. Accepts a valid `accessToken` cookie, or a valid `refreshToken` cookie (then issues a new access token).

Success `200`:

```json
{
  "message": "User retrieved successfully.",
  "user": {
    "id": "uuid",
    "email": "string",
    "fullname": "First Last",
    "dashBoard": { "visitors": 0 }
  }
}
```

The response does not include `role`.

Errors: `401` `"Invalid access token"` / `"Unauthorized"` / `"Session expired, please log in again"`, `404` `"User not found"`.

---

# Sections

## GET `/section/`

Query: `sectionId` (number, optional). Without it, returns all sections.

Before listing, the backend deletes expired sections (`expires_at < now`).

Success `200`:

```json
{
  "data": [
    { "id": 1, "title": "string", "slug": "string", "items": [], "cards": [] }
  ]
}
```

`items` is `SectionItem[]` and `cards` is `Card[]`. The query selects only `id`, `title`, `slug`, `items`, `cards`, so **`expires_at` is not included on the section itself** here.

**For the Section page, call `GET /section/?sectionId=<id>` and use `data[0]`.**

Errors: `400` `"Related record does not exist (invalid sectionId?)."`, `404` `"Record not found."`, `500` `"Server Error Marj"`.

## POST `/section/register-section`

Auth required. Body (JSON): `{ "sectionName": string }` (required; no schema validation, must be a truthy string). The route also accepts an `image` upload, but it is ignored on creation.

If `req.user.role === "guest"`, the section gets `expires_at = now + 5 minutes`. For any other role, `expires_at` is `null`.

Success `200`:

```json
{
  "message": "Section created successfully.",
  "data": {
    "section": {
      "id": 1,
      "title": "string",
      "slug": "string",
      "display_order": 0,
      "is_visible": true,
      "created_at": "ISO",
      "updated_at": "ISO",
      "expires_at": "ISO | null"
    }
  }
}
```

Read the new id from `response.data.data.section.id`.

Errors: `400` `"Section is required!"`, `400` `"A record with that slug already exists."` (duplicate name).

## PATCH `/section/edit-section/:sectionId`

**Broken, see Known issues.** Auth required. Multipart: `sectionName` (string, not schema-validated), `image` (file, optional). Success response `UNKNOWN`.

Intended shape (unverified): `{ "message": "Section updated successfully.", "data": { "updated": UNKNOWN } }`

Errors: `400` `"Section ID and Name are required!"`, `404` `"Record not found."`, `400` Multer errors.

## DELETE `/section/delete-section/:sectionId`

Auth required. No body.

Success `200`:

```json
{
  "message": "Section deleted successfully.",
  "data": {
    "section": { "id": 1, "title": "string", "slug": "string", "items": [] },
    "items": { "count": 0 },
    "cards": { "count": 0 }
  }
}
```

Errors: `404` `"Record not found."`, `400` `"Related record does not exist (invalid sectionId?)."`.

---

# Items

`itemType` is one of `"type_1" | "type_2" | "type_3"`. Required fields depend on it:

| `itemType` | Required fields |
|---|---|
| `type_1` | `title`, `description` |
| `type_2` | `title`, `image` |
| `type_3` | `title`, `description`, `image` |

## GET `/item/`

Query: `sectionId` (number, optional).

Before querying, the backend deletes expired items (`expires_at < now`).

Success `200`: `{ "data": SectionItem[] }` (includes `itemType` and `expires_at`).

## POST `/item/:sectionId/items`

**Auth required. Multipart.** Params: `sectionId` (number).

| Field | Type | Notes |
|---|---|---|
| `itemType` | string | **Required.** `type_1`, `type_2`, or `type_3` |
| `title` | string | Required for every type |
| `description` | string | Required for `type_1` and `type_3` |
| `image` | file | Required for `type_2` and `type_3` |

If `req.user.role === "guest"`, the item gets `expires_at = now + 5 minutes`. Otherwise `expires_at` is `null`.

Success `200`:

```json
{ "message": "Item added successfully.", "data": { "item": SectionItem } }
```

Errors `400`:

- `"Invalid input. A valid itemType is required."`
- `"Invalid input. Title and description are required."` (`type_1`)
- `"Invalid input. Image and title are required."` (`type_2`)
- `"Invalid input. Title, image and description are required."` (`type_3`)
- `"Related record does not exist (invalid sectionId?)."`
- Multer: `"File is too large"` / `"Unexpected file field \"<name>\""`

## PATCH `/item/:sectionId/items/:itemId`

**Auth required. Multipart.** Params: `sectionId`, `itemId` (numbers). The item must belong to the supplied `sectionId`.

Fields: `itemType` (**required by the validator**, same three values), plus `title`, `description`, `image` following the same per-type rules as POST.

Actual success `200` (message text is wrong on the backend, ignore it; **`data` is empty because of the controller bug, see Known issues**):

```json
{ "message": "Item added successfully.", "data": {} }
```

Errors: `404` `"Item not found"`, `400` the same validator messages as POST, `400` Multer errors.

## DELETE `/item/:sectionId/items/:itemId`

**Auth required.** No body. Only `itemId` is used by the backend; `sectionId` is ignored.

Success `200`:

```json
{ "message": "Item removed successfully.", "data": { "item": SectionItem } }
```

Errors: `404` `"Record not found."`.

---

# Cards

## GET `/cards` or `/cards/:sectionId`

No auth. `sectionId` is optional in the path.

Success `200`:

```json
{
  "data": [
    {
      "id": 1,
      "description": "string | null",
      "display_order": 0,
      "sectionId": 1,
      "section": { "title": "string" }
    }
  ]
}
```

`section` can be `null`.

## POST `/cards/register-cards/:sectionId`

Auth required. Body (JSON): `{ "descriptions": string[] }` (non-empty array; element types are not validated).

Success `200`: `{ "count": 2 }`

Errors: `400` `"descriptions must be a non-empty array"`, `400` invalid `sectionId` (may instead be a generic `500`, see Known issues).

## PATCH `/cards/update-card/:cardId`

Auth required. Body (JSON): `{ "description": string | null }`

Success `200`: the full `Card` object (not wrapped).

Errors: `404` `"Record not found."`.

## DELETE `/cards/delete-cards/`

Auth required. Body (JSON): `{ "cardIds": number[] }`

Success `200`: `{ "count": 2 }`

Errors: `400` `"Card IDs must be in an array"`.

> Axios sends a DELETE body via `api.delete(url, { data: { cardIds } })`.

---

# Analytics

## POST `/analytics/record-visits`

No auth, no body. Success `200`: plain text `OK` (**not JSON**).

## GET `/analytics/visits`

No auth. Success `200`: a bare JSON number, e.g. `42`.

---

# Activity Logs

## GET `/activity-logs/`

Auth required. **Broken, see Known issues.** The controller groups up to 50 records by date. Date labels are `Today`, `Yesterday`, or a localized U.S. date such as `November 3, 2026`. Intended response (unverified):

```json
[
  {
    "date": "Today | Yesterday | November 3, 2026",
    "items": [
      { "id": 1, "action": "CREATED", "entity": "section", "entityId": 1, "label": "string | null", "createdAt": "ISO" }
    ]
  }
]
```

---

# TypeScript types

```ts
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  createdAt: string | null;
  firstName: string;
  lastName: string;
  role: string | null;
}

export interface Section {
  id: number;
  title: string;
  slug: string;
  display_order: number | null;
  is_visible: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  /** Returned by section creation; NOT selected by GET /section/ */
  expires_at: string | null;
}

/** Returned by GET /section/ */
export interface SectionSummary {
  id: number;
  title: string;
  slug: string;
  items: SectionItem[];
  cards: Card[];
}

export type ItemType = "type_1" | "type_2" | "type_3";

export interface SectionItem {
  id: number;
  sectionId: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  imagePublicId: string | null;
  itemType: ItemType | null;
  expires_at: string | null;
}

export interface Card {
  id: number;
  description: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  sectionId: number | null;
}

/** Returned by GET /cards */
export interface CardWithSectionTitle {
  id: number;
  description: string | null;
  display_order: number | null;
  sectionId: number | null;
  section: { title: string } | null;
}

export interface RegisteredUser {
  id: string; // uuid
  firstName: string;
  lastName: string;
  email: string;
}

export interface CurrentUser {
  id: string; // uuid
  email: string;
  fullname: string;
  dashBoard: { visitors: number };
}

export interface WebsiteVisit {
  id: number;
  visitedAt: string | null;
}

export type ActivityAction = "CREATED" | "UPDATED" | "DELETED";

export interface ActivityLog {
  id: number;
  action: ActivityAction;
  entity: string;
  entityId: number | null;
  label: string | null;
  createdAt: string;
}

export interface ActivityLogGroup {
  date: string;
  items: ActivityLog[];
}
```