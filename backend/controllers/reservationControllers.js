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
const { CLIENT_ERROR_TYPES, DEFAULT_TIME_SLOTS, RESERVATION_STATUS_VALUE } = require('../utils/constants') 

// middlewares
const getAllReservation = asyncHandler(async (req, res, next) => {
  let { from = null, to = null } = req.query
  let data

  if (from || to) {
    const queryFilter = {}
    
    if (from) { queryFilter['$gte'] = dateToNumeric(from) }
    if (to) { queryFilter['$lte'] = dateToNumeric(to) }
    
    const dbQuery = Reservation.find({ counselDate: queryFilter })
      .sort({ createdAt: -1 })

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
  const todayNumeric = dateObjToNum(new Date())
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
    totalPrice,
    status: 'pending'
  })

  res.status(201).json({ reservationId: newReservation._id })
})

// A method for customers to use
const getReservationStatus = asyncHandler(async (req, res, next) => {
  const { from } = req.query
  const counselDateFilter = { '$gte': from ? parseInt(from) : dateObjToNum(new Date()) }
  const reservations = await Reservation
    .find({ counselDate: counselDateFilter })
    .select({ counselDate: 1, timeSlot: 1, status: 1 })
  const statusData = {}

  for (const entry of reservations) {
    if (entry.status === RESERVATION_STATUS_VALUE.CANCELLED) { continue }

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
  const { from, all } = req.query
  const isAll = !from && Boolean(all)
  const counselDateFilter = { '$gte': from ? parseInt(from) : dateObjToNum(new Date()) }
  const reservations = await Reservation
    .find(isAll ? {} : { counselDate: counselDateFilter })
    .select({
      counselDate: 1,
      timeSlot: 1,
      personalDetails: 1,
      optionId: 1,
      status: 1
    })
  const statusData = {}

  for (const reservationEntry of reservations) {
    const { _id, personalDetails, timeSlot, optionId, counselDate, status } = reservationEntry

    if (status === RESERVATION_STATUS_VALUE.CANCELLED) { continue }

    const dateStr = numericDateToString(counselDate)

    if (!statusData[dateStr]) { statusData[dateStr] = {} }
    statusData[dateStr][timeSlot] = {
      reservationId: _id,
      name: personalDetails.name + (
        personalDetails.numAttendee >= 2
          ? ` 외${ personalDetails.numAttendee - 1}명`
          : ''
      ),
      counselOption: optionId
    }
  }

  res.status(200).json(statusData || [])
})

// Update an individual reservation details
const updateReservationDetails = asyncHandler(async (req, res, next) => {
  const { id: reservationId } = req.params
  const { updates = {} } = req.body

  const doc = (await Reservation.findById(reservationId)) || {}

  if (!doc) {
    sendResourceNotFound(res)
  } else {
    for (const key in updates) {
      const value = updates[key]

      doc[key] = value
    }

    try {
      const result = await doc.save()

      res.status(200).json({
        message: 'Successfully updated the reservation details',
        data: result
      })
    } catch (err) {
      console.error('error caught in updateReservationDetails (reservationControllers.js): ', err)
      sendBadRequestErr(res, 'Failed to update the reservation details')
    }
  }
})

// archiving purpose
const getAllReservationPagination = asyncHandler(async (req, res, next) => {
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

module.exports = {
  postReservation,
  getAllReservation,
  getReservationById,
  getReservationStatus,
  getReservationStatusWithDetails,
  updateReservationDetails
}
