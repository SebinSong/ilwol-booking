const Inquiry = require('../models/inquiryModel')
const asyncHandler = require('../middlewares/asyncHandler.js')


const postInquiry = asyncHandler(async (req, res, next) => {
  const { name, message, email, title } = req.body

  // create a new inquiry
  const doc = await Inquiry.create({ name, message, email, title })
  res.status(201).json({ id: doc._id })
})

const getInquiries = asyncHandler(async (req, res) => {
  let { limit = null, page = null } = req.query
  let inquiries

  if (limit && page) {
    // A pagination request
    limit = parseInt(limit)
    page = parseInt(page)
    const dbQuery = Inquiry.find({})
      .sort({ createdAt: -1 })

    if (page > 0) {
      dbQuery.skip(limit * page)
    }
    dbQuery.limit(limit)
    inquiries = await dbQuery.exec()
  } else {
    // If not, get all inquiry documents
    inquiries = await Inquiry.find({})
      .sort({ createdAt: -1 })
  }

  res.status(200).json(inquiries)
})

module.exports = {
  postInquiry,
  getInquiries
}
