import { configureStore } from '@reduxjs/toolkit'
import counselDetailsReducer from './features/counselDetailsSlice'

const store = configureStore({
  reducer: {
    counselDetails: counselDetailsReducer
  }
})

export default store