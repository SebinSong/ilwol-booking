import apiSlice from './apiSlice.js'

export const inquiryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => {
    return {
      getInquiries: builder.query({
        query: ({ page = null, limit = null } = {}) => ({
          url: limit !== null && page !== null
            ? `/inquiry?limit=${limit}&page=${page}`
            : '/inquiry',
          method: 'GET'
        }),
        keepUnusedDataFor: 60, // seconds
        providesTags: ['Inquiries']
      }),
      postInquiry: builder.mutation({
        query: data => ({
          url: '/inquiry',
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
  usePostInquiryMutation: usePostInquiry
} = inquiryApiSlice