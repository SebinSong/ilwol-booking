const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
  optionId: {
    type: String,
    required: true
  },
  counselDate: {
    type: String,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  personalDetails: {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: {
      system: {
        type: String,
        required: true,
        enum: {
          values: ['lunar', 'solar'],
          message: '{VALUE} is not supported'
        }
      },
      year: { type: String, required: true },
      month: { type: String, required: true },
      date: { type: String, required: true }
    },
    numAttendee: {
      type: Number,
      default: 1
    },
    mobile: {
      prefix: { type: String, default: '010' },
      number: { type: String }
    },
    kakaoId: String,
    method: { type: String, default: 'visit' },
    email: String,
    memo: String
  },
  totalPrice: { type: Number, required: true }
})

const ReservationModel = mongoose.model('Reservation', ReservationSchema)

module.exports = ReservationModel
