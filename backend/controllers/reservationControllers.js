const Reservation = require('../models/reservationModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  checkRequiredFieldsAndThrow
} = require('../utils/helpers')

// middlewares
const getAllReservation = asyncHandler(async (req, res, next) => {
  let { limit = null, page = null } = req.query
  let data

  if (limit && page) {
    limit = parseInt(limit)
    page = parseInt(page)
    const dbQuery = Reservation.find({})
      .sort({ createdAt: -1 })

    if (page > 0) {
      dbQuery.skip(limit * page)
    }
    data = await dbQuery.exec()
  } else {
    data = await Reservation.find({})
      .sort({ createdAt: -1 })
  }

  res.status(200).json(data)
})

const postReservation = asyncHandler(async (req, res, next) => {
  const {
    optionId,
    counselDate,
    timeSlot,
    personalDetails,
    totalPrice
  } = req.body

  // check required fields
  checkRequiredFieldsAndThrow(
    req,
    res,
    ['optionId', 'counselDate', 'timeSlot', 'personalDetails', 'totalPrice']
  )

  const newReservation = await Reservation.create({
    optionId,
    counselDate,
    timeSlot,
    personalDetails,
    totalPrice
  })

  res.status(201).json({ reservationId: newReservation._id })
})

module.exports = {
  postReservation,
  getAllReservation
}
