import { configureStore } from '@reduxjs/toolkit'
import counselDetailsReducer from './features/counselDetailsSlice'
import authDetailsReducer from './features/authDetailsSlice'
import apiSlice from './features/apiSlice'

const store = configureStore({
  reducer: {
    counselDetails: counselDetailsReducer,
    authDetails: authDetailsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  }).concat(apiSlice.middleware)
})

export default store
