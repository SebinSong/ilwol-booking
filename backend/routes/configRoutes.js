const express = require('express')
const { getDayoffs } = require('../controllers/dayoffControllers')
const { clearCalendar, regenateAllEvents } = require('../controllers/calendarControllers')
const router = express.Router()

router.get('/dayoffs', getDayoffs)

// google calendar related jobs
router.delete('/calendar', clearCalendar)
router.post('/calendar/all', regenateAllEvents)

module.exports = router
