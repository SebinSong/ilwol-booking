import apiSlice from "./apiSlice"
import { handleClientErrors } from './utils.js'
import { USERS_PATH } from '@view-data/constants.js'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getAllUsers: builder.query({
        query: () => ({
          url: USERS_PATH,
          method: 'GET'
        }),
        onQueryStarted: handleClientErrors,
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Users']
      })
    }
  }
})

export const {
  useGetAllUsersQuery: useGetAllUsers
} = usersApiSlice
