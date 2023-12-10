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
      }),
      permitUser: builder.mutation({
        query: userId => ({
          url: `${USERS_PATH}/${userId}`,
          method: 'PATCH',
          body: {
            updates: { isPermitted: true }
          }
        }),
        invalidatesTags: ['Users']
      }),
      deleteUser: builder.mutation({
        query: userId => ({
          url: `${USERS_PATH}/${userId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['Users']
      })
    }
  }
})

export const {
  useGetAllUsersQuery: useGetAllUsers,
  usePermitUserMutation: usePermitUser,
  useDeleteUserMutation: useDeleteUser
} = usersApiSlice
