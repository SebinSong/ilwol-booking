
const { Reservation } = require('../models/reservationModel.js')
const {
  addEvent,
  clearAllEvents,
  addMultipleEvents
} = require('../external-services/google-calendar.js')
const { sendSMSToMultipleCustomers } = require('../external-services/sms.js')
const asyncHandler = require('../middlewares/asyncHandler.js')
const {
  dateObjToNum,
  sendBadRequestErr
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
  const { to, message = '' } = req.body

  if (message && Array.isArray(to) && to.length) {
    const result = await sendSMSToMultipleCustomers(message, to)
    const failedEntries = (result?.failedMessageList || []).map(
      entry => ({ number: entry.to, errorMsg: entry.statusMessage })
    )

    res.status(200).json({
      failed: failedEntries,
      successCount: to.length - failedEntries.length
    })
    /* 
      *** Data examples ***

      - entry of failedMessageList array :
      {
        to: '010adsfasdf',
        from: '01027881137',
        type: 'SMS',
        statusMessage: "'to' 필드는 숫자만 입력 가능하며, 최대 25자까지 가능합니다.",
        country: '82',
        messageId: 'M4V20240120185524KXQFKBPBMECQSWM',
        statusCode: '1011',
        accountId: '23112012094020'
      }

      - groupInfo.count:
      {
        total: 2,
        sentTotal: 0,
        sentFailed: 0,
        sentSuccess: 0,
        sentPending: 0,
        sentReplacement: 0,
        refund: 0,
        registeredFailed: 1,
        registeredSuccess: 1
      }
    */
  } else {
    sendBadRequestErr(res, "Wrong format of payload")
  }
})

// ------------------------------------------------------------------------------ //

module.exports = {
  clearCalendar,
  regenateAllEvents,
  sendWebMessage
}
