const express = require('express')
const {
  getAllUsers,
  updateUser
} = require('../controllers/usersControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllUsers)
router.patch('/:id', isAdmin, updateUser)

module.exports = router