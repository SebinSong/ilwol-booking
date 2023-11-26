const Inquiry = require('../models/inquiryModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const { sendSMS } = require('../external-services/sms.js')
const { stringifyDate } = require('../utils/helpers.js')

// create a new inquiry
const postInquiry = asyncHandler(async (req, res, next) => {
  const { name, message, email, title } = req.body

  // create a new inquiry
  const doc = await Inquiry.create({ name, message, email, title })
  res.status(201).json({ id: doc._id })

  // send a notification SMS to the admin contact
  sendSMS({
    toAdmin: true,
    message: `고객으로부터 문의사항이 접수되었습니다. [${name}, ${stringifyDate(new Date(doc.createdAt))}]`
  })
})

// Get all inquiry entries
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
