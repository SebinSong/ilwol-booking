const mongoose = require('mongoose')

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const InquiryModel = mongoose.model('Inquiry', InquirySchema)

module.exports = InquiryModel
