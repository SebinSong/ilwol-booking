'use strict'

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
