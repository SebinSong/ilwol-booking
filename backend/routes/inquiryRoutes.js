const express = require('express')
const {
  postInquiry,
  getInquiries
} = require('../controllers/inquiryControllers')

const router = express.Router()

router.post('/', postInquiry)
router.get('/', getInquiries)

module.exports = router
