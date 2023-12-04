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
import Home from '@pages/home/Home'
import Booking from '@pages/booking/Booking'
import CustomerReservationDetails from '@pages/customer-reservation-details/CustomerReservationDetails'
import Inquiry from '@pages/inquiry/Inquiry'
import Login from '@pages/auth/Login'
import Signup from '@pages/auth/Signup'

// admin pages
import AdminDashboard from '@pages/admin/dashboard/AdminDashboard'
import AdminInquiry from '@pages/admin/inquiry/AdminInquiry'
import AdminInquiryDetails from '@pages/admin/inquiry-details/AdminInquiryDetails'
import AdminManageReservation from '@pages/admin/manage-reservation/AdminManageReservation'
import AdminManageReservationItem from '@pages/admin/manage-reservation-item/AdminManageReservationItem'
import AdminUpdateReservationItem from '@pages/admin/update-reservation-item/UpdateReservationItem'
import AdminManageUsers from '@pages/admin/manage-users/AdminManageUsers'


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
        path: '/reservation-details/:id',
        element: <CustomerReservationDetails />
      },
      {
        path: '/inquiry',
        element: <Inquiry />
      },
      {
        path: '/admin-login',
        element: <Login />
      },
      {
        path: '/admin-signup',
        element: <Signup />
      },

      // admin pages
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />
      },
      {
        path: '/admin/manage-reservation',
        element: <AdminManageReservation />
      },
      {
        path: '/admin/manage-reservation-item/:id',
        element: <AdminManageReservationItem />
      },
      {
        path: '/admin/update-reservation-item/:id',
        element: <AdminUpdateReservationItem />
      },
      {
        path: '/admin/manage-users',
        element: <AdminManageUsers />
      }
    ]
  }
], {
  basename: import.meta.env.MODE === 'staging'
    ? import.meta.env.BASE_URL
    : '/'
})

const AppRoot = createRoot(document.querySelector('#root'))
AppRoot.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
