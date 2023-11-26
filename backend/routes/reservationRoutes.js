const express = require('express')
const {
  getAllReservation,
  getReservationById,
  postReservation,
  getReservationStatus,
  getReservationStatusWithDetails,
  updateReservationDetails,
  deleteReservation
} = require('../controllers/reservationControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllReservation)
router.post('/', postReservation)

router.get('/status', getReservationStatus)
router.get('/detailed-status', isAdmin, getReservationStatusWithDetails)

router.get('/:id', getReservationById)
router.patch('/:id', isAdmin, updateReservationDetails)
router.delete('/:id', deleteReservation)

module.exports = router
