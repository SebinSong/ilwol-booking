const CustomerContact = require('../models/customerContactModel')
const asyncHandler = require('../middlewares/asyncHandler.js')

const getAllContacts = asyncHandler(async (req, res, next) => {
  const data = (await CustomerContact.find({})) || []

  res.status(200).json(data)
})

const saveContactsFromReservations = async (reservations) => {
  for (const reservation of reservations) {
    const { counselDate, timeSlot, originalReservationId, _id, personalDetails: pd, status } = reservation
    const reservationId = originalReservationId || _id
    const contactType = Boolean(pd?.mobile?.number)
      ? 'mobile'
      : Boolean(pd?.kakaoId)
        ? 'kakaoId'
        : null

    if (!contactType || status === 'cancelled') { continue }

    const contactValue = contactType === 'mobile'
      ? `${pd.mobile.prefix} ${pd.mobile.number}`
      : pd.kakaoId

    const foundDoc = await CustomerContact.findOne({ name: pd.name, contactType, contact: contactValue })

    if (foundDoc) {
      const targetArr = foundDoc[status]

      if (!targetArr.includes(entry => entry.reservationId === reservationId)) { // make sure there is no duplicated data created.
        await foundDoc.updateOne({ $set: {
          [status]: [
            { counselDate, timeSlot, reservationId, method: pd?.method || '' },
            ...foundDoc[status]
          ]
        }})
      }
    } else {
      await CustomerContact.create({
        name: pd.name,
        contact: contactValue,
        contactType,
        [status]: [{ counselDate, timeSlot, reservationId, method: pd?.method || '' }]
      })
    }
  }
}

module.exports = {
  getAllContacts,
  saveContactsFromReservations
}
