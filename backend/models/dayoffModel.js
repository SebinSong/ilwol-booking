const mongoose = require('mongoose')

const DayoffSchema = new mongoose.Schema({
  month: {
    type: Number, // e.g) '202310' -> entry for 2023, Oct
    required: true
  },
  values: {
    type: [Number]
  }
})

const DayoffModel = mongoose.model('Dayoff', DayoffSchema)

module.exports = DayoffModel
