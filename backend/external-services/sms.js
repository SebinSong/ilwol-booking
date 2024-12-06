const path = require('path')
const dotenv = require('dotenv')
const { SolapiMessageService } = require('solapi')
// importing .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const {
  SOLAPI_API_KEY,
  SOLPAI_API_SECRET,
  SOLAPI_SEND_FROM
} = process.env

const smsController = new SolapiMessageService(
  SOLAPI_API_KEY,
  SOLPAI_API_SECRET
)

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function sendSMS ({
  to = '',
  title = '',
  message = '',
  toAdmin = false,
  delay = 0
}) {
  if ((!toAdmin && !to) || !message) { throw new Error('required params are missing for sendSMS function.') }

  const payload = {
    to: toAdmin ? SOLAPI_SEND_FROM : to,
    text: `[일월선녀 해달별] ${message}`,
    from: SOLAPI_SEND_FROM
  }
  if (title) { payload.subject = `${title}` }
  
  try {
    if (delay > 0) { await wait(delay) }
    const res = await smsController.sendOne(payload)
    return res
  } catch (err) {
    console.error('sendOne caught an error while using SolapiMessageService.sendOne : ', err)
    return null
  }
}

async function sendSMSToMultipleCustomers (message = '', toNumbers = []) {
  if (message && toNumbers?.length) {
    const payloadArr = toNumbers.map(numTo => ({
      subject: '예약 안내',
      text: `[일월선녀 해달별] ${message}`,
      from: SOLAPI_SEND_FROM,
      to: numTo
    }))

    try {
      const res = await smsController.send(payloadArr)
      return res
    } catch (err) {
      console.error('sendSMSToMultipleCustomers caught an error while using SolapiMessageService.send : ', err)
      return null
    }
  }
}

module.exports = {
  sendSMS,
  sendSMSToMultipleCustomers
}
