
const { Reservation } = require('../models/reservationModel.js')
const {
  addEvent,
  clearAllEvents,
  addMultipleEvents
} = require('../external-services/google-calendar.js')
const { sendSMSToMultipleCustomers } = require('../external-services/sms.js')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateObjToNum
} = require('../utils/helpers.js')

// ---------------------- Google Calendar API related jobs ---------------------- //

const clearCalendar = asyncHandler(async (req, res) => {
  try {
    const result =  await clearAllEvents()
    res.status(200).json({
      message: 'Successfully cleared the calendar',
      data: result
    })
  } catch (err) {
    console.error('::: clearCalendar() caught: ', err)
    res.status(500).json({
      message: 'Failed to clear the calendar',
      err
    })
  }
})

const regenateAllEvents = asyncHandler(async (req, res) => {
  try {
    const dbQuery = Reservation.find({ counselDate: { '$gte': dateObjToNum(new Date()) } })
    const data = await dbQuery.exec()

    if (Array.isArray(data) && data.length) {
      const result = await addMultipleEvents(data)
      res.status(200).json({
        message: 'Successfully added all reservation items to the calendar',
        data: result
      })
    } else {
      console.error('::: regenateAllEvents() caught: ', err)
      res.status(200).json({
        message: 'No data to update'
      })
    }
  } catch (err) {
    res.status(500).json({
      message: 'Failed to refresh the calendar',
      err
    })
  }
})

// ------------------------------------------------------------------------------ //


// ------------------------------- SMS related jobs ----------------------------- //

const sendWebMessage = asyncHandler(async (req, res) => {
  res.send('Working !!!')
})

// ------------------------------------------------------------------------------ //

module.exports = {
  clearCalendar,
  regenateAllEvents,
  sendWebMessage
}
