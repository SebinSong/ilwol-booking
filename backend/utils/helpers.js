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
  // NOTE: passing a numeric date to this func will fail. use numericDateToString() below instead in that case.
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
  // NOTE: dateNum arg only has to be numeric value!
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

const getCounselTypeNameById = (targetId) => {
  return COUNSEL_OPTIONS_LIST.find(x => x.id === targetId)?.name || ''
}

const cloneDeep = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const isMergeableObject = (val) => {
  // check if a value is mergable via Object.assign() or anything.
  const nonNullObject = val && typeof val === 'object'

  return nonNullObject &&
    Object.prototype.toString.call(val) !== '[object RegExp]'&&
    Object.prototype.toString.call(val) !== '[object Date]'
}

const mergeObjects = (obj, src) => {
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

const stringToBase64 = (inputString) => {
  // Using encodeURIComponent to handle non-ASCII characters
  const encodedString = encodeURIComponent(inputString)
      .replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)))
  
  // Using btoa function to encode the string to base64
  const base64String = btoa(encodedString)
  return base64String
}

const base64ToString = (base64String) => {
  // Using atob function to decode the base64 string
  const decodedString = atob(base64String)
  
  // Using decodeURIComponent to handle non-ASCII characters
  const originalString = decodeURIComponent(decodedString)
  
  return originalString
}

const promiseAllWithLimit = async (asyncFuncArr, concurrencyLimit = 10) => {
  // asyncFuncArr: an array of executables that return Promise instances.
  if (!Array.isArray(asyncFuncArr)) { return }

  const chunksArr = []

  for (let i=0; i<asyncFuncArr.length; i+=concurrencyLimit) {
    chunksArr.push(asyncFuncArr.slice(i, i+concurrencyLimit))
  }

  let allResults = []
  for (const chunks of chunksArr) {
    const pArr = chunks.map(pFunc => pFunc())

    const results = await Promise.all(pArr)
    allResults.push(results)
  }

  return allResults.flat()
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
  getCounselTypeNameById,
  mergeObjects,
  cloneDeep,
  stringToBase64,
  base64ToString,
  promiseAllWithLimit
}
