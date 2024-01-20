const express = require('express')
const { getDayoffs } = require('../controllers/dayoffControllers')
const { clearCalendar, regenateAllEvents, sendWebMessage } = require('../controllers/adminConfigControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/dayoffs', getDayoffs)

// google calendar related jobs
router.delete('/calendar', isAdmin, clearCalendar)
router.post('/calendar/all', isAdmin, regenateAllEvents)

// sms related jobs
router.post('/sms', isAdmin, sendWebMessage)

module.exports = router
