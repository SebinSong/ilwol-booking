# How to update counsel prices

All counsel option prices live in `shared/counsel-options.js`. The frontend and backend both read
from it, so a price change touches **only this file** (plus a quick check of one frontend text).

## How price versions work

- `PRICE_OPTIONS` holds one price table per **price version**. The top-level key is the version.
- `CURRENT_PRICE_VERSION` is the version applied to **new** bookings.
- Each reservation stores the version it was booked under in `priceVersion`. Reservations made before
  versioning existed have no stored value and are treated as version `1` (Mongoose default in
  `backend/models/reservationModel.js`).
- Whenever an existing reservation is re-priced (customer changes headcount or option, admin edits it),
  the reservation's **own** version is used. So customers who booked at the old price keep the old
  rates, and only new bookings get the new prices.

## Steps

1. **Add a new version** to `PRICE_OPTIONS`. Copy the latest table and change the amounts.
   Include every priced option (`individual-counsel`, `family-counsel`, `overseas-counsel`).

   ```js
   const PRICE_OPTIONS = {
     '1': { ... },            // leave as is
     '2': {
       'individual-counsel': { price: 120000, additionalPrice: 0 },
       'family-counsel':     { price: 180000, additionalPrice: 60000 },
       'overseas-counsel':   { price: 180000, additionalPrice: 60000 }
     }
   }
   ```

2. **Bump the current version:**

   ```js
   const CURRENT_PRICE_VERSION = 2
   ```

3. **Update the price wording** in the option `description`s of `COUNSEL_OPTIONS_LIST` in the same file
   (e.g. `1인당 5만원 추가입니다`, `1인 추가당 5만원입니다`). These are shown on the option cards.

4. **Check the family price breakdown** on the booking confirmation step
   (`frontend/src/pages/booking/reserve/Reserve.jsx`). For family counsel it shows
   `(price − additionalPrice) + n x additionalPrice`. Make sure it still reads well with the new amounts.

5. **Deploy**, then **reload any open admin tabs** (see "Known limitation" below).

## Rules

- **Never edit or delete an existing version.** Reservations stored with that version are priced from it.
  Always add a new version instead, even to fix a mistake that has already been deployed.
- **Never change the model default** `priceVersion: { default: 1 }` in `reservationModel.js`. It is what
  marks pre-versioning reservations as version 1.
- `CURRENT_PRICE_VERSION` must be a key that exists in `PRICE_OPTIONS`. A reservation whose version is
  missing from `PRICE_OPTIONS` gets no price (`NaN`). Use the next number (2, 3, ...) for each new version.
- The pricing rule itself (family base price covers 2 people, other options cover 1, plus
  `additionalPrice` per extra person) is not in this file. Changing that rule is a code change in
  `backend/utils/helpers.js`, `frontend/src/utilities.jsx` and `Reserve.jsx`, not a price update.

## Checking after the deploy

- The option cards on the booking page show the new prices.
- A new booking stores the new `totalPrice` and `priceVersion` equal to the new version.
- On a reservation made before the change, changing the headcount or option (customer page) or saving
  an edit (admin page) still uses the old prices.

## Local development

In dev the booking-flow state is kept in localStorage. After changing prices, clear the
`ilwol-booking.counsel-details` key so the old option prices aren't reused.
