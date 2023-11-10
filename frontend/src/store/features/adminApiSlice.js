import apiSlice from './apiSlice.js'
import { RESERVATION_PATH } from '@view-data/constants.js'
import { handleClientErrors } from './utils.js'

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getDetailedReservationStatus: builder.mutation({
        query: () => ({
          method: 'GET',
          url: `${RESERVATION_PATH}/detailed-status`
        }),
        onQueryStarted: handleClientErrors
      })
    }
  }
})

export const {
  useGetDetailedReservationStatusMutation: useGetDetailedReservationStatus
} = adminApiSlice
