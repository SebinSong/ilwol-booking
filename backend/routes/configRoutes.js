const express = require('express')
const { getDayoffs } = require('../controllers/dayoffControllers')
const { clearCalendar, regenateAllEvents, sendWebMessage } = require('../controllers/adminConfigControllers')
const router = express.Router()

router.get('/dayoffs', getDayoffs)

// google calendar related jobs
router.delete('/calendar', clearCalendar)
router.post('/calendar/all', regenateAllEvents)

// sms related jobs
router.post('/sms', sendWebMessage)

module.exports = router
