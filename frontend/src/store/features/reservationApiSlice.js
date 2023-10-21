import apiSlice from './apiSlice.js'
import { RESERVATION_PATH } from '@view-data/constants.js'

export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getReservations: builder.query({
        query: ({ page = null, limit = null } = {}) => ({
          url: limit !== null && page !== null
            ? `${RESERVATION_PATH}?limit=${limit}&page=${page}`
            : RESERVATION_PATH,
          method: 'GET'
        }),
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Reservations']
      }),
      postReservation: builder.mutation({
        query: data => ({
          url: RESERVATION_PATH,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['Reservations']
      })
    }
  }
})

export const {
  useGetReservationsQuery: useGetReservations,
  usePostReservationMutation: usePostReservation
} = reservationApiSlice
