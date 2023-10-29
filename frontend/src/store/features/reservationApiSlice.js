import apiSlice from './apiSlice.js'
import { RESERVATION_PATH } from '@view-data/constants.js'
import { dateToNum } from '@utils'

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
      getReservationDetails: builder.query({
        query: reservationId => ({
          url: `${RESERVATION_PATH}/${reservationId}`,
          method: 'GET'
        }),
        keepUnusedDataFor: 60 // seconds
      }),
      postReservation: builder.mutation({
        query: data => ({
          url: RESERVATION_PATH,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['Reservations']
      }),
      getReservationStatus: builder.query({
        query: () => ({
          method: 'GET',
          url: `${RESERVATION_PATH}/status`
        }),
        providesTags: ['ReservationStatus']
      })
    }
  }
})

export const {
  useGetReservationsQuery: useGetReservations,
  usePostReservationMutation: usePostReservation,
  useGetReservationDetailsQuery: useGetReservationDetails,
  useGetReservationStatusQuery: useGetReservationStatus
} = reservationApiSlice
