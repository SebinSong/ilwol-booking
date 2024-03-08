// models
const { Reservation, getArchivedReservation } = require('../models/reservationModel')
const Dayoff = require('../models/dayoffModel.js')
const { sendSMS } = require('../external-services/sms.js')
const {
  addEvent,
  getEventByReservationId,
  updateOrAddEventDetails,
  findEventByReservationIdAndDelete
} = require('../external-services/google-calendar.js')
const { saveContactsFromReservations } = require('./customerContactControllers.js')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateToNumeric,
  dateObjToNum,
  numericDateToString,
  sendBadRequestErr,
  checkRequiredFieldsAndThrow,
  sendResourceNotFound,
  getCounselTypeNameById,
  mergeObjects,
  extractNameWithNum,
  cloneDeep
} = require('../utils/helpers')
const { CLIENT_ERROR_TYPES, DEFAULT_TIME_SLOTS, RESERVATION_STATUS_VALUE } = require('../utils/constants') 

// helper
const archiveOldReservation = asyncHandler(async (req, res, next) => {
  const dateNumToday = dateObjToNum(new Date())
  const counselDateFilter = { '$lt': dateNumToday }

  try {
    const docsToArchive = (await Reservation.find({ counselDate: counselDateFilter }))

    if (docsToArchive?.length) {
      const docsSet = {}
      
      for (const entry of docsToArchive) {
        const newEntry = {
          counselDate: entry.counselDate,
          timeSlot: entry.timeSlot,
          personalDetails: entry.personalDetails,
          optionId: entry.optionId,
          status: entry.status,
          totalPrice: entry.totalPrice || 0,
          originalReservationId: entry._id || ''
        }
        const yearStr = new String(entry.counselDate).slice(0, 4)

        if (!docsSet[yearStr]) { docsSet[yearStr] = [] }
        docsSet[yearStr].push(newEntry)
      }

      await Promise.all(
        Object.keys(docsSet).map(async year => {
          const dbCollection = getArchivedReservation(year)
          const yearlyData = docsSet[year]

          return dbCollection.create(yearlyData)
        })
      )
      await Reservation.deleteMany({ counselDate: counselDateFilter })

      await saveContactsFromReservations(docsToArchive)
    }

    res.status(200).json({
      message: 'Successfully archived the old reservations',
      data: docsToArchive.length ? docsToArchive : []
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
  const { admin } = req.query
  const {
    optionId,
    counselDate,
    timeSlot,
    personalDetails: pDetails,
    totalPrice
  } = req.body
  const isAdminGenerated = Boolean(admin)

  // check required fields
  checkRequiredFieldsAndThrow(
    req,
    res,
    isAdminGenerated
      ? ['optionId', 'counselDate', 'timeSlot', 'personalDetails']
      : ['optionId', 'counselDate', 'timeSlot', 'personalDetails', 'totalPrice']
  )

  const counselDateNumeric = typeof counselDate === 'string' ? dateToNumeric(counselDate) : counselDate
  const todayNumeric = dateObjToNum(new Date())
  const hasMobileNumber = Boolean(pDetails?.mobile?.number)
  const checkEntriesForExisting = [
    { counselDate: counselDateNumeric, timeSlot,  status: { '$ne': 'cancelled' }, },
    hasMobileNumber
      ? {
          'personalDetails.mobile.prefix': pDetails.mobile.prefix,
          'personalDetails.mobile.number': pDetails.mobile.number,
          status: { '$ne': 'cancelled' },
          counselDate: { '$gte': todayNumeric }
        }
      : optionId === 'overseas-counsel'
        ? {
            'personalDetails.kakaoId': pDetails.kakaoId,
            status: { '$ne': 'cancelled' },
            counselDate: { '$gte': todayNumeric }
          }
        : null
  ].filter(Boolean)

  const existingReservation = checkEntriesForExisting.length > 1
    ? await Reservation.findOne({ $or: checkEntriesForExisting })
    : await Reservation.findOne(checkEntriesForExisting[0])
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

  const newReservation = isAdminGenerated
    ? await Reservation.create({
        optionId,
        counselDate: counselDateNumeric,
        timeSlot,
        personalDetails: pDetails,
        status: 'pending'
      })
    : await Reservation.create({
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
    try {
      await sendSMS({
        to: `${pDetails.mobile.prefix}${pDetails.mobile.number}`,
        title: '예약 안내',
        message: `${pDetails.name}님, ${getReservationTime()}${isAdminGenerated ? '' :  ' ' + getCounselTypeNameById(optionId)} 예약 신청 완료. ` + 
          '상담료이체 계좌 <SC제일은행 김은숙 635-20-144462>, 이체 확인 후 예약확정 문자발송. ' +
          `@예약확인@변경@취소 -> ${process.env.SITE_URL}/reservation-details/${newReservation._id}`
      })

      // send another notification SMS to the admin contact
      if (!isAdminGenerated) {
        await sendSMS({
          toAdmin: true,
          message: `새 예약접수 - ${pDetails.name}, ${getReservationTime()}, ${getCounselTypeNameById(optionId)}`
        })
      }
    } catch (err) {
      console.error('[Error] sms notification in postReservation()has failed! : ', err)
    }
  }

  // Add an event item to the Google calendar
  addEvent({
    date: counselDate,
    timeSlot,
    title: extractNameWithNum(pDetails),
    method: pDetails?.method || '',
    optionId,
    reservationId: newReservation._id
  }).catch(err => {
      console.log('@@ Failed to add an event item to the Google Calendar: ', err)
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
  const { notifyScheduleUpdate } = req.query
  const { id: reservationId } = req.params
  const { updates = {} } = req.body
  const isUpdatingStatus = Object.keys(updates).includes('status')
  const isCancellingReservation = isUpdatingStatus && updates.status === 'cancelled'

  const doc = await Reservation.findById(reservationId)

  if (!doc) {
    sendResourceNotFound(res)
  } else {
    const hasMobileNumber = Boolean(updates?.personalDetails?.mobile?.number)

    // if the update payload contains mobile field, check if there is an existing reservation with that contact details.
    if (hasMobileNumber) {
      const todayNumeric = dateObjToNum(new Date())
      const mobile = updates.personalDetails.mobile
      const existingEntry = await Reservation.findOne({
        'personalDetails.mobile.prefix': mobile.prefix,
        'personalDetails.mobile.number': mobile.number,
        status: { '$ne': 'cancelled' },
        counselDate: { '$gte': todayNumeric }
      })

      if (existingEntry) {
        sendBadRequestErr(
          res,
          'Requested reservation entry already exists in the DB.',
          { errType: CLIENT_ERROR_TYPES.EXISTING_RESERVATION, invalidType: 'mobile' }
        )
      }
    }

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

      const mobileAfterUpdate = updates?.personalDetails?.mobile || doc?.personalDetails?.mobile || {}
      const hasMobileAfterUpdate = Boolean(mobileAfterUpdate.number)

      // send SMS to the user about the reservation status update.
      if (hasMobileAfterUpdate) {
        if (isUpdatingStatus) {
          const { counselDate, timeSlot, optionId, personalDetails: pDetails } = doc
          const reservationTime = `${numericDateToString(counselDate)} ${timeSlot}`
          const typeName = getCounselTypeNameById(optionId)
          const isMethodVisit = pDetails?.method === 'visit'

          const message = updates.status === 'confirmed'
            ? `${pDetails.name}님, ${reservationTime} 상담료 입금이 확인되어 예약확정되셨습니다. 감사합니다.` +
              (isMethodVisit ? `(오시는 길: 경기 성남시 분당구 성남대로2번길 6 LG트윈하우스 516호 https://naver.me/xZDqba8p)` : '')
            : isCancellingReservation
              ? `${pDetails.name}님, ${reservationTime}에 신청하신 ${typeName} 건이 관리자에 의해 취소되었습니다.`
              : ''

          if (message) {
            await sendSMS({
              title: '예약 안내',
              to: `${mobileAfterUpdate.prefix}${mobileAfterUpdate.number}`,
              message: `${message}`
            })
          }
        } else if (Boolean(notifyScheduleUpdate)) {
          const pDetails = doc.personalDetails
          const counselDate = updates.counselDate || numericDateToString(doc.counselDate)
          const timeSlot = updates.timeSlot || doc.timeSlot
        
          await sendSMS({
            title: '예약 안내',
            to: `${mobileAfterUpdate.prefix}${mobileAfterUpdate.number}`,
            message: `${pDetails.name}님, 관리자에 의해 상담일정이 ${counselDate} ${timeSlot} 로 변경되었습니다.`
          })
        }
      }

      // update Google calendar according to the new data
      const mergedDoc = mergeObjects(cloneDeep(doc), updates)
      if (isCancellingReservation) {
        findEventByReservationIdAndDelete(reservationId)
          .catch(err => {
            res.status(500).json({
              message: 'failed to delete a cancelled reservation item from the calendar',
              err
            })
          })
      } else {
        updateOrAddEventDetails(reservationId, mergedDoc)
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
  const { admin } = req.query
  const deletedReservation = await Reservation.findByIdAndDelete(reservationId)

  if (!deletedReservation) {
    sendResourceNotFound(res)
  } else {
    res.status(200).json({
      message: 'Successfully deleted the reservation item',
      deletedId: reservationId
    })

    // send another notification SMS to the admin contact
    if (!Boolean(admin)) {
      sendSMS({
        toAdmin: true,
        message: `고객 예약취소 - ${deletedReservation?.personalDetails?.name || ''} ${numericDateToString(deletedReservation.counselDate)} ${deletedReservation.timeSlot}`
      })
    }

    // delete the corresponding event item from the google calendar
    findEventByReservationIdAndDelete(reservationId).catch(err => {
      console.log('Failed to find and delete an event item in deleteReservation - ', err)
    })
  }
})

const updateReservationSchedule = asyncHandler(async (req, res, next) => {
  const { id: reservationId } = req.params
  const { updates = {} } = req.body
  const doc = await Reservation.findById(reservationId)

  if (!doc) {
    sendResourceNotFound(res)
  } else {
    const pDetails = doc.personalDetails
    const mobile = pDetails.mobile
    const isUpdatingCounselDate = Boolean(updates?.counselDate)

    if (isUpdatingCounselDate) {
      updates.counselDate = dateToNumeric(updates.counselDate)
    }

    try {
      const result = await doc.updateOne({ $set: updates })
      res.status(200).json({
        message: 'Successfully updated the reservation schedule',
        data: result
      })

      const prevDate = numericDateToString(doc.counselDate)
      const afterDate = isUpdatingCounselDate ? numericDateToString(updates.counselDate) : prevDate
      const prevTime = doc.timeSlot
      const afterTime = updates?.timeSlot || prevTime

      if (Boolean(mobile?.number)) {
        await sendSMS({
          title: '예약 안내',
          to: `${mobile.prefix}${mobile.number}`,
          message: `${pDetails.name}님, 상담일정이 ${afterDate} ${afterTime}로 변경되었습니다.`
        })
      }
  
      await sendSMS({
        toAdmin: true,
        message: `${pDetails.name} 예약변경:\r\n`
          + `'${prevDate} ${prevTime}' -> '${afterDate} ${afterTime}'`
      })

      const mergedDoc = mergeObjects(doc, updates)
      updateOrAddEventDetails(reservationId, mergedDoc)
    } catch (err) {
      console.error('error caught in updateReservationSchedule (reservationControllers.js): ', err)
      sendBadRequestErr(res, 'Failed to update the reservation schedule')
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
  updateReservationDetails,
  updateReservationSchedule,
  deleteReservation,
  archiveOldReservation
}
