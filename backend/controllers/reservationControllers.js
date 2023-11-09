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
const { CLIENT_ERROR_TYPES, DEFAULT_TIME_SLOTS } = require('../utils/constants') 

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
    personalDetails: pDetails,
    totalPrice
  } = req.body

  // check required fields
  checkRequiredFieldsAndThrow(
    req,
    res,
    ['optionId', 'counselDate', 'timeSlot', 'personalDetails', 'totalPrice']
  )

  const counselDateNumeric = typeof counselDate === 'string' ? dateToNumeric(counselDate) : counselDate
  const todayNumeric = dateToNumeric(new Date())
  const existingReservation = await Reservation.findOne({ 
    $or: [
      { counselDate: counselDateNumeric, timeSlot },
      optionId === 'overseas-counsel'
        ? { 
            'personalDetails.kakaoId': pDetails.kakaoId,
            counselDate: { '$gte': todayNumeric }
          }
        : {
            'personalDetails.mobile.prefix': pDetails.mobile.prefix,
            'personalDetails.mobile.number': pDetails.mobile.number,
            counselDate: { '$gte': todayNumeric }
          }
    ]
  })

  // check if the requested reservation detail already exists in the DB.
  if (existingReservation) {
    const invalidType = existingReservation.counselDate === counselDateNumeric && existingReservation.timeSlot === timeSlot
      ? 'time'
      : optionId === 'overseas-counsel'
          ? 'kakaoId'
          : 'mobile'

    sendBadRequestErr(
      res,
      'Requested reservation entry already exists in the DB.',
      { errType: CLIENT_ERROR_TYPES.EXISTING_RESERVATION, invalidType }
    )
  }

  const newReservation = await Reservation.create({
    optionId,
    counselDate: counselDateNumeric,
    timeSlot,
    personalDetails: pDetails,
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
  const statusData = {}

  for (const entry of reservations) {
    const dateStr = numericDateToString(entry.counselDate)

    if (!statusData[dateStr]) { statusData[dateStr] = [] }
    statusData[dateStr].push(entry.timeSlot)
  }

  // extract the fully-booked dates & sort it
  const fullyBooked = Object.entries(statusData)
    .filter(
      ([dateStamp, slots]) => DEFAULT_TIME_SLOTS.every(x => slots.includes(x))
    )
    .map(entry => entry[0])
  fullyBooked.sort((a, b) => new Date(a) - new Date(b))

  res.status(200).json({
    reserved: statusData,
    offs: [],
    fullyBooked
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
