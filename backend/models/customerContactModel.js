const mongoose = require('mongoose')

const CustomerContactSchema = new mongoose.Schema({
  contact: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  contactType: {
    type: String,
    default: 'mobile',
    enum: {
      values: ['mobile', 'kakaoId'],
      message: '{VALUE} is not supported'
    }
  },
  pending: [{
    counselDate: { type: String },
    timeSlot: { type: String },
    reservationId: { type: String },
    method: { type: String }
    _id: false
  }],
  confirmed: [{
    counselDate: { type: String },
    timeSlot: { type: String },
    reservationId: { type: String },
    method: { type: String }
    _id: false
  }]
}, {
  timestamps: true
})

const CustomerContact = mongoose.model('CustomerContact', CustomerContactSchema)

module.exports = CustomerContact
