const fs = require('fs').promises
const { resolve } = require('path')
const dotenv = require('dotenv')
const { authenticate } = require('@google-cloud/local-auth')
const { google } = require('googleapis')
const { getCounselTypeNameById } = require('../utils/helpers')

// importing .env file
dotenv.config({ path: resolve(__dirname, '../.env') })

const scopes = [
  // If modifying these scopes, delete token.json
  'https://www.googleapis.com/auth/calendar'
]
const paths = {
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  token: resolve(__dirname, '../utils/token.json'),
  credentials: resolve(__dirname, '../utils/credentials.json')
}
const colorIdMap = {
  // reference: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
  'confirmed': 2,
  'pending': 5,
  'cancelled': 11
}
let auth = null

// Reads previously authorized credentials from the save file.
async function loadSavedCredentialsIfExist () {
  try {
    const content = await fs.readFile(paths.token)
    const credentials = JSON.parse(content)

    auth = await google.auth.fromJSON(credentials)
    return auth
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

  await fs.writeFile(paths.token, payload)
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

async function addEvent ({
  date, timeSlot, optionId, title, isConfirmed = false
}) {
  const eventObj = {
    summary: `${timeSlot} ${title}`,
    description: getCounselTypeNameById(optionId),
    start: { date },
    end: { date },
    colorId: isConfirmed ? 2: 5 // reference: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
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

async function updateEvent ({
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

module.exports = {
  generateTokenAndSave,
  authorize,
  addEvent,
  deleteEvent,
  updateEvent
}
