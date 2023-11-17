import apiSlice from './apiSlice.js'
import { RESERVATION_PATH } from '@view-data/constants.js'
import { handleClientErrors } from './utils.js'
import { dateObjToNumeric, numericDateToString, dateToNumeric } from '@utils'

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getDetailedReservationStatus: builder.mutation({
        query: () => ({
          method: 'GET',
          url: `${RESERVATION_PATH}/detailed-status`
        }),
        onQueryStarted: handleClientErrors
      }),
      getDayoffs: builder.query({
        query: () => ({
          url: '/config/dayoffs',
          method: 'GET'
        }),
        transformResponse: response => {
          return flattenDayoffsData(response)
        },
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Dayoffs']
      }),
      getFutureDayoffs: builder.mutation({
        query: () => ({
          url: '/config/dayoffs?future=true',
          method: 'GET'
        }),
        transformResponse: response => {
          return flattenDayoffsData(response)
        }
      }),
      updateDayoffs: builder.mutation({
        query: (data) => {
          return ({
            method: 'PUT',
            url: 'manage/dayoffs',
            body: { updates: createRequestPayload(data) }
          })
        },
        invalidatesTags: ['Dayoffs']
      }),
      getAdminReservations: builder.mutation({
        query: ({ from = '', to = '' } = {}) => {
          const obj = {}

          if (from) { obj.from = from }
          if (to) { obj.to = to }
          const qp = new URLSearchParams(obj).toString()

          return ({
            method: 'GET',
            url: `${RESERVATION_PATH}` + (qp ? `?${qp}` : '')
          })
        },
        transformResponse: response => {
          return sortReservationsByTime(response)
        },
        onQueryStarted: handleClientErrors
      })
    }
  }
})

// helpers
export function flattenDayoffsData (data) {
  let allData = []

  for (const year in data) {
    const list = data[year]

    allData = [
      ...allData,
      ...(list.sort((a, b) => a - b))
    ]
  }
  return allData.map(val => numericDateToString(val))
}

export function sortReservationsByTime (data) {
  if (Array.isArray(data)) {
    data = data.slice().sort(
      (a, b) => {
        if (a.counselDate === b.counselDate) { return parseInt(a.timeSlot) - parseInt(b.timeSlot) }
        else { return b.counselDate - a.counselDate }
      }
    )

    return data
  } else { return data }
}

export function createRequestPayload (data) {
  const payload = {}

  for (const dateStr of data) {
    const yearStr = dateStr.slice(0, 4)

    if (!payload[yearStr]) {
      payload[yearStr] = []
    }

    payload[yearStr].push(dateToNumeric(dateStr))
  }

  for (const key in payload) {
    const list = payload[key]
    list.sort((a, b) => a - b)
  }

  return payload
}

export const {
  useGetDetailedReservationStatusMutation: useGetDetailedReservationStatus,
  useGetDayoffsQuery: useGetDayoffs,
  useGetFutureDayoffsMutation: useGetFutureDayoffs,
  useUpdateDayoffsMutation: useUpdateDayoffs,
  useGetAdminReservationsMutation: useGetAdminReservations
} = adminApiSlice
