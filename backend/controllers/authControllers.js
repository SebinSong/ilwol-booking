const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  CLIENT_ERROR_TYPES,
  JWT_MAX_AGE,
  SEC_MILLIS,
  HOURS_MILLIS
} = require('../utils/constants')
const {
  sendBadRequestErr,
  checkRequiredFieldsAndThrow
} = require('../utils/helpers')

const isEnvProduction = process.env.NODE_ENV === 'production'

const generateAndSendToken = (user, res) => {
  // reference (json web token): https://www.npmjs.com/package/jsonwebtoken
  const token = jwt.sign(
    { userId: user._id }, // payload
    process.env.JWT_SECRET, // secret
    {
      expiresIn: JWT_MAX_AGE / SEC_MILLIS // NOTE: has to be specified in seconds
    }
  )

  // reference (http Cookies): https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isEnvProduction,
    sameSite: 'strict',
    maxAge: JWT_MAX_AGE // NOTE: has to be specified in milli-seconds (https://expressjs.com/en/5x/api.html#res.cookie)
  })
  res.status(201).json({
    email: user.email,
    _id: user._id,
    userType: user.userType,
    isPermitted: user.isPermitted,
    tokenExpires: Date.now() + (JWT_MAX_AGE - HOURS_MILLIS)
  })
}

const createToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { 
      expiresIn: JWT_MAX_AGE // in seconds 
    }
  )
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
  checkRequiredFieldsAndThrow(req, res, ['email', 'password'])

  // create a user
  try {
    const docCount = await User.countDocuments({})
    const createAdminOwner = isTypeAdmin && (docCount === 0)
    const newUser = await User.create({
      password,
      email,
      userType: isTypeAdmin
      ? createAdminOwner ? 'admin-owner' : 'admin-staff'
      : 'customer',
      isPermitted: isTypeAdmin
        ? createAdminOwner ? true : false
        : true
    })

    if (createAdminOwner) {
      generateAndSendToken(newUser, res)
    } else {
      res.status(200).json({
        message: 'successfully created a sign up request'
      })
    }
  } catch (err) {
    // check if the email is already in use
    if (err?.code === 11000) {
      sendBadRequestErr(
        res,
        `The email '${email}' is already in use. please use another one`,
        { errType: CLIENT_ERROR_TYPES.EXISTING_USER }
      )
    }
  }
})

const login_post = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.login({ email, password })

  if (!user) {
    sendBadRequestErr(
      res,
      `invalid request.`,
      { errType: CLIENT_ERROR_TYPES.INVALID_FIELD }
    )
  } else {
    if (!user.isPermitted) {
      sendBadRequestErr(
        res,
        'This user is in pending state',
        { errType: CLIENT_ERROR_TYPES.PENDING_USER }
      )
    }

    user.numLogin += 1
    generateAndSendToken(user, res)
    await user.save()
  }
})

const logout_get = asyncHandler((req, res, next) => {
  if (!req.cookies.jwt) {
    res.status(401)
    res.errObj = { errType: CLIENT_ERROR_TYPES.NO_TOKEN }

    throw new Error('no token - The user has already been logged out.')
  }

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = {
  signup_post,
  login_post,
  logout_get
}
