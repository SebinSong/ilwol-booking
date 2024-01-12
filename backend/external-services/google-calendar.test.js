const {
  addEvent,
  authorize,
  deleteEvent,
  getAllFutureEvents,
  getEventByReservationId,
  clearAllEvents
} = require('./google-calendar.js')
const { google } = require('googleapis')

async function main () {
  try {
    const eventItem = await getEventByReservationId('qwerqw213124134')
    // const res = await addEvent({
    //   date: '2023-12-28',
    //   timeSlot: '16:00',
    //   title: '홍길동 외1명',
    //   optionId: 'family-counsel'
    // })
    console.log('Found event item: ', eventItem)
  } catch (err) {
    console.log('Caught an error : ', err)
  }
}

main()