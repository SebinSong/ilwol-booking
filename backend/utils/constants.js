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
const JWT_MAX_AGE = 30 * DAYS_MILLIS // 30 days

const DEFAULT_TIME_SLOTS = [
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
]

const EXTENDED_TIME_SLOTS = [
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
    name: '가족/커플 상담',
    id: 'family-counsel',
    type: 'group',
    description: '가족/커플 상담입니다. 친구 지인은 제외되고 1인당 5만원 추가입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 0.75
  },
  {
    name: '해외 상담',
    id: 'overseas-counsel',
    type: 'individual',
    description: '해외 카카오 보이스톡 신점 상담입니다. 그룹 상담도 가능하며, 1인 추가당 5만원입니다.',
    price: 150000,
    additionalPrice: 50000,
    duration: 0.75
  },
  {
    name: '관리자생성 아이템',
    id: 'admin-generated',
    duration: 0.5
  }
]

const COUNSEL_METHOD = [
  { id: 'visit', value: 'visit', name: '방문' },
  { id: 'phone', value: 'phone', name: '전화 통화' },
  { id: 'voice-talk', value: 'voice-talk', name: '보이스톡' }
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
  EXTENDED_TIME_SLOTS,
  COUNSEL_OPTIONS_LIST,
  COUNSEL_METHOD,
  RESERVATION_STATUSES,
  RESERVATION_STATUS_VALUE
}
