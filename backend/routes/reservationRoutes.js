const express = require('express')
const {
  getAllReservation,
  getReservationById,
  postReservation,
  getReservationStatus,
  getReservationStatusWithDetails
} = require('../controllers/reservationControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllReservation)
router.post('/', postReservation)
router.get('/:id', getReservationById)
router.get('/status', getReservationStatus)
router.get('/detailed-status', isAdmin, getReservationStatusWithDetails)

module.exports = router
