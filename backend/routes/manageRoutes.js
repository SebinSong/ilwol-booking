const express = require('express')
const { updateDayoffs } = require('../controllers/dayoffControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')

const router = express.Router()

router.use(isAdmin)
router.put('/dayoffs', updateDayoffs)

module.exports = router
