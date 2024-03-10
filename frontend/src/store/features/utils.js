import { CLIENT_ERROR_TYPES } from '@view-data/constants.js'
import { clearCredentials } from './authDetailsSlice.js'

export async function handleClientErrors (args, { queryFulfilled, dispatch }) {
  try {
    await queryFulfilled 
  } catch ({ error }) {
    if (error?.data?.errType &&
      [CLIENT_ERROR_TYPES.NO_TOKEN, CLIENT_ERROR_TYPES.INVALID_TOKEN].includes(error.data.errType)
    ) {
      dispatch(clearCredentials())
    }
  }
}
