const User = require('../models/userModel')
const asyncHandler = require('../middlewares/asyncHandler')
const {
  sendResourceNotFound
} = require('../utils/helpers')
// get all user data
const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = (await User.find({})) || []

  res.status(200).json(users)
})

const updateUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params
  const { updates = {} } = req.body
  const user = await User.findById(userId)

  if (!user) {
    sendResourceNotFound(res, `Cnnot find the user by id - ${userId}`)
  } else if (Object.keys(updates).length) {
    const result = await user.updateOne({ $set: updates })

    res.status(200).json({
      message: 'Successfully update the user details.',
      data: result
    })
  }
})

const deleteUser = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.params
  const deletedUser = await User.findByIdAndDelete(userId)

  if (!deletedUser) {
    sendResourceNotFound(res)
  } else {
    res.status(200).json({
      message: 'Successfully deleted the user',
      deletedId: userId
    })
  }
})

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser
}
