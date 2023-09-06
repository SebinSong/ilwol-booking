import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import counselDetailsReducer from './features/counselDetailsSlice'

const store = configureStore({
  reducer: {
    counselDetails: counselDetailsReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
})

export default store
