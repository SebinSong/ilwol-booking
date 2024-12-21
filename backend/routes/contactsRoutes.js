const express = require('express')
const {
  getAllContacts,
  deleteContactById
} = require('../controllers/customerContactControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllContacts)
router.delete('/:id', isAdmin, deleteContactById)

module.exports = router
