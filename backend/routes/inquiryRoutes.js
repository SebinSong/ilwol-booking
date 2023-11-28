const express = require('express')
const {
  postInquiry,
  getInquiries,
  getInquiryById
} = require('../controllers/inquiryControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/', postInquiry)
router.get('/', isAdmin, getInquiries)
router.get('/:id', isAdmin, getInquiryById)

module.exports = router
