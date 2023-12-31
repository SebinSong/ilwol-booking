const fs = require('fs').promises
const { resolve } = require('path')
const dotenv = require('dotenv')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const { getCounselTypeNameById, numericDateToString, stringToBase64, base64ToString } = require('../utils/helpers')
const { DAYS_MILLIS } = require('../utils/constants')

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

async function getAllFutureEvents () {
  try {
    const auth = await authorize()
    const calendar = google.calendar({
      version: 'v3',
      auth
    })
    const yesterday = new Date()
    yesterday.setTime(yesterday.getTime() - DAYS_MILLIS)
    
    const res = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      singleEvents: true,
      timeMin: yesterday.toISOString(),
      orderBy: 'startTime'
    })

    return res?.data?.items || []
  } catch (err) {
    console.log(`::: Failed to delete an event item - `, err)
  }
}

async function findEventItemByTime ({
  counselDate, timeSlot
}) {
  if (counselDate || timeSlot) {
    counselDate = (typeof counselDate === 'string')
      ? counselDate
      : numericDateToString(counselDate)

    try {
      const list = await getAllFutureEvents()
      const found = list.find(entry => {
        const summary = entry.summary || ''
        const startDate = entry.start?.date || ''
  
        return startDate === counselDate && (summary.includes(timeSlot))
      })
  
      return found || null
    } catch (err) {
      console.log('@@ failed to find an item by time - ', err)
    }
  }

  return null
}

async function addEvent ({
  date, timeSlot, optionId, title, status, isConfirmed = false
}) {
  const eventObj = {
    summary: `${timeSlot} ${title}`,
    description: getCounselTypeNameById(optionId),
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

async function updateEventStatus ({
  eventId, statusTo
}) {
  const colorIdTo = colorIdMap[statusTo] || 5

  if (eventId) {
    try {
      const auth = await authorize()
      const calendar = google.calendar({
        version: 'v3',
        auth
      })
      const res = await calendar.events.patch({
        calendarId: process.env.CALENDAR_ID,
        eventId,
        resource: { colorId: colorIdTo }
      })

      return res
    } catch (err) {
      console.log(`::: Failed to update an event item - `, err)
    }
  }
}

async function regenerateEventItem (reservation) {
  const { timeSlot, optionId, personalDetails, status } = reservation
  const counselDate = (typeof reservation.counselDate === 'string')
    ? reservation.counselDate
    : numericDateToString(reservation.counselDate)

  const existingDoc = await findEventItemByTime({ counselDate, timeSlot })

  if (existingDoc) {
    await deleteEvent(existingDoc.id)
  }

  const res = await addEvent({
    date: counselDate,
    timeSlot, optionId, status,
    title: personalDetails?.name
  })

  return res
}

module.exports = {
  generateTokenAndSave,
  authorize,
  addEvent,
  deleteEvent,
  getAllFutureEvents,
  findEventItemByTime,
  updateEventStatus,
  regenerateEventItem
}
