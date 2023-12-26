'use strict'

import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD, API_BASE_PATH, RESERVATION_PATH } from '@view-data/constants.js'

export const MINS_MILLIS = 60000
export const HOURS_MILLIS = 60 * MINS_MILLIS
export const DAYS_MILLIS = 24 * HOURS_MILLIS
export const MONTHS_MILLIS = 30 * DAYS_MILLIS

export function addTimeToDate (date, timeMillis) {
  const d = new Date(date)
  d.setTime(d.getTime() + timeMillis)
  return d
}

export function addDaysToDate (date, days) {
  return addTimeToDate(date, DAYS_MILLIS * days)
}

export function classNames (...args) {
  // simplified version of 'classnames' npm package (https://www.npmjs.com/package/classnames) 
  const isObjectLiteral = (val) => {
    return typeof val === 'object' && val !== null && val.constructor === Object
  }

  return args.filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') { return arg }
      else if (isObjectLiteral(arg)) {
        const validKeyArr = []

        for (const [key, val] of Object.entries(arg)) {
          if (val) { validKeyArr.push(key) }
        }
        return validKeyArr.join(' ')
      }
    }).join(' ')
}

export function formatMoney(val, opts = {}) {
  let value = parseFloat(val)

  if (isNaN(value)) {
    value = 0.00
  }

  return new Intl.NumberFormat(
    'ko-KR',
    {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 2,
      ...opts
    }
  ).format(value)
}

export function isStringNumberOnly (val) {
  return /^\d*\.?\d*$/.test(val)
}

export function isObject (value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  )
}

export function validateEmail (str) {
  const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  return emailRegExp.test(str)
}

// localStorage related utilities.
export function checkAndParseFromLocalStorage (key, defaultValue = null) {
  const fetched = window.localStorage.getItem(key)

  return fetched ? JSON.parse(fetched) : defaultValue
}

export function saveToLocalStorage (key, value) {
  return window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeFromLocalStorage (key) {
  if (localStorage.getItem(key)) {
    return localStorage.removeItem(key)
  }
}

export function cloneDeep(obj) {
  if (!obj) return obj;

  return JSON.parse(JSON.stringify(obj));
}

export function humanDate (date, options = { month: 'short', day: 'numeric' }, locale = 'ko-KR') {
  return new Date(date).toLocaleDateString(locale, options)
}

export function humanTimeString (date, locale = 'ko-KR') {
  return new Date(date).toLocaleTimeString(locale)
}

export function genId () {
  const random = () => Math.random().toString(20).slice(2)
  return `${random()}_${random()}`
}

export function compareTimes (a, b) {
  return new Date(a).getTime() - new Date(b).getTime()
}

export function stringifyDate (date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (1 + d.getMonth())).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

export function dateToNumeric (dateStr) {
  return Number(dateStr.split('-').join(''))
}

export function dateObjToNumeric (date) {
  return dateToNumeric(stringifyDate(date))
}

export function numericDateToString (numericDate) {
  const s = numericDate.toString()
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
}

export function randomIntBetweenRange (a, b) {
  const dRange = Math.abs(b - a)
  return a + Math.floor(Math.random() * dRange)
}

export function compareArrays (arr1, arr2) {
  arr1 = arr1.slice()
  arr2 = arr2.slice()

  if (arr1.length !== arr2.length) { return false }
  else { return arr1.every(x => arr2.includes(x)) }
}

export function getCounselTypeNameById (targetId) {
  return targetId === 'admin-generated'
    ? '관리자생성 아이템'
    : bookingOptions.find(x => x.id === targetId)?.name || ''
}

export function getCounselMethodNameById (targetId) {
  return COUNSEL_METHOD.find(x => x.value === targetId).name || ''
}

export function getStatusName (status, short = false) {
  return ({
    'confirmed': short ? '확정' : '확정됨',
    'cancelled': short ? '취소' : '취소됨',
    'pending': short ? '대기' : '확정 대기중'
  })[status] || ''
}

export function dobToString (dob) {
  const zeroPad = v => v.length === 1 ? `0${v}` : v
  const { system = 'lunar', year, month, date } = dob

  return `${system === 'lunar' ? '양력' : '음력'} ${year}-${zeroPad(month)}-${zeroPad(date)}`
}

export async function checkDateAndTimeAvailable (dateStr, timeSlot) {
  const dayoffData = await fetch(
    `${API_BASE_PATH}/config/dayoffs?future=true`, { method: 'GET' }
  ).then(async r => {
    const data = await r.json()
    let finalArr = []

    Object.values(data).forEach(dayoffArr => {
      finalArr = [
        ...finalArr,
        ...dayoffArr.map(dayoffNum => numericDateToString(dayoffNum))
      ]
    })

    return finalArr
  })

  const reservationStatus = await fetch(
    `${API_BASE_PATH}${RESERVATION_PATH}/status`, { method: 'GET' }
  ).then(r => r.json())

  if (dayoffData.includes(dateStr)) {
    throw new Error('변경된 날짜가 쉬는 날과 겹칩니다. 다른 날짜를 선택해 주세요.')
  }

  if (
    Object.keys(reservationStatus?.reserved || {}).includes(dateStr) &&
    reservationStatus.reserved[dateStr]?.includes(timeSlot)
  ) {
    throw new Error('변경된 날짜/시간에 이미 예약 아이템이 있습니다.')
  }
}

function isMergeableObject (val) {
  const nonNullObject = val && typeof val === 'object'

  return nonNullObject &&
    Object.prototype.toString.call(val) !== '[object RegExp]'&&
    Object.prototype.toString.call(val) !== '[object Date]'
}

export function mergeObjects (obj, src) {
  for (const key in src) {
    const clone = isMergeableObject(src[key]) ? cloneDeep(src[key]) : undefined
    if (clone && isMergeableObject(obj[key])) {
      merge(obj[key], clone)
      continue
    }
    obj[key] = clone || src[key]
  }
  return obj
}
