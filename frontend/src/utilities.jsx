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
