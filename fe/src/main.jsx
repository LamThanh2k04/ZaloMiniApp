import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import userSlice from './common/redux/userSlice.js'
export const store = configureStore({
  reducer: {
    userSlice: userSlice,
  }
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <StrictMode> */}
    <App />
    {/* </StrictMode>, */}
  </Provider>
)
