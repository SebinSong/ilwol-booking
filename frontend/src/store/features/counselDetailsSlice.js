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
    addOption (state, action) {
      const optionId = action.payload.id
      state.option = bookingOptions.find(entry => entry.id === optionId)
    }
  }
})

// action creators
export const {
  addOption
} = counselDetailsSlice.actions

// selectors
export const selectCounselOption = state => state.counselDetails.option 

// reducer
export default counselDetailsSlice.reducer