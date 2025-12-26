'use strict'

export const MINS_MILLIS = 60 * 1000
export const HOURS_MILLIS = 60 * MINS_MILLIS
export const DAYS_MILLIS = 24 * HOURS_MILLIS
const MONTHS_MILLIS = 30 * DAYS_MILLIS

export const DEFAULT_TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
]

export const EXTENDED_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00'
]

export const MOBILE_PREFIXES = [
  '010',
  '011',
  '018',
  '019'
]

export const COUNSEL_METHOD = [
  { id: 'visit', value: 'visit', name: '방문' },
  { id: 'phone', value: 'phone', name: '전화 통화' },
  { id: 'voice-talk', value: 'voice-talk', name: '보이스톡' }
]

export const COUNSEL_METHOD_ID_NAME_MAP = {
  'visit': '방문',
  'phone': '전화 통화',
  'voice-talk': '보이스톡'
}

// API paths
export const API_BASE_PATH = ['dev_mobile', 'prod_mobile'].includes(import.meta.env.MODE)
  ? window.VITE_MOBILE_API_URL || '/api'
  : '/api'
export const AUTH_PATH = '/auth'
export const RESERVATION_PATH = '/reservation'
export const INQUIRY_PATH = '/inquiry'
export const USERS_PATH = '/users'
export const CONTACTS_PATH = '/contacts'

// reservations
export const RESERVATION_STATUSES = [
  { value: 'confirmed', name: '확정' },
  { value: 'cancelled', name: '취소' },
  { value: 'pending', name: '대기' },
  { value: 'on-site-payment', name: '현장지불' }
]

// client error types - NOTE: should be in sync with the constants in back-end
export const CLIENT_ERROR_TYPES = {
  MISSING_FIELD: 'missing-field',
  INVALID_FIELD: 'invalid-field',
  EXISTING_USER: 'existing-user',
  PENDING_USER: 'pending-user',
  EXISTING_RESERVATION: 'existing-reservation',
  NO_TOKEN: 'no-token',
  INVALID_TOKEN: 'invalid-token',
  UNAUTHORIZED: 'unauthorized'
}
