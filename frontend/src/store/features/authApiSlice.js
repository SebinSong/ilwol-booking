import apiSlice from './apiSlice.js'
import { AUTH_URL, DAYS_MILLIS } from '@view-data/constants.js'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    adminLogin: builder.mutation({
      query: payload => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: payload
      }),
      keepUnusedDataFor: DAYS_MILLIS
    }),
    adminSignup: builder.mutation({
      query: payload => ({
        url: `${AUTH_URL}/signup/admin`,
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Users']
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'GET'
      })
    })
  })
})

// export hooks
export const useAdminLogin = authApiSlice.useAdminLoginMutation
export const useAdminSignup = authApiSlice.useAdminSignupMutation
export const useAdminLogout = authApiSlice.useAdminLogoutMutation
