const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { CLIENT_ERROR_TYPES } = require('../utils/constants.js')

const isAdmin = async (req, res, next) => {
  const token = req.cookies.jwt
  const invalidTokenErr = () => {
    res.status(400)
    res.errObj = { errType: CLIENT_ERROR_TYPES.INVALID_TOKEN }
    throw new Error ('invalid token')
  }

  if (!token) {
    res.status(401)
    res.errObj = { errType: CLIENT_ERROR_TYPES.NO_TOKEN }
    throw new Error('No token detected')
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const userId = payload.userId || ''

    if (!userId) { invalidTokenErr() }

    const user = await User.findById(userId)

    if (user &&
      ['admin-owner', 'admin-staff'].includes(user.userType)) {
      req.currentUser = user
      return next()
    }
  } catch (err) {
    console.error('isAdmin middleware caught: ', err)
  }

  invalidTokenErr()
}

module.exports = {
  isAdmin
}
