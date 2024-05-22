const {
  findEventByReservationIdAndDelete
} = require('../external-services/google-calendar.js')
const { parseNodeArgFlags } = require('../utils/helpers.js')

async function run () {
  const result = await findEventByReservationIdAndDelete('664727ac1bf025080c52a82d')
  console.log('delete result: ', result)
}

run()