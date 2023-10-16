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

export const MOBILE_PREFIXES = [
  '010',
  '011',
  '016',
  '017',
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

export const API_BASE_URL = '/api'
export const AUTH_URL = '/auth'
