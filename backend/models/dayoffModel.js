const mongoose = require('mongoose')

const DayoffSchema = new mongoose.Schema({
  year: {
    type: String, // e.g) '2023', '2024' ...
    required: true
  },
  values: {
    type: [Number] // e.g) [ 20231030, 20231101, ... ]
  }
})

const DayoffModel = mongoose.model('Dayoff', DayoffSchema)

module.exports = DayoffModel
