# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Booking website for a counselling business ("Ilwol"). A single npm package holds both a Vite + React SPA (`frontend/`) and an Express + MongoDB (Mongoose) API (`backend/`). UI text, SMS messages and most data strings are in Korean.

## Commands

All commands run from the repo root (there is one `package.json`).

```bash
npm run dev            # backend (nodemon backend/server) + Vite dev client, concurrently
npm run dev-server     # backend only
npm run dev-client     # frontend only (proxies /api → 127.0.0.1:$VITE_DEV_API_PORT)
npm run lint           # eslint, --max-warnings 0
npm run build          # npm install + vite build --mode production → ./dist
npm run deploy-staging # build --mode staging (base '/ilwol-booking/') and push dist to gh-pages
npm start              # production: node backend/server (serves API + ./dist)
npm run seed-data      # node backend/seeder (random reservation seed data)
```

There is no automated test runner. `backend/external-services/*.test.js` are ad-hoc scripts run with `node` that call the **real** SMS / Google Calendar services. Don't run them casually. `test/cypress` is empty.

## Environment

- Node ≥ 22.12 is required: the CommonJS backend `require()`s the ESM module in `shared/`. Production is on render.com, where the Node version is set by the `NODE_VERSION` env var in the dashboard (this overrides `.node-version`, `.nvmrc` and `package.json` `engines`).
- Backend: `backend/.env` (loaded by `dotenv` in `server.js` / `app.js`). Keys: `API_PORT`, `NODE_ENV`, `DB_URI`/`DB_URI_PROD`, `DB_NAME`, `JWT_SECRET`, `SOLAPI_*` (SMS), `SITE_URL` (used to build customer links in SMS), `CALENDAR_ID`/`CALENDAR_ID_PROD`. Google credentials are in `backend/utils/credentials.json` (gitignored).
- Frontend: `env/.env.<mode>.local`, loaded by `vite.config.js` via `loadEnv(mode, './env')`. Each key is **also** injected as a global through `define`, so a bare identifier such as `VITE_DEV_API_PORT` may appear in code as well as `import.meta.env.*`.

## Architecture

### Backend (`backend/`, CommonJS)

- `server.js` uses Node `cluster` to fork `NUM_WORKERS` (default 2) workers. Each worker connects to the DB and runs `app.js`.
- `app.js` mounts routers under `/api/*` (`auth`, `inquiry`, `reservation`, `manage`, `config`, `users`, `contacts`), then serves `../dist` statically, with an SPA fallback to `index.html`.
- Layering: `routes/` → `controllers/` (wrapped in `middlewares/asyncHandler`) → `models/`. Admin-only routes use `isAdmin` from `middlewares/authMiddlewares.js` (JWT `Authorization: Bearer`, checked against the `User` collection).
- Side effects of reservation changes live in the controllers, after the response has been sent: SMS through `external-services/sms.js` (Solapi, `toAdmin: true` sends to the owner), Google Calendar sync through `external-services/google-calendar.js`, and customer-contact upsert through `customerContactControllers.saveContactFromReservation`.
- Past reservations are moved into per-year archive collections (`getArchivedReservation(year)` in `reservationModel.js`) by `POST /api/reservation/archive`.
- Dates are stored as numbers (`YYYYMMDD`, see `dateToNumeric` / `dateObjToNum` in `utils/helpers.js`) and the business timezone is Seoul (`getDateInSeoul`).

### Frontend (`frontend/src/`, ESM, Vite root is `frontend/`)

- Path aliases (in `vite.config.js`): `@components`, `@pages`, `@utils` (→ `utilities.jsx`), `@view-data`, `@styles`, `@store`, `@hooks`, `@shared` (→ repo-root `shared/`), `~`.
- SCSS: every file automatically gets `@use "global_scss_utils" as *` from `src/styles`.
- Routing is in `main.jsx` (`createBrowserRouter`). Public pages: home, the `/booking` step flow, `/reservation-details/:id` (customer self-service: change schedule, headcount, option or method), `/inquiry`. Admin pages are under `/admin/*`.
- State: Redux Toolkit + RTK Query. `store/features/apiSlice.js` is the base API (adds the JWT from `authDetails`), and the feature `*ApiSlice.js` files inject endpoints. `counselDetailsSlice` holds the multi-step booking state (persisted to localStorage in DEV only).
- `components/global/index.js` attaches some components to `React.Global` for use without imports.

### Shared code (`shared/`)

`shared/` holds ESM modules used by both sides. `shared/package.json` sets `"type": "module"` so Node treats its `.js` files as ESM. The frontend imports them through `@shared/...`; the backend `require()`s them by relative path (`../../shared/...` from `backend/utils` or `backend/controllers`, `../shared/...` from `backend/`).

`shared/counsel-options.js` is the single source for counsel options and prices:

- `COUNSEL_OPTIONS_LIST`: option metadata (name, id, description, duration) without prices. Includes an `admin-generated` entry that has no price.
- `PRICE_OPTIONS`: price tables keyed by version, `{ [version]: { [optionId]: { price, additionalPrice } } }`.
- `CURRENT_PRICE_VERSION`: the version applied to new bookings.
- `getCounselOptionsList(customerFacing, version)`: options merged with the prices of `version` (default: current). `customerFacing = true` drops `admin-generated`; use it for anything customers see or choose from.

### Price versioning

- Each reservation stores `priceVersion`. New bookings get `CURRENT_PRICE_VERSION` in `postReservation`.
- The model has `priceVersion: { type: Number, default: 1 }`. Reservations made before versioning have no stored value and read as `1` through the Mongoose default. **The default must stay `1`**; never change it to the current version. `.lean()` queries skip defaults, so treat a missing version as `1` there.
- Any recalculation for an existing reservation (headcount or option change, by the customer or the admin) must use the reservation's own `priceVersion`, not the current one. Only new bookings and the option cards use the current prices.
- To change prices: add a new version to `PRICE_OPTIONS`, bump `CURRENT_PRICE_VERSION`, and update the price wording in the option `description`s (e.g. `5만원`). Never edit an existing version's numbers. Also check that the family price breakdown text in `Reserve.jsx` still reads well with the new amounts. Step-by-step instructions: `shared/PRICE_UPDATE.md`.
- Known limitation: a browser tab loaded before a price-version deploy still has the old bundle, so it can send an old-price `totalPrice` that gets stored under the new version. Reload admin tabs after such a deploy.

### Price formula

`family-counsel`'s base price covers 2 people, other options cover 1, plus `additionalPrice` for each extra person. It is written out in three places, which must stay in sync:

- `backend/utils/helpers.js` `computeReservationTotalPrice(optionId, numAttendee, priceVersion)`: customer self-service updates and their SMS amounts in `reservationControllers.js`.
- `frontend/src/utilities.jsx` `computeReservationTotalPrice(optionId, numAttendee, priceVersion)`: the customer self-service price preview (`BookingOptionRow`, `AttendeeNumberRow`) and the admin edit page (`UpdateReservationItem.jsx`), always with the reservation's `priceVersion`. The admin page sends the computed `totalPrice` in its update payload whenever it differs from the stored value.
- Inline in `pages/booking/reserve/Reserve.jsx`: new bookings, at current prices.

On booking, `postReservation` stores the `totalPrice` sent by the client without recalculating it.

### Data still duplicated between frontend and backend (keep in sync)

- Time slots, counsel methods, reservation statuses, `CLIENT_ERROR_TYPES`: `frontend/src/view-data/constants.js` ↔ `backend/utils/constants.js`.