import { createSlice } from '@reduxjs/toolkit'
import bookingOptions from '@view-data/booking-options.js'

const counselDetailsSlice = createSlice({
  name: 'counselDetails',
  initialState: {
    option: null,
    date: null,
    timeSlot: null,
    personalDetails: null
  },
  reducers: {
    addCounselOption (state, action) {
      const optionId = action.payload.id
      state.option = bookingOptions.find(entry => entry.id === optionId)
    },
    addCounselDate (state, action) {
      state.date = new Date(action.payload.date).getTime()
    },
    addCounselTimeSlot (state, action) {
      state.timeSlot = action.payload
    },
    addPersonalDetails (state, action) {
      state.personalDetails = action.payload
    }
  }
})

// action creators
export const {
  addCounselOption,
  addCounselDate,
  addCounselTimeSlot,
  addPersonalDetails
} = counselDetailsSlice.actions

// selectors
export const selectCounselOption = state => state.counselDetails.option 
export const selectCounselDate = state => state.counselDetails.date 
export const selectCounselTimeSlot = state => state.counselDetails.timeSlot
export const selectCounselPersonalDetails = state => state.counselDetails.personalDetails

// reducer
export default counselDetailsSlice.reducer