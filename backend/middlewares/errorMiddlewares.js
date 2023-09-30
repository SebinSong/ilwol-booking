'use strict'

const { CLIENT_ERROR_TYPES } = require('../utils/constants.js')

// helper
const isFieldValidationError = (err) => {
  return (err.message || '').includes('validation failed:')
}

const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`)

  res.status(404)
  next(err)
}

const globalErrorHandler = (err, req, res, next) => {
  let code = res.statusCode === 200 ? 500 : res.statusCode
  let msg = err.message || 'Server experienced an issue'

  if (isFieldValidationError(err)) {
    const [_, key, valErrMsg] = err.message.split(':')

    code = 400
    msg = valErrMsg.trim()
    res.errObj = { errType: CLIENT_ERROR_TYPES.INVALID_FIELD, fieldName: key.trim() }
  }

  res.status(code).json({
    message: msg,
    ...(res.errObj || {}),
    ...(
      process.env.NODE_ENV === 'production'
        ? { stack: err.stack || null }
        : {}
    )
  })
}

module.exports = {
  notFound,
  globalErrorHandler
}
