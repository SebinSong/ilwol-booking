const {
  addEvent,
  authorize,
  deleteEvent,
  updateEventStatus,
  getAllFutureEvents,
  findEventItemByTime,
  regenerateEventItem
} = require('./google-calendar.js')
const { google } = require('googleapis')

async function main () {
  try {
    const res = await addEvent({
      date: '2023-12-28',
      timeSlot: '16:00',
      title: '홍길동 외1명',
      optionId: 'family-counsel'
    })

    const eventId = res.data.id
    const res2 = await updateEventStatus({
      eventId,
      statusTo: 'confirmed'
    })

    console.log('update result: ', res2)
  } catch (err) {
    console.log('Caught en error : ', err)
  }
}

main()