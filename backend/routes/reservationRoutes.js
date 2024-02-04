const express = require('express')
const {
  getAllReservation,
  getReservationById,
  postReservation,
  getReservationStatus,
  getReservationStatusWithDetails,
  updateReservationDetails,
  updateReservationSchedule,
  deleteReservation,
  archiveOldReservation
} = require('../controllers/reservationControllers')
const { isAdmin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.get('/', isAdmin, getAllReservation)
router.post('/', postReservation)

router.post('/archive', isAdmin, archiveOldReservation)

router.get('/status', getReservationStatus)
router.get('/detailed-status', isAdmin, getReservationStatusWithDetails)

router.get('/:id', getReservationById)
router.patch('/:id', isAdmin, updateReservationDetails)
router.patch('/schedule/:id', updateReservationSchedule)
router.delete('/:id', deleteReservation)

module.exports = router
