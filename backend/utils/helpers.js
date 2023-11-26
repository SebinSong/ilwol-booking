'use strict'
const {
  CLIENT_ERROR_TYPES,
  DAYS_MILLIS,
  COUNSEL_OPTIONS_LIST
} = require('./constants.js')

const sendBadRequestErr = (res, msg, errObj = null) => {
  res.status(400)
  if (errObj) {
    res.errObj = errObj
  }

  throw new Error(msg)
}

const sendResourceNotFound = (res, msg = 'resource cannot be found', errObj = null) => {
  res.status(404)
  if (errObj) {
    res.errObj = errObj
  }

  throw new Error(msg)
}

const checkRequiredFieldsAndThrow = (req, res, keys = []) => {
  for (const key of keys) {
    const val = req.body[key]

    if (!val) {
      sendBadRequestErr(
        res,
        `[${key}] field is missing in the request payload`,
        { errType: CLIENT_ERROR_TYPES.MISSING_FIELD, fieldName: key }
      )
    }
  }
}

const stringifyDate = (date) => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (1 + d.getMonth())).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

const dateToNumeric = (dateStr) => {
  return Number(dateStr.split('-').join(''))
}

const dateObjToNum = (date) => {
  return dateToNumeric(stringifyDate(date))
}

const numericDateToString = (dateNum) => {
  const s = dateNum.toString()
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
}

const addTimeToDate = (date, timeMillis) => {
  const d = new Date(date)
  d.setTime(d.getTime() + timeMillis)
  return d
}

const addDaysToDate = (date, days) => {
  return addTimeToDate(date, DAYS_MILLIS * days)
}

const randomIntBetweenRange = (a, b) => {
  const dRange = Math.abs(b - a)
  return a + Math.floor(Math.random() * dRange)
}
const randomFromArray = arr => {
  const selectedIndex = randomIntBetweenRange(0, arr.length)
  return arr[selectedIndex]
}

const  getCounselTypeNameById = (targetId) => {
  return COUNSEL_OPTIONS_LIST.find(x => x.id === targetId)?.name || ''
}

module.exports = {
  sendBadRequestErr,
  sendResourceNotFound,
  checkRequiredFieldsAndThrow,
  stringifyDate,
  dateToNumeric,
  dateObjToNum,
  numericDateToString,
  addTimeToDate,
  addDaysToDate,
  randomIntBetweenRange,
  randomFromArray,
  getCounselTypeNameById
}
