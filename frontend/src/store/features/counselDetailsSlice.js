import { createSlice } from '@reduxjs/toolkit'
import bookingOptions from '@view-data/booking-options.js'
import {
  checkAndParseFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
  cloneDeep
} from '@utils'

// helper
export const BOOKING_DETAILS_LOCAL_STORAGE_KEY = 'ilwol-booking.counsel-details'
const isDEV = import.meta.env.DEV

const defaultState = {
  option: null,
  date: null,
  timeSlot: null,
  personalDetails: null
}
const saveStoreToLocalStorage = state => {
  if (isDEV) {
    saveToLocalStorage(
      BOOKING_DETAILS_LOCAL_STORAGE_KEY,
      cloneDeep(state)
    )
  }
}

const counselDetailsSlice = createSlice({
  name: 'counselDetails',
  initialState: isDEV
    ?  checkAndParseFromLocalStorage(
        BOOKING_DETAILS_LOCAL_STORAGE_KEY,
        defaultState
      )
    : defaultState
  ,
  reducers: {
    addCounselOption (state, action) {
      const optionId = action.payload.id
      state.option = bookingOptions.find(entry => entry.id === optionId)

      saveStoreToLocalStorage(state)
    },
    addCounselDate (state, action) {
      state.date = action.payload.date

      saveStoreToLocalStorage(state)
    },
    addCounselTimeSlot (state, action) {
      state.timeSlot = action.payload

      saveStoreToLocalStorage(state)
    },
    addPersonalDetails (state, action) {
      state.personalDetails = action.payload

      saveStoreToLocalStorage(state)
    },
    clearCounselDetails (state) {
      state = defaultState
      removeFromLocalStorage(BOOKING_DETAILS_LOCAL_STORAGE_KEY)
    }
  }
})

// action creators
export const {
  addCounselOption,
  addCounselDate,
  addCounselTimeSlot,
  addPersonalDetails,
  clearCounselDetails
} = counselDetailsSlice.actions

// selectors
export const selectCounselOption = state => state.counselDetails.option 
export const selectCounselDate = state => state.counselDetails.date 
export const selectCounselTimeSlot = state => state.counselDetails.timeSlot
export const selectCounselPersonalDetails = state => state.counselDetails.personalDetails

// reducer
export default counselDetailsSlice.reducer