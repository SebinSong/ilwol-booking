'use strict'

const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`)

  res.status(404)
  next(err)
}

const globalErrorHandler = (err, req, res, next) => {
  const code = res.statusCode === 200 ? 500 : res.statusCode
  const msg = err.message || 'Server experienced an issue'

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
