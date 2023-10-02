'use strict'

const CLIENT_ERROR_TYPES = {
  MISSING_FIELD: 'missing-field',
  INVALID_FIELD: 'invalid-field',
  EXISTING_USER: 'existing-user'
}
const JWT_MAX_AGE = 3 * 24 * 60 * 60 * 1000 // 3 days

module.exports = {
  CLIENT_ERROR_TYPES,
  JWT_MAX_AGE
}