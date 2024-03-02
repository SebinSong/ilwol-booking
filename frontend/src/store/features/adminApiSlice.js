import apiSlice from './apiSlice.js'
import { RESERVATION_PATH, CONTACTS_PATH } from '@view-data/constants.js'
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
        query: ({
          data, comparison = null
        }) => {
          return ({
            method: 'PUT',
            url: 'manage/dayoffs',
            body: { updates: createRequestPayload(data, comparison) }
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
      }),

      updateReservationDetails: builder.mutation({
        query: ({ id, updates, notifyScheduleUpdate = false }) => {
          return ({
            method: 'PATCH',
            url: `${RESERVATION_PATH}/${id}`
              + (notifyScheduleUpdate ? '?notifyScheduleUpdate=true' : ''),
            body: { updates }
          })
        },
        invalidatesTags: [
          'Reservations',
          'ReservationStatus',
          'ReservationDetailedStatus'
        ]
      }),

      archiveOldReservations: builder.mutation({
        query: () => ({
          method: 'POST',
          url: `${RESERVATION_PATH}/archive`
        })
      }),

      createAdminReservation: builder.mutation({
        query: data => ({
          url: `${RESERVATION_PATH}?admin=true`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['Reservations']
      }),

      adminDeleteReservation: builder.mutation({
        query: reservationId => ({
          url: `${RESERVATION_PATH}/${reservationId}?admin=true`,
          method: 'DELETE' 
        }),
        invalidatesTags: ['Reservations']
      }),

      clearCalendar: builder.mutation({
        query: () => ({
          url: '/config/calendar',
          method: 'DELETE'
        })
      }),

      regenerateCalendar: builder.mutation({
        query: () => ({
          url: '/config/calendar/all',
          method: 'POST'
        })
      }),

      sendWebMessage: builder.mutation({
        query: (data) => ({
          url: '/config/sms',
          method: 'POST',
          body: data
        })
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

      getAllContacts: builder.query({
        query: () => ({
          url: `${CONTACTS_PATH}`,
          method: 'GET'
        }),
        transformResponse: response => {
          const updatedResponse = response.map(entry => {
            return {
              ...entry,
              searchable: `${entry.name}___${entry.contact}`
            }
          })
          return updatedResponse
        },
        providesTags: ['Contacts'],
        keepUnusedDataFor: 60 // seconds
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
        else { return a.counselDate - b.counselDate }
      }
    )

    return data
  } else { return data }
}

export function createRequestPayload (data, comparison = []) {
  const payload = {}

  // generate yearStr object from the comparison model
  comparison.forEach(dateStr => {
    const yyyy = dateStr.slice(0, 4)

    if (!payload[yyyy]) {
      payload[yyyy] = []
    }
  })

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
  useGetAdminReservationsMutation: useGetAdminReservations,
  useUpdateReservationDetailsMutation: useUpdateReservationDetails,
  useArchiveOldReservationsMutation: useArchiveOldReservations,
  useCreateAdminReservationMutation: useCreateAdminReservation,
  useAdminDeleteReservationMutation: useAdminDeleteReservation,
  useClearCalendarMutation: useClearCalendar,
  useRegenerateCalendarMutation: useRegenerateCalendar,
  useSendWebMessageMutation: useSendWebMessage,
  useGetAllContactsQuery: useGetAllContacts
} = adminApiSlice
