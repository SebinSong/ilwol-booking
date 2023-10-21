const express = require('express')
const {
  postInquiry,
  getInquiries
} = require('../controllers/inquiryControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', postInquiry)
router.get('/', isAdmin, getInquiries)

module.exports = router
