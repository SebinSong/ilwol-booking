'use strict'
const sendBadRequestErr = (res, msg, errObj = null) => {
  res.status(400)
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

const dateToNum = (dateStr) => {
  return Number(dateStr.split('-').join(''))
}
const numToDateString = (dateNum) => {
  const s = dateNum.toString()
  return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`
}

module.exports = {
  sendBadRequestErr,
  checkRequiredFieldsAndThrow,
  stringifyDate,
  dateToNum,
  numToDateString
}
