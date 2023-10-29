const Reservation = require('../models/reservationModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateToNum,
  stringifyDate
} = require('../utils/helpers')
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

const getReservationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params

  const doc = (await Reservation.findById(id)) || {}
  res.status(200).json(doc)
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
    counselDate: typeof counselDate === 'string' ? dateToNum(counselDate) : counselDate,
    timeSlot,
    personalDetails,
    totalPrice
  })

  res.status(201).json({ reservationId: newReservation._id })
})

// A method for customers to use
const getReservationStatus = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query
  const dateQueryFilter = {}

  dateQueryFilter['$gte'] = from ? parseInt(from) : dateToNum(stringifyDate(Date.now()))
  if (lte) {
    dateQueryFilter['$lte'] = parseInt(to)
  }

  const reservations = (await Reservation.find({ counselDate: dateQueryFilter })
    .select({ counselDate: 1, timeSlot: 1 })) || []

  res.status(200).json({
    reserved: reservations,
    offs: []
  })
})

// A method for mangers to use
const getReservationStatusWithDetails = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query
  const isAll = !from && !to
  const dateQueryFilter = {}

  if (!isAll) {
    dateQueryFilter['$gte'] = from ? parseInt(from) : dateToNum(stringifyDate(Date.now()))
    if (lte) {
      dateQueryFilter['$lte'] = parseInt(to)
    }
  }

  const reservations = await Reservation.find(isAll ? {} : { counselDate: dateQueryFilter })
    .select({ counselDate: 1, timeSlot: 1,  })

  res.status(200).json(reservations || [])
})

module.exports = {
  postReservation,
  getAllReservation,
  getReservationById,
  getReservationStatus,
  getReservationStatusWithDetails
}
