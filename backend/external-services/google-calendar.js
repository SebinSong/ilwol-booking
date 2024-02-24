const fs = require('fs').promises
const { resolve } = require('path')
const dotenv = require('dotenv')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const {
  getCounselTypeNameById,
  numericDateToString,
  stringToBase64,
  base64ToString,
  promiseAllWithLimit,
  extractNameWithNum
} = require('../utils/helpers')
const { DAYS_MILLIS } = require('../utils/constants')
const getMethodShort = id => {
  return ({
    'visit': '(방)',
    'voice-talk': '(보)',
    'phone': '(전)'
  })[id] || ''
}

// importing .env file
dotenv.config({ path: resolve(__dirname, '../.env') })

const scopes = [
  // If modifying these scopes, delete the token file
  'https://www.googleapis.com/auth/calendar'
]
const paths = {
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  token: resolve(__dirname, '../utils/gt.txt'),
  credentials: resolve(__dirname, '../utils/credentials.json')
}
const colorIdMap = {
  // reference: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
  'confirmed': 9, // blueberry
  'pending': 10, // basil
  'cancelled': 11 // tomato
}
let auth = null

// Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist () {
  try {
    let content = await fs.readFile(paths.token)

    if (content) {
      const credentials = JSON.parse(base64ToString(content))

      auth = await google.auth.fromJSON(credentials)
      return auth
    } else { return null }
  } catch (err) {
    return null
  }
}

// Serializes credentials to a file compatible with GoogleAuth.fromJSON
async function saveCredentials (client) {
  const content = await fs.readFile(paths.credentials)
  const keys = JSON.parse(content)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  })

  await fs.writeFile(paths.token, stringToBase64(payload))
}

// Load an authorization to call APIs
async function authorize () {
  let client = auth || (await loadSavedCredentialsIfExist())

  if (client) {
    return client
  }

  client = await generateTokenAndSave()
  return client
}

async function generateTokenAndSave () {
  const client = await authenticate({
    scopes,
    keyfilePath: paths.credentials
  })

  if (client.credentials) {
    await saveCredentials(client)
  }

  return client
}

async function getAllEvents (isFuture = false) {
  try {
    const auth = await authorize()
    const calendar = google.calendar({
      version: 'v3',
      auth
    })
    const agesAgo = new Date(0)
    const yesterday = new Date()
    yesterday.setTime(yesterday.getTime() - DAYS_MILLIS)
    
    const res = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      singleEvents: true,
      timeMin: isFuture ? yesterday.toISOString() : agesAgo.toISOString(),
      orderBy: 'startTime'
    })

    return res?.data?.items || []
  } catch (err) {
    console.log(`::: Failed to delete an event item - `, err)
  }
}

async function getEventByReservationId (reservationId, isFuture = false) {
  try {
    const allFutureEvents = await getAllEvents(isFuture)
    const found = allFutureEvents.find(entry => {
      const desc = (entry.description || '')
      const splitted = desc.split('[ID]:')
      const reservationIdInDesc = desc.length > 1 ? splitted[1] : null

      return reservationIdInDesc
        ? reservationIdInDesc === reservationId
        : false
    })

    return found ? found : null
  } catch (err) {
    console.log('::: An error occurred while searching for an event with a reservation ID - ', err)
    return null
  }
}

async function findEventByReservationIdAndDelete (reservationId, isFuture = false) {
  try {
    const foundEvent = await getEventByReservationId(reservationId, isFuture)

    if (foundEvent?.id) {
      await deleteEvent(foundEvent.id)

      return { message: `successfully deleted the event for ${reservationId}` }
    }
  } catch (err) {
    throw err // just pass it on.
  }
}

async function addEvent ({
  date, timeSlot = '', optionId, title, method = '',
  status, isConfirmed = false, reservationId = ''
}) {
  const timeFirst = timeSlot.split(':')[0]

  const eventObj = {
    summary: `${timeFirst}` + getMethodShort(method) + `${title}`,
    description: `${getCounselTypeNameById(optionId)}` + `\r\n[ID]:${reservationId}`,
    start: { date },
    end: { date },
    colorId: status
      ? colorIdMap[status]
      : isConfirmed ? 9 : 10 // reference: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
  }

  try {
    const auth = await authorize()
    const calendar = google.calendar({
      version: 'v3',
      auth
    })
    const res = await calendar.events.insert({
      resource: eventObj,
      calendarId: process.env.CALENDAR_ID
    })

    return res
  } catch (err) {
    console.log(`::: Failed to create an event item - `, err)
  }
}

async function addMultipleEvents (data) {
  if (!Array.isArray(data) || !data.length) { return }

  try {
    const auth = await authorize()
    const calendar = google.calendar({
      version: 'v3',
      auth
    })

    const pFuncArr = data.map(reservation => {
      const { optionId, timeSlot, counselDate, personalDetails, status, _id } = reservation
      const timeShort = timeSlot.split(':')[0]
      const date = numericDateToString(counselDate)

      return () => calendar.events.insert({
        resource: {
          summary: `${timeShort}` + getMethodShort(personalDetails?.method || '') + `${personalDetails?.name ? extractNameWithNum(personalDetails) : ''}`,
          description: `${getCounselTypeNameById(optionId)}` + `\r\n[ID]:${_id}`,
          start: { date },
          end: { date },
          colorId: colorIdMap[status]
        },
        calendarId: process.env.CALENDAR_ID
      })
    })

    const res = await promiseAllWithLimit(pFuncArr, 20)
    return res
  } catch (err) {
    throw new Error(`::: Failed to create multiple event items - ${JSON.stringify(err)}`)
  }
}

async function deleteEvent (eventId) {
  if (eventId) {
    try {
      const auth = await authorize()
      const calendar = google.calendar({
        version: 'v3',
        auth
      })
      const res = await calendar.events.delete({
        calendarId: process.env.CALENDAR_ID,
        eventId
      })

      return res
    } catch (err) {
      console.log(`::: Failed to delete an event item - `, err)
    }
  }
}

async function findByReservationIdAndDelete (reservationId) {

}

async function clearAllEvents () {
  const auth = await authorize()
  const calendar = google.calendar({
    version: 'v3',
    auth
  })
  const allList = await calendar.events.list({
    calendarId: process.env.CALENDAR_ID,
    singleEvents: true,
    orderBy: 'startTime'
  })
  const eventItems = allList?.data?.items

  if (Array.isArray(eventItems) && eventItems.length) {
    const idList = eventItems.map(entry => entry.id)
    const pFuncArr = idList.map(id => {
      return () => calendar.events.delete({
        calendarId: process.env.CALENDAR_ID,
        eventId: id
      })
    })
    await promiseAllWithLimit(pFuncArr, 20)

    return { deletedCount: idList.length }
  }

  return { deletedCount: 0 }
}

async function updateOrAddEventDetails (reservationId, reservation) {
  const {
    timeSlot = '',
    optionId,
    personalDetails,
    status,
    counselDate
  } = reservation
  const dateStr = typeof counselDate === 'string' ? counselDate : numericDateToString(counselDate)
  const timeShort = timeSlot.split(':')[0]

  try {
    const foundEvent = await getEventByReservationId(reservationId)

    if (!foundEvent) {
      const addResult = await addEvent({
        date: dateStr,
        timeSlot,
        title: extractNameWithNum(personalDetails),
        method: personalDetails?.method || '',
        optionId,
        reservationId
      })

      return addResult
    } else {
      const eventId = foundEvent.id
      const calendar = google.calendar({
        version: 'v3',
        auth
      })
      const updateObj = {
        summary: `${timeShort}` + getMethodShort(personalDetails.method) + `${extractNameWithNum(personalDetails)}`,
        description: `${getCounselTypeNameById(optionId)}` + `\r\n[ID]:${reservationId}`,
        start: { date: dateStr },
        end: { date: dateStr },
        colorId: colorIdMap[status]
      }

      const res = await calendar.events.patch({
        calendarId: process.env.CALENDAR_ID,
        eventId,
        resource: updateObj
      })

      return res
    }
  } catch (err) {
    console.log(`::: Failed to update an event item details - `, err)
  }
}

module.exports = {
  generateTokenAndSave,
  authorize,
  addEvent,
  addMultipleEvents,
  deleteEvent,
  clearAllEvents,
  getAllEvents,
  updateOrAddEventDetails,
  findEventByReservationIdAndDelete,
  getEventByReservationId
}
