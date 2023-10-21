const express = require('express')
const {
  getAllReservation,
  getReservationById,
  postReservation
} = require('../controllers/reservationControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllReservation)
router.get('/:id', getReservationById)
router.post('/', postReservation)

module.exports = router
