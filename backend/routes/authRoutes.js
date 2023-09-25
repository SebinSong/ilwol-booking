const express = require('express')
const {
  signup_post,
  login_post,
  logout_get
} = require('../controllers/authControllers.js')

const router = express.Router()

router.post('/signup', signup_post)
router.post('/signup/:type', signup_post)
router.post('/login', login_post)
router.get('/logout', logout_get)

module.exports = router
