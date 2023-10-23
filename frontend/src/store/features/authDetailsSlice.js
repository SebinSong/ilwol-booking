import { createSlice } from '@reduxjs/toolkit'
import {
  checkAndParseFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
  cloneDeep,
  compareTimes
} from '@utils'

// helpers
const AUTH_LOCAL_STORAGE_KEY = 'ilwol-booking.auth'
const defaultState = {
  userInfo: null
}

const saveDataToLocalStorage = state => {
  saveToLocalStorage(
    AUTH_LOCAL_STORAGE_KEY,
    cloneDeep(state)
  )
}
const fetchDataFromLocalStorage = () => {
  const dataFromStore = checkAndParseFromLocalStorage(AUTH_LOCAL_STORAGE_KEY)

  if (dataFromStore) {
    const tokenExpired = Boolean(dataFromStore.tokenExpires) &&
      compareTimes(new Date(), dataFromStore.tokenExpires) > 0
    
    if (tokenExpired) {
      removeFromLocalStorage(AUTH_LOCAL_STORAGE_KEY)
      return defaultState
    } else {
      return dataFromStore
    }
  }

  return defaultState
}


const authDetailsSlice = createSlice({
  name: 'authDetails', 
  initialState: fetchDataFromLocalStorage(),
  reducers: {
    setCredentials (state, action) {
      state.userInfo = action.payload
      saveDataToLocalStorage(state)
    },
    clearCredentials (state) {
      state.userInfo = null,
      removeFromLocalStorage(AUTH_LOCAL_STORAGE_KEY)
    }
  }
})

// action creators
export const { setCredentials, clearCredentials } = authDetailsSlice.actions

// selectors
export const isAdminAuthenticated = state => Boolean(state.authDetails?.userInfo) &&
  ['admin-owner', 'admin-staff'].includes(state.authDetails.userInfo.userType)
export const selectUserInfo = state => state.authDetails.userInfo || null

// reducer
export default authDetailsSlice.reducer