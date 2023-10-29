const Reservation = require('../models/reservationModel')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateToNumeric,
  dateObjToNum,
  stringifyDate,
  numericDateToString,
  sendBadRequestErr,
  checkRequiredFieldsAndThrow
} = require('../utils/helpers')
const { CLIENT_ERROR_TYPES } = require('../utils/constants') 

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

  const counselDateNumeric = typeof counselDate === 'string' ? dateToNumeric(counselDate) : counselDate
  const existingReservation = await Reservation.find({ counselDate: counselDateNumeric, timeSlot })

  // check if the requested reservation detail already exists in the DB.
  if (existingReservation) {
    sendBadRequestErr(
      res,
      'Requested reservation entry already exists in the DB.',
      { errType: CLIENT_ERROR_TYPES.EXISTING_RESERVATION }
    )
  }

  const newReservation = await Reservation.create({
    optionId,
    counselDate: counselDateNumeric,
    timeSlot,
    personalDetails,
    totalPrice
  })

  res.status(201).json({ reservationId: newReservation._id })
})

// A method for customers to use
const getReservationStatus = asyncHandler(async (req, res, next) => {
  const { from } = req.query

  const counselDateFilter = { '$gte': from ? parseInt(from) : dateObjToNum(new Date()) }
  const reservations = await Reservation
    .find({ counselDate: counselDateFilter })
    .select({ counselDate: 1, timeSlot: 1 })
  const data = {}

  for (const entry of reservations) {
    const dateStr = numericDateToString(entry.counselDate)

    if (!data.dateStr) { data[dateStr] = [] }
    data[dateStr].push(entry.timeSlot)
  }

  res.status(200).json({
    reserved: data,
    offs: []
  })
})

// A method for mangers to use
const getReservationStatusWithDetails = asyncHandler(async (req, res, next) => {
  const { from, to } = req.query
  const isAll = !from && !to
  const dateQueryFilter = {}

  if (!isAll) {
    dateQueryFilter['$gte'] = from ? parseInt(from) : dateToNumeric(stringifyDate(Date.now()))
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
