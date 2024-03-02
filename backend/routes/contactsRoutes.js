const express = require('express')
const {
  getAllContacts
} = require('../controllers/customerContactControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllContacts)

module.exports = router