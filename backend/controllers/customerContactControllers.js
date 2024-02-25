const CustomerContact = require('../models/customerContactModel')
const asyncHandler = require('../middlewares/asyncHandler.js')

const getAllContacts = asyncHandler(async (req, res, next) => {
  const data = (await CustomerContact.find({})) || []

  res.status(200).json(data)
})

module.exports = {
  getAllContacts
}
