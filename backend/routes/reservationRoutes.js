const express = require('express')
const {
  getAllReservation,
  getReservationById,
  postReservation,
  getReservationStatus,
  getReservationStatusWithDetails,
  updateReservationDetails,
  updateReservationByCustomer,
  deleteReservation,
  archiveOldReservation,
  getReservationHistory
} = require('../controllers/reservationControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllReservation)
router.post('/', postReservation)

router.get('/archive', isAdmin, getReservationHistory)
router.post('/archive', isAdmin, archiveOldReservation)

router.get('/status', getReservationStatus)
router.get('/detailed-status', isAdmin, getReservationStatusWithDetails)

router.get('/:id', getReservationById)
router.patch('/:id', isAdmin, updateReservationDetails)
router.patch('/customer/:id', updateReservationByCustomer)
router.delete('/:id', deleteReservation)

module.exports = router
