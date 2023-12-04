'use strict'

const SEC_MILLIS = 1000
const MINS_MILLIS = 60 * SEC_MILLIS
const HOURS_MILLIS = 60 * MINS_MILLIS
const DAYS_MILLIS = 24 * HOURS_MILLIS
const MONTHS_MILLIS = 30 * DAYS_MILLIS

const CLIENT_ERROR_TYPES = {
  MISSING_FIELD: 'missing-field',
  INVALID_FIELD: 'invalid-field',
  PENDING_USER: 'pending-user',
  EXISTING_USER: 'existing-user',
  EXISTING_RESERVATION: 'existing-reservation',
  NO_TOKEN: 'no-token',
  INVALID_TOKEN: 'invalid-token',
  UNAUTHORIZED: 'unauthorized'
}
const JWT_MAX_AGE = 3 * DAYS_MILLIS // 3 days

const DEFAULT_TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
]

const COUNSEL_OPTIONS_LIST = [
  {
    name: '개인 상담',
    id: 'individual-counsel',
    type: 'individual',
    description: '개인 학업/취업/미래 운세 및 고민 등을 주제로 신점 상담합니다.',
    price: 100000,
    additionalPrice: 0,
    duration: 0.5
  },
  {
    name: '해외 상담',
    id: 'overseas-counsel',
    type: 'individual',
    description: '해외 카카오 보이스톡 신점 상담입니다. 그룹 상담도 가능하며, 1인 추가당 5만원입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 1
  },
  {
    name: '커플 궁합 상담',
    id: 'couple-counsel',
    type: 'group',
    description: '2인 커플의 사주, 궁합 및 결혼운 등을 주제로 신점 상담합니다.',
    price: 150000,
    additionalPrice: 0,
    duration: 0.5
  },
  {
    name: '가족/그룹 상담',
    id: 'family-counsel',
    type: 'group',
    description: '본인 포함 2인 이상 상담 옵션입니다. 2인을 기본으로 하며, 1인 추가당 5만원입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 1
  }
]

const RESERVATION_STATUSES = [
  { value: 'confirmed', name: '확정' },
  { value: 'cancelled', name: '취소' },
  { value: 'pending', name: '대기' }
]

const RESERVATION_STATUS_VALUE = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  PENDING: 'pending'
}

module.exports = {
  CLIENT_ERROR_TYPES,
  JWT_MAX_AGE,
  SEC_MILLIS,
  MINS_MILLIS,
  HOURS_MILLIS,
  DAYS_MILLIS,
  MONTHS_MILLIS,
  DEFAULT_TIME_SLOTS,
  COUNSEL_OPTIONS_LIST,
  RESERVATION_STATUSES,
  RESERVATION_STATUS_VALUE
}
