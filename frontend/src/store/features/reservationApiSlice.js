import apiSlice from './apiSlice.js'
import { handleClientErrors } from './utils.js'
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
        onQueryStarted: handleClientErrors,
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Reservations']
      }),
      getReservationDetails: builder.query({
        query: reservationId => ({
          url: `${RESERVATION_PATH}/${reservationId}`,
          method: 'GET'
        }),
        keepUnusedDataFor: 10 // seconds
      }),
      postReservation: builder.mutation({
        query: data => ({
          url: RESERVATION_PATH,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['Reservations']
      }),
      getReservationStatus: builder.mutation({
        query: () => ({
          method: 'GET',
          url: `${RESERVATION_PATH}/status`
        })
      }),
      updateReservationDetailsByCustomer: builder.mutation({
        query: ({ id, updates, type = 'details' }) => {
          return ({
            method: 'PATCH',
            url: `${RESERVATION_PATH}/customer/${id}?type=${type}`,
            body: { updates }
          })
        },
        invalidatesTags: ['Contacts']
      }),
      deleteReservation: builder.mutation({
        query: reservationId => ({
          url: `${RESERVATION_PATH}/${reservationId}`,
          method: 'DELETE' 
        }),
        invalidatesTags: ['Reservations']
      })
    }
  }
})

export const {
  useGetReservationsQuery: useGetReservations,
  usePostReservationMutation: usePostReservation,
  useGetReservationDetailsQuery: useGetReservationDetails,
  useGetReservationStatusMutation: useGetReservationStatus,
  useDeleteReservationMutation: useDeleteReservation,
  useUpdateReservationDetailsByCustomerMutation: useUpdateReservationDetailsByCustomer
} = reservationApiSlice
