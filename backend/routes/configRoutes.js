const express = require('express')
const { getDayoffs } = require('../controllers/dayoffControllers')
const router = express.Router()

router.get('/dayoffs', getDayoffs)

module.exports = router
