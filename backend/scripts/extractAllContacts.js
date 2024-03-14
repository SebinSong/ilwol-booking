const { writeFile } = require('node:fs/promises')
const { connectDB } = require('../db.js')
const CustomerContact = require('../models/customerContactModel.js')
const { Reservation } = require('../models/reservationModel.js')
const { toolresults_v1beta3 } = require('googleapis')


async function extractAll () {
  const allSavedContacts = await CustomerContact.find({})
  const allActiveReservations = await Reservation.find({})

  const extracted = []

  for (const entry of allSavedContacts) {
    if (entry.contactType === 'mobile') {
      extracted.push({
        name: entry.name,
        contact: entry.contact.replace(/\s+/g, '')
      })
    }
  }

  for (const reservationEntry of allActiveReservations) {
    const pDetails = reservationEntry.personalDetails || {}

    if (reservationEntry.status !== 'cancelled' && pDetails?.mobile?.number) {
      extracted.push({
        name: pDetails.name,
        contact: pDetails.mobile.prefix + pDetails.mobile.number
      })
    }
  }

  extracted.sort(
    (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  )

  let fileContent = `이름,연락처\r\n`
  extracted.forEach(entry => {
    fileContent += `${entry.name},${entry.contact}\r\n`
  })

  await writeFile('연락처.csv', fileContent, { encoding: 'utf8' })
}

connectDB(async (err) => {
  if (err) {
    console.error('Something went wrong while connecting to the DB!')
    process.exit(1)
  }

  await extractAll()
  process.exit(0)
})
