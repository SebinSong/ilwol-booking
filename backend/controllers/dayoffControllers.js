const Dayoff = require('../models/dayoffModel.js')
const asyncHandler = require('../middlewares/asyncHandler.js')
const { dateObjToNum } = require('../utils/helpers.js')

// Add a new dayoff
const updateDayoffs = asyncHandler(async (req, res, next) => {
  const { updates = {} } = req.body
  /*
    'updates' here looks like,
    {
      '2023': [ 20231124, 20231127, ... ],
      '2024': [ 20240107, 20240109, ... ]
    }
  */

  if (Object.keys(updates).length) {
    const entries = Object.entries(updates)

    const result = await Promise.all(
      entries.map(
        async ([year, values]) => {
          const existingDoc = await Dayoff.findOne({ year })

          if (existingDoc) {
            existingDoc.values = values

            return existingDoc.save()
          } else {
            return Dayoff.create({ year, values })
          }
        }
      )
    )

    res.status(200).json({ message: 'Successfully updated.' })
  } else {
    res.status(304).json({ message: 'Not modified' })
  }
})

const getDayoffs = asyncHandler(async (req, res, next) => {
  const { future } = req.query
  const todayDateNum = dateObjToNum(new Date())
  const allDocs = (await Dayoff.find({})) || []
  const data = {}

  for (const { year, values = [] } of allDocs) {
    data[year] = Boolean(future) 
      ? values.filter(dateNum => dateNum >= todayDateNum)
      : values
  }

  res.status(200).json(data)
})

module.exports = {
  updateDayoffs,
  getDayoffs
}
