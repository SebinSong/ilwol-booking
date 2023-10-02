const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const { CLIENT_ERROR_TYPES } = require('../utils/constants')

// helpers
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

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET)
}

const signup_post = asyncHandler(async (req, res, next) => {
  const { type = '' } = req.params || {}
  const { email, password, username } = req.body
  const isTypeAdmin = type === 'admin'

  // check type param
  if (!type) {
    sendBadRequestErr(res, `user type must be specified`)
  }

  // check required fields
  checkRequiredFieldsAndThrow(req, res, ['email', 'username', 'password'])

  // create a user
  const newUser = await User.create({
    username,
    password,
    email,
    userType: isTypeAdmin ? 'admin-full' : 'customer',
    isPermitted: isTypeAdmin ? false : true
  }).catch(err => {
    // check if the email is already in use
    if (err?.code === 11000) {
      sendBadRequestErr(
        res,
        `The email '${email}' is already in use. please use another one`,
        { errType: CLIENT_ERROR_TYPES.EXISTING_USER }
      )
    }
  })

  res.status(201).json(newUser)
})

const login_post = asyncHandler((req, res, next) => {
  res.send('POST /auth/login called!')
  console.log('body parsed: ', req.body)
})

const logout_get = asyncHandler((req, res, next) => {
  res.send('GET /auth/logout called!')
})

module.exports = {
  signup_post,
  login_post,
  logout_get
}
