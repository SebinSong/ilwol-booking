'use strict'

const SEC_MILLIS = 1000
const MINS_MILLIS = 60 * SEC_MILLIS
const HOURS_MILLIS = 60 * MINS_MILLIS
const DAYS_MILLIS = 24 * HOURS_MILLIS
const MONTHS_MILLIS = 30 * DAYS_MILLIS

const CLIENT_ERROR_TYPES = {
  MISSING_FIELD: 'missing-field',
  INVALID_FIELD: 'invalid-field',
  EXISTING_USER: 'existing-user',
  EXISTING_RESERVATION: 'existing-reservation',
  NO_TOKEN: 'no-token',
  INVALID_TOKEN: 'invalid-token',
  UNAUTHORIZED: 'unauthorized'
}
const JWT_MAX_AGE = 3 * DAYS_MILLIS // 3 days

module.exports = {
  CLIENT_ERROR_TYPES,
  JWT_MAX_AGE,
  SEC_MILLIS,
  MINS_MILLIS,
  HOURS_MILLIS,
  DAYS_MILLIS,
  MONTHS_MILLIS
}
