const express = require('express')
const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/usersControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.use(isAdmin)
router.get('/', getAllUsers)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router
