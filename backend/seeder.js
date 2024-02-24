const { Reservation } = require('./models/reservationModel')
const { connectDB } = require('./db.js')
const {
  randomIntBetweenRange,
  randomFromArray,
  addDaysToDate,
  stringifyDate,
  dateObjToNum
} = require('./utils/helpers.js')
const {
  DEFAULT_TIME_SLOTS,
  COUNSEL_OPTIONS_LIST
} = require('./utils/constants')

const clearAllReservations = async () => {
  const result = await Reservation.deleteMany()
  console.log(`::: Deleted reservations: `, result)
}

const addDummyReservations = async (entryCount = 5) => {
  await clearAllReservations()

  const entries = []
  const today = new Date()

  for (let i = 0; i < entryCount; i++) {
    let dayOftset, timeSlot, whileCount = 0

    while (whileCount++ < 10) {
      dayOffset = randomIntBetweenRange(10, 20)
      timeSlot = randomFromArray(DEFAULT_TIME_SLOTS)

      if (!entries.some(entry => entry[0] === dayOffset && entry[1] === timeSlot)) {
        entries.push([dayOffset, timeSlot])
        break
      }
    }
  }

  entries.sort((a, b) => a[0] - b[0])
  const docs = entries.map(([dOffset, tSlot]) => {
    const option = randomFromArray(COUNSEL_OPTIONS_LIST)

    return {
      optionId: option.id,
      counselDate: dateObjToNum(addDaysToDate(today, dOffset)),
      timeSlot: tSlot,
      totalPrice: option.price,
      personalDetails: {
        name: `테스트유저-${randomIntBetweenRange(1001, 9999)}`,
        gender: randomFromArray(['male', 'femaile']),
        dob: {
            system: 'lunar',
            year: new String(randomIntBetweenRange(1950, 2000)),
            month: new String(randomIntBetweenRange(1, 13)),
            date: new String(randomIntBetweenRange(1, 28)),
        },
        numAttendee: option.type === 'individual' ? 1 : 2,
        mobile: {
            prefix: '010',
            number: `${randomIntBetweenRange(Math.pow(10, 7), Math.pow(10, 8) - 1)}`
        },
        kakaoId: option.id === 'overseas-counsel' ? `테스트KakaoId-${randomIntBetweenRange(1001, 9999)}` : '',
        method: option.id === 'overseas-counsel' ? 'voice-talk' : 'visit',
        email:"test@test.com",
        memo: "테스트 메모. 선녀님 안녕하세요. 테스트 메모입니다. 곧 찾아뵙겠습니다. 하하하하. 성불하세요."
      }
    }
  })

  const res = await Reservation.create(docs)
  console.log(`::: successfully created [${res.length}] test reservation entries!`)
}

connectDB(async (err) => {
  if (err) {
    return console.error('Something gone wrong while connecting to the DB: ', err)
  }

  console.log('::: DB connection successful!')
  await addDummyReservations(10)
  process.exit(0)
})
