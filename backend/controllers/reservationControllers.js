// models
const { Reservation, ArchivedReservation } = require('../models/reservationModel')
const Dayoff = require('../models/dayoffModel.js')
const { sendSMS } = require('../external-services/sms.js')

const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateToNumeric,
  dateObjToNum,
  stringifyDate,
  numericDateToString,
  sendBadRequestErr,
  checkRequiredFieldsAndThrow,
  sendResourceNotFound,
  getCounselTypeNameById
} = require('../utils/helpers')
const { CLIENT_ERROR_TYPES, DEFAULT_TIME_SLOTS, RESERVATION_STATUS_VALUE } = require('../utils/constants') 

// helper
const archiveOldReservation = asyncHandler(async (req, res, next) => {
  const dateNumToday = dateObjToNum(new Date())
  const counselDateFilter = { '$lt': dateNumToday }

  try {
    const docsToArchive = (await Reservation.find({ counselDate: counselDateFilter }))
      .map(
        entry => ({
          counselDate: entry.counselDate,
          timeSlot: entry.timeSlot,
          personalDetails: entry.personalDetails,
          optionId: entry.optionId,
          status: entry.status,
          totalPrice: entry.totalPrice
        })
      )

    await ArchivedReservation.create(docsToArchive)
    await Reservation.deleteMany({ counselDate: counselDateFilter })

    res.status(200).json({
      message: 'Successfully archived the old reservations'
    })
  } catch (err) {
    console.error('Failed to archive the old reservations due to a following error: ', err)
    res.status(500).json({
      message: 'Failed to archive the old reservations',
      err
    })
  }
})

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
  const hasMobileNumber = Boolean(pDetails.mobile?.number)
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

  const getReservationTime = () => `${counselDate} ${timeSlot}`

  // [ Check - 1 ] : Check if the requested reservation detail already exists in the DB.
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

  // [ Check - 2 ] : Check if the requested date is set as a owner's dayoff
  const yearStr = counselDate.split('-')[0]
  const dayOffDoc = await Dayoff.findOne({ year: yearStr })

  if (dayOffDoc && (dayOffDoc.values || []).includes(counselDateNumeric)) {
    sendBadRequestErr(
      res,
      'Requested reservation date has already been taken',
      { errType: CLIENT_ERROR_TYPES.EXISTING_RESERVATION, invalidType: 'time' }
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

  // send a notification SMS to the customer (if they have provided a contact)
  if (hasMobileNumber) {
    await sendSMS({
      to: `${pDetails.mobile.prefix}${pDetails.mobile.number}`,
      message: `${pDetails.name}님, [${getReservationTime()}]으로 ${getCounselTypeNameById(optionId)} 예약이 신청되었습니다. ` + 
        '상담료 계좌이체를 해주시면, 선녀님 혹은 관리자가 확인 후 확정 안내드리겠습니다. ' +
        `(예약내역 확인/이체정보/예약취소: ${process.env.SITE_URL}/reservation-details/${newReservation._id})`
    })
  }

  // send another notification SMS to the admin contact
  sendSMS({
    toAdmin: true,
    message: `새로운 예약이 접수되었습니다. [${getReservationTime()}, ${getCounselTypeNameById(optionId)}] (링크: ${process.env.SITE_URL}/admin/manage-reservation)`
  })
})

// A method for customers to use
const getReservationStatus = asyncHandler(async (req, res, next) => {
  const { from } = req.query
  const counselDateFilter = { '$gte': from ? parseInt(from) : dateObjToNum(new Date()) } // by default, only fetches future data
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
      counselOption: optionId,
      status
    }
  }

  res.status(200).json(statusData || [])
})

// Update an individual reservation details
const updateReservationDetails = asyncHandler(async (req, res, next) => {
  const { id: reservationId } = req.params
  const { updates = {} } = req.body
  const isUpdatingStatus = Object.keys(updates).includes('status')

  const doc = await Reservation.findById(reservationId)

  if (!doc) {
    sendResourceNotFound(res)
  } else {
    const transformedUpdates = {}

    for (const key in updates) {
      const value = updates[key]

      switch (key) {
        case 'counselDate': {
          transformedUpdates[key] = dateToNumeric(value)
          break
        }
        case 'personalDetails': {
          for (const pKey in value) {
            transformedUpdates[`personalDetails.${pKey}`] = value[pKey]
          }
          break
        }
        default: {
          transformedUpdates[key] = value
        }
      }
    }

    try {
      const result = await doc.updateOne({ $set: transformedUpdates })

      res.status(200).json({
        message: 'Successfully updated the reservation details',
        data: result
      })

      // send SMS to the user about the reservation status update.
      if (isUpdatingStatus &&
        Boolean(doc.personalDetails?.mobile?.number)) {
        const { counselDate, timeSlot, optionId, personalDetails: pDetails } = doc
        const reservationTime = `${stringifyDate(counselDate)} ${timeSlot}`
        const typeName = getCounselTypeNameById(optionId)
        const message = updates.status === 'confirmed'
          ? `${pDetails.name}님, [${reservationTime}] 에 신청하신 ${typeName} 건이 '예약확정'되었습니다. 감사합니다.`
          : updates.status === 'cancelled'
            ? `${pDetails.name}님, [${reservationTime}] 에 신청하신 ${typeName} 건이 관리자에 의해 취소되었습니다.`
            : ''

        message && sendSMS({
          to: `${pDetails.mobile.prefix}${pDetails.mobile.number}`,
          message
        })
      }
    } catch (err) {
      console.error('error caught in updateReservationDetails (reservationControllers.js): ', err)
      sendBadRequestErr(res, 'Failed to update the reservation details')
    }
  }
})

// Delete a reservation (for the customer to use)
const deleteReservation = asyncHandler(async (req, res, next) => {
  const { id: reservationId } = req.params
  const deletedReservation = await Reservation.findByIdAndDelete(reservationId)

  if (!deletedReservation) {
    sendResourceNotFound(res)
  } else {
    res.status(200).json({
      message: 'Successfully deleted the reservation item',
      deletedId: reservationId
    })

    // send another notification SMS to the admin contact
    sendSMS({
      toAdmin: true,
      message: `고객이 예약을 취소하였습니다 - [${numericDateToString(deletedReservation.counselDate)} ${deletedReservation.timeSlot}]`
    })
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
  updateReservationDetails,
  deleteReservation,
  archiveOldReservation
}
