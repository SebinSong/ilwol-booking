import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'

// define global components
import './components/global/index.js'

// root component
import Root from '@components/root/Root'

// pages
import Home from '@pages/home/Home.jsx'
import Booking from '@pages/booking/Booking.jsx'
import Inquiry from '@pages/inquiry/Inquiry'
import Login from '@pages/auth/login/Login'

// import global styles
import './styles/main.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/booking/:id',
        element: <Booking />
      },
      {
        path: '/booking',
        element: <Booking />
      },
      {
        path: '/inquiry',
        element: <Inquiry />
      },
      {
        path: '/admin-login',
        element: <Login />
      }
    ]
  }
], {
  basename: import.meta.env.MODE === 'staging' ? import.meta.env.BASE_URL : '/'
})

const AppRoot = createRoot(document.querySelector('#root'))
AppRoot.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
