import apiSlice from './apiSlice.js'
import { handleClientErrors } from './utils.js'
import { INQUIRY_PATH } from '@view-data/constants.js'

export const inquiryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getInquiries: builder.query({
        query: ({ page = null, limit = null } = {}) => ({
          url: limit !== null && page !== null
            ? `${INQUIRY_PATH}?limit=${limit}&page=${page}`
            : INQUIRY_PATH,
          method: 'GET'
        }),
        onQueryStarted: handleClientErrors,
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Inquiries']
      }),
      getInquiryDetails: builder.query({
        query: inquiryId => ({
          url: `${INQUIRY_PATH}/${inquiryId}`,
          method: 'GET'
        }),
        onQueryStarted: handleClientErrors,
        keepUnusedDataFor: 60 // seconds
      }),
      postInquiry: builder.mutation({
        query: data => ({
          url: INQUIRY_PATH,
          method: 'POST',
          body: data
        }),
        invalidatesTags: ['Inquiries']
      })
    }
  }
})

export const {
  useGetInquiriesQuery: useGetInquiries,
  usePostInquiryMutation: usePostInquiry,
  useGetInquiryDetailsQuery: useGetInquiryDetails
} = inquiryApiSlice
