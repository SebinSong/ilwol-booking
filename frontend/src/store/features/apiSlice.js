// references: lets read and make the best use of them.
// https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics
// https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_PATH } from '@view-data/constants.js'

const apiSlice = createApi({
  reducerPath: API_BASE_PATH,
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    timeout: 10000
  }),
  tagTypes: [
    'Users',
    'Inquiries',
    'Reservations',
    'ReservationStatus',
    'ReservationDetailedStatus'
  ],
  endpoints: builder => ({}) 
})

export default apiSlice