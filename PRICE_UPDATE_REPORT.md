# Counsel Option Price Update — Impact Report

**Question:** If `price` / `additionalPrice` are updated consistently in
`frontend/src/view-data/booking-options.js` and `backend/utils/constants.js`, does every
price-related path in the app pick up the new values correctly?

**Short answer:** Mostly yes, with **one hardcoded value that must be changed manually** and
**two behaviours involving reservations made before the change** that you should know about.

| # | Item | Status |
|---|------|--------|
| A | Hardcoded `50000` in a customer SMS | ❌ **Must fix manually** |
| B | Hardcoded `5만원` in option `description` strings (both files) | ⚠️ Text only, update it along with the numbers |
| C | Admin edit page silently re-prices old reservations on save | ⚠️ Behaviour change for existing data |
| D | Customer self-service changes re-price old reservations | ⚠️ Behaviour change for existing data |
| E | Everything else (listed below) | ✅ Reads from the two central files |

---

## 1. Where price data lives

| File | Used by |
|------|---------|
| `frontend/src/view-data/booking-options.js` | All frontend price displays and calculations |
| `backend/utils/constants.js` → `COUNSEL_OPTIONS_LIST` | `computeReservationTotalPrice` (backend), seeder |

There is no other price source (no DB collection, env var or API serving prices). A search for
`price`, `additionalPrice`, `100000`, `150000`, `50000`, `N만`, `N,NNN` and `totalPrice` across
all tracked files found only the places listed below.

**Pricing rule (the same everywhere):**
- `individual-counsel`: `price` (one person)
- `family-counsel`: `price` covers **2** people, plus `additionalPrice` for each person beyond 2
- `overseas-counsel`: `price` covers **1** person, plus `additionalPrice` for each person beyond 1

The "base headcount" of 2 for family and 1 for others is **hardcoded** in each calculation, not
stored in the data files. That is fine as long as only the amounts change.

---

## 2. Price logic, item by item

### Frontend

| # | Location | What it does | Works with new data? |
|---|----------|--------------|----------------------|
| F1 | `frontend/src/components/option-card/OptionCard.jsx:53-56` (rendered from `pages/booking/select-booking-option/SelectBookingOption.jsx:52`) | Shows `price` on each option card (with `~` for family/overseas) | ✅ Yes |
| F2 | `frontend/src/store/features/counselDetailsSlice.js:41-45` | Copies the selected option object (including prices) into the Redux store | ✅ Yes. localStorage persistence runs only in DEV (`isDEV`), so production users can't keep an old price object between visits. In dev, clear `ilwol-booking.counsel-details` from localStorage after changing prices. |
| F3 | `frontend/src/pages/booking/reserve/Reserve.jsx:57-66` | Works out the **totalPrice that is sent to the backend** on booking | ✅ Yes. For family it uses `(price − additionalPrice) + (n−1)·additionalPrice`, which equals `price + (n−2)·additionalPrice`, the same as the shared helper. Family headcount is always ≥ 2 (`EnterPersonalDetails.jsx:55`). |
| F4 | `frontend/src/pages/booking/reserve/Reserve.jsx:162-171` | Shows the total and a breakdown such as `(100,000 + 1 x 50,000)` | ✅ Correct numbers. Note: for family the breakdown base is `price − additionalPrice`, so with new prices it will show e.g. `(130,000 + 1 x 70,000)` for price 200k / add 70k. That is how it already works today, but check that the wording still reads well with the new amounts. |
| F5 | `frontend/src/utilities.jsx:322-330` `computeReservationTotalPrice` | Shared total-price helper | ✅ Yes |
| F6 | `frontend/src/pages/customer-reservation-details/AttendeeNumberRow.jsx:142-150` | Customer changes headcount and sees "current → new" price | ✅ Uses F5. See **D**: "current" is the stored old price and "new" uses the new prices. |
| F7 | `frontend/src/pages/customer-reservation-details/BookingOptionRow.jsx:50-56, 213-220` | Customer changes option and sees "current → new" price | ✅ Uses F5. Same caveat as F6. |
| F8 | `frontend/src/pages/customer-reservation-details/CustomerReservationDetails.jsx:250` | Shows the stored `data.totalPrice` | ✅ Yes (stored value) |
| F9 | `frontend/src/pages/admin/update-reservation-item/UpdateReservationItem.jsx:43-49` `computeTotalPrice` | Admin-side **copy** of F5 (duplicated logic) | ✅ Reads from `booking-options.js`. Identical formula. |
| F10 | `frontend/src/pages/admin/update-reservation-item/UpdateReservationItem.jsx:105, 279-281, 529-530` | Shows "총 가격 (자동계산)" and **writes `totalPrice` into the update payload when it differs from the stored value** | ⚠️ See **C** |
| F11 | `frontend/src/pages/admin/manage-reservation-item/AdminManageReservationItem.jsx:336` | Shows the stored `totalPrice` | ✅ Yes (stored value) |
| F12 | `frontend/src/pages/admin/reservation-history/HistoryItemSummary.jsx:157-159` | Shows the archived `totalPrice` | ✅ Yes (stored value) |
| F13 | `AdminReservationTable.jsx:49`, `AdminReservationHistory.jsx:51`, `utilities.jsx:176` | Look up the option **name** only | ✅ Not price-related |

### Backend

| # | Location | What it does | Works with new data? |
|---|----------|--------------|----------------------|
| B1 | `backend/utils/helpers.js:210-216` `computeReservationTotalPrice` | Backend total-price helper | ✅ Yes |
| B2 | `backend/controllers/reservationControllers.js:114-206` `postReservation` | Saves new reservations | ✅ But note: it **stores the `totalPrice` sent by the client without recalculating it** (line 200). It is correct only because F3 is correct. (This also means a modified client could send any price. That is an existing issue and not caused by the price change.) |
| B3 | `reservationControllers.js:543-546` (`num-attendee` self-update) | Recalculates `totalPrice` with B1 | ✅ Uses new prices. See **D**. |
| B4 | `reservationControllers.js:547-551` (`counsel-option` self-update) | Recalculates `totalPrice` with B1 | ✅ Uses new prices. See **D**. |
| B5 | `reservationControllers.js:560-567` customer SMS for adding attendees | `${diff * 50000}원의 상담료가 추가됩니다` | ❌ **Hardcoded `50000`. See A.** |
| B6 | `reservationControllers.js:571-581` customer SMS for option change | `newTotal − doc.totalPrice` | ✅ Uses B1. See **D**. |
| B7 | `reservationControllers.js:606-620` admin SMS for option change | Same calculation as B6 | ✅ Uses B1. See **D**. |
| B8 | `reservationControllers.js:325+` `updateReservationDetails` (admin) | Saves whatever `totalPrice` the admin page sends | ✅ Passes the value through. See **C**. |
| B9 | `reservationControllers.js:50` archiving | Copies the stored `totalPrice` | ✅ Yes |
| B10 | `backend/models/reservationModel.js:45` | `totalPrice: Number` | ✅ N/A |
| B11 | `backend/seeder.js:48` | `totalPrice: option.price` (dev seed data) | ✅ Uses constants. Ignores headcount, but that is dev only. |

---

## 3. Issues in detail

### A. ❌ Hardcoded `50000` in the "attendee added" SMS (must fix)

`backend/controllers/reservationControllers.js:564`

```js
`${diff * 50000}원의 상담료가 추가됩니다. <우리은행 ...>`
```

If `additionalPrice` changes, customers get an SMS asking them to transfer the wrong amount.
Suggested fix (matches B6):

```js
const priceDiff = computeReservationTotalPrice(doc.optionId, updates.numAttendee) - doc.totalPrice
// ... `${priceDiff}원의 상담료가 추가됩니다. ...`
```

Or, if you only want the attendee portion: `diff * COUNSEL_OPTIONS_LIST.find(x => x.id === doc.optionId).additionalPrice`.
These two give different amounts for an old reservation (see D). Choose based on the policy you want.

### B. ⚠️ `description` text contains prices

Both data files contain `'... 1인당 5만원 추가입니다.'` (family) and `'... 1인 추가당 5만원입니다.'` (overseas).
These strings appear on the option cards (F1). Update them along with `additionalPrice`, and keep
the two files identical.

### C. ⚠️ Admin edit page silently re-prices old reservations

`UpdateReservationItem.jsx:105` always recalculates the total from the **current** price table, and
lines 279-281 add `totalPrice` to the update payload whenever it differs from the stored value:

```js
if (computedTotalPrice !== data.totalPrice) {
  updates.totalPrice = computedTotalPrice
}
```

After the price change, opening **any reservation made before the change** in the admin edit page
and saving an unrelated field (name, phone, time, etc.) will overwrite its `totalPrice` with the new
price. The "총 가격 (자동계산)" field will also show the new price for those reservations, not what the
customer actually paid. No SMS is sent for this, so it happens quietly.

Options: (a) accept it, (b) only send `totalPrice` when `optionId` or `numAttendee` actually
changed, or (c) store a per-person rate on each reservation.

### D. ⚠️ Customer self-service changes on old reservations use new prices

For a reservation created at the old price:

- **Changing headcount (B3, F6):** `totalPrice` is fully recalculated with the new base price, so it
  goes up by more than just the added people. The screen shows `old stored → new full price`, and the
  SMS (once A is fixed with the diff approach) would ask for the whole difference.
- **Changing option (B4, B6, B7, F7):** the difference is `newTotal(new prices) − stored old total`,
  so it includes the price increase as well as the option change. The admin SMS reports the same amount.

This may be what you want (any change re-prices at the current rate), or not. It is a business
decision, but nothing will crash.

---

## 4. Pre-existing notes (not caused by the price change)

- The pricing formula is written out 4 times: `Reserve.jsx` (inline variant), `utilities.jsx`,
  `UpdateReservationItem.jsx` (copy), and `backend/utils/helpers.js`. They all agree today. Any
  future change to the rule itself (not the amounts), such as the family base headcount, has to be
  made in all four places.
- The option list is duplicated between frontend and backend. The backend also has an
  `admin-generated` entry with no `price`/`additionalPrice`. Nothing calls the backend helper with
  that id (the frontend guards against it), so it is harmless.
- The backend trusts the client-sent `totalPrice` on booking (B2).
- SMS amounts are printed without thousands separators (e.g. `70000원`). This is only cosmetic.

---

## 5. Checklist for the price-update PR

- [ ] Update `price` / `additionalPrice` in `frontend/src/view-data/booking-options.js`
- [ ] Apply the **same** values in `backend/utils/constants.js`
- [ ] Update the `5만원` wording in both `description` fields
- [ ] Fix the hardcoded `50000` at `backend/controllers/reservationControllers.js:564`
- [ ] Decide on C (admin re-pricing on save) and D (self-service re-pricing) for existing reservations
- [ ] Check the family breakdown text in `Reserve.jsx:170` with the new numbers
- [ ] Dev only: clear the `ilwol-booking.counsel-details` localStorage key
