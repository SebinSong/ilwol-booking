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

- Path aliases (in `vite.config.js`): `@components`, `@pages`, `@utils` (→ `utilities.jsx`), `@view-data`, `@styles`, `@store`, `@hooks`, `~`.
- SCSS: every file automatically gets `@use "global_scss_utils" as *` from `src/styles`.
- Routing is in `main.jsx` (`createBrowserRouter`). Public pages: home, the `/booking` step flow, `/reservation-details/:id` (customer self-service: change schedule, headcount, option or method), `/inquiry`. Admin pages are under `/admin/*`.
- State: Redux Toolkit + RTK Query. `store/features/apiSlice.js` is the base API (adds the JWT from `authDetails`), and the feature `*ApiSlice.js` files inject endpoints. `counselDetailsSlice` holds the multi-step booking state (persisted to localStorage in DEV only).
- `components/global/index.js` attaches some components to `React.Global` for use without imports.

### Data duplicated between frontend and backend (keep in sync)

The two sides share no code, so these are hand-copied and must be kept identical:

- Counsel options and prices: `frontend/src/view-data/booking-options.js` ↔ `backend/utils/constants.js` `COUNSEL_OPTIONS_LIST`. The backend copy has an extra `admin-generated` entry with no price.
- Time slots, counsel methods, reservation statuses, `CLIENT_ERROR_TYPES`: `frontend/src/view-data/constants.js` ↔ `backend/utils/constants.js`.
- The total-price formula (`family-counsel` base price covers 2 people, others cover 1, plus `additionalPrice` for each extra person) is written out in `backend/utils/helpers.js` `computeReservationTotalPrice`, `frontend/src/utilities.jsx` `computeReservationTotalPrice`, a copy in `pages/admin/update-reservation-item/UpdateReservationItem.jsx`, and inline in `pages/booking/reserve/Reserve.jsx`.
- On booking, `postReservation` stores the `totalPrice` sent by the client without recalculating it.

`PRICE_UPDATE_REPORT.md` has a full audit of the price-related code paths.
