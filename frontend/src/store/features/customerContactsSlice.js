import { createSlice } from '@reduxjs/toolkit'

// helpers
const defaultState = () => ({
  selectedContacts: [] // A collection of selected contact ids
})

const customerContactsSlice = createSlice({
  name: 'customerContacts',
  initialState: defaultState(),
  reducers: {
    storeSelectedContacts (state, action) {
      state.selectedContacts = action.payload
    },
    clearSelectedContacts (state) {
      state.selectedContacts = []
    }
  }
})

// action creators
export const {
  storeSelectedContacts,
  clearSelectedContacts
} = customerContactsSlice.actions

// selectors
export const selectStoredSelectedContacts = state => state.customerContacts.selectedContacts || []

// reducer
export default customerContactsSlice.reducer
