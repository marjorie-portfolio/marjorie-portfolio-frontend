# API Contract

> **Source of truth: the backend** (`marjorie-portfolio-backend`).
> Generated from the backend code. Never invent an endpoint, field, or response shape that is not in this file. If one is missing or marked `UNKNOWN`, stop and ask.

## Frontend rules

- Use the existing Axios client for every request. Never call Axios from a component.
- Base URL: `import.meta.env.VITE_API_URL` (local: `http://localhost:8000`). **There is no `/api` prefix.**
- Auth uses HTTP-only cookies (`accessToken`, `refreshToken`). The Axios client must use `withCredentials: true`. Never store tokens in JS.
- Endpoints marked **multipart** take `FormData`. Do not set the `Content-Type` header manually; let the browser add the boundary.
- Backend CORS only allows `CLIENT_URL` (`http://localhost:5173`) with credentials.
- Every Prisma `DateTime` arrives as an ISO-8601 string.
- Naming is mixed on purpose, so copy the field names exactly: Section and Card use `snake_case` (`display_order`), SectionItem uses `camelCase` (`displayOrder`).

## Summary

| Method | Path | Auth | Body | Purpose |
|---|---|---|---|---|
| POST | `/auth/register` | none | JSON | Create account |
| POST | `/auth/login` | none | JSON | Log in, set cookies |
| POST | `/auth/logout` | none | none | Clear cookies |
| POST | `/auth/refresh` | refresh cookie | none | Refresh session |
| GET | `/auth/currentUser` | yes | none | Current user + dashboard data |
| GET | `/section/` | none | none | List sections (optional `?sectionId=`) |
| POST | `/section/register-section` | yes | JSON | Create section |
| PATCH | `/section/edit-section/:sectionId` | yes | multipart | Edit section (**broken**, see Known issues) |
| DELETE | `/section/delete-section/:sectionId` | yes | none | Delete section and its items/cards |
| GET | `/item/` | none | none | List items (optional `?sectionId=`) |
| POST | `/item/:sectionId/items` | **none** | multipart | Create item |
| PATCH | `/item/:sectionId/items/:itemId` | **none** | multipart | Update item |
| DELETE | `/item/:sectionId/items/:itemId` | **none** | none | Delete item |
| GET | `/cards` or `/cards/:sectionId` | none | none | List cards |
| POST | `/cards/register-cards/:sectionId` | yes | JSON | Create many cards |
| PATCH | `/cards/update-card/:cardId` | yes | JSON | Update card |
| DELETE | `/cards/delete-cards/` | yes | JSON | Delete cards by id |
| POST | `/analytics/record-visits` | none | none | Record a visit |
| GET | `/analytics/visits` | none | none | Visit count |
| GET | `/activity-logs/` | yes | none | Recent activity (**broken**, see Known issues) |

## Known backend issues (do not work around silently)

| Endpoint | Problem | Frontend handling |
|---|---|---|
| `PATCH /section/edit-section/:sectionId` | Service returns an undefined variable and the controller reads `req.file.image` instead of `req.file`. Success response is `UNKNOWN`. | Do not build section rename/image edit until the backend is fixed. |
| `GET /activity-logs/` | Controller never imports `prisma`, so it throws a `ReferenceError`. Success response is `UNKNOWN`. | Do not rely on it until fixed. |
| `POST /item/:sectionId/items` | Controller reads `sectionType` from `req.params`, but the route has no such param, so it is always `undefined` and type-specific validation is not selected. | Send `title` always; treat `description` and `image` as optional. |
| `PATCH /item/:sectionId/items/:itemId` | Controller reads `sectionItemType` but passes `sectionType`, so the service never gets it. The success message wrongly says `"Item added successfully."` | Do not send or depend on an item type. Do not show the backend message to users. |
| Item routes (POST/PATCH/DELETE) | No `authenticate` middleware. | Backend concern. Do not assume they are protected. |
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

Uploads: field name `image`, images only, max 5 MB.

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

Errors `400`: validation messages (e.g. `"Invalid email address"`), `"User already exists"`.

## POST `/auth/login`

Body (JSON): `{ emailOrUsername: string, password: string }`

Success `200`: `{ "message": "Login successful." }` and sets `accessToken` (15 min) and `refreshToken` (24 h) cookies.

Errors: `400` `"Email or username is required"` / `"Password is required"` / `"User doesn't exist"`; `401` `"Invalid email/username or password"`.

## POST `/auth/logout`

No body. Success `200`: `{ "message": "Logged out successfully." }` and clears both cookies.

## POST `/auth/refresh`

No body. Needs the `refreshToken` cookie. Success `200`: `{ "message": "Session refreshed" }` and resets both cookies.

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

Errors: `401` (see global), `404` `"User not found"`.

---

# Sections

## GET `/section/`

Query: `sectionId` (number, optional). Without it, returns all sections.

Success `200`:

```json
{
  "data": [
    { "id": 1, "title": "string", "slug": "string", "items": [], "cards": [] }
  ]
}
```

`items` is `SectionItem[]` and `cards` is `Card[]`. **For the Section page, call `GET /section/?sectionId=<id>` and use `data[0]`.**

## POST `/section/register-section`

Auth required. Body (JSON): `{ "sectionName": string }` (required; no schema validation, must be a string).

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
      "updated_at": "ISO"
    }
  }
}
```

Read the new id from `response.data.data.section.id`.

Errors: `400` `"Section is required!"`, `400` `"A record with that slug already exists."` (duplicate name).

## PATCH `/section/edit-section/:sectionId`

**Broken, see Known issues.** Auth required. Multipart: `sectionName` (string), `image` (file, optional). Success response `UNKNOWN`.

Errors: `400` `"Section ID and Name are required!"`, `404` `"Record not found."`.

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

Errors: `404` `"Record not found."`.

---

# Items

## GET `/item/`

Query: `sectionId` (number, optional).

Success `200`: `{ "data": SectionItem[] }`

## POST `/item/:sectionId/items`

No auth. **Multipart.** Params: `sectionId` (number).

| Field | Type | Notes |
|---|---|---|
| `title` | string | Required by the database. Omitting it causes a Prisma error. |
| `description` | string | Optional (stored as `null` if empty) |
| `image` | file | Optional |

Success `200`:

```json
{ "message": "Item added successfully.", "data": { "item": SectionItem } }
```

Errors: `400` item validator messages (`"Invalid input. Title and description are required."`, etc.), `400` invalid `sectionId`.

## PATCH `/item/:sectionId/items/:itemId`

No auth. **Multipart.** Params: `sectionId`, `itemId` (numbers). Fields: `title`, `description`, `image` (all optional, none formally validated).

Success `200` (message text is wrong on the backend, ignore it):

```json
{ "message": "Item added successfully.", "data": { "updated": SectionItem } }
```

Errors: `404` `"Item not found"`, `400` validator messages.

## DELETE `/item/:sectionId/items/:itemId`

No auth, no body. Only `itemId` is used by the backend.

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

Auth required. Body (JSON): `{ "descriptions": string[] }` (non-empty array).

Success `200`: `{ "count": 2 }`

Errors: `400` `"descriptions must be a non-empty array"`, `400` invalid `sectionId`.

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

Auth required. **Broken, see Known issues.** Intended response (unverified):

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
export interface Section {
  id: number;
  title: string;
  slug: string;
  display_order: number | null;
  is_visible: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/** Returned by GET /section/ */
export interface SectionSummary {
  id: number;
  title: string;
  slug: string;
  items: SectionItem[];
  cards: Card[];
}

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
  itemType: string | null;
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