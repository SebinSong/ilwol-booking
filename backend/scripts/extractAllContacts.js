const { writeFile } = require('node:fs/promises')
const { connectDB } = require('../db.js')
const { saveContactFromReservation } = require('../controllers/customerContactControllers.js')
const CustomerContact = require('../models/customerContactModel.js')
const { Reservation } = require('../models/reservationModel.js')
const { dateObjToNum } = require('../utils/helpers')

async function run () {
  try {
    const allFutureReservations = await Reservation.find({ counselDate: { '$gte': dateObjToNum(new Date()) } }) 
    const totalLen = allFutureReservations.length

    for (let i=0; i<totalLen; i++) {
      const reservation = allFutureReservations[i]
      await saveContactFromReservation(reservation)
      console.log(`[${i+1}/${totalLen}]: ${reservation.personalDetails?.name} done!`)
    }
  } catch (err) {
    console.log('!@# caught an error: ', err)
  }
}

connectDB(async (err) => {
  if (err) {
    console.error('Something went wrong while connecting to the DB!')
    process.exit(1)
  }

  console.log('::: DB connection successful!\r\n\r\n')
  await run()
  process.exit(0)
}, true)
