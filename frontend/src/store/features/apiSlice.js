// references: lets read and make the best use of them.
// https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics
// https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@view-data/constants.js'

const apiSlice = createApi({
  reducerPath: API_BASE_URL,
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Users', 'Inquiries'],
  endpoints: builder => ({}) 
})

export default apiSlice
