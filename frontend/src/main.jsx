import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom'

// pages
import Home from '@pages/home/Home.jsx'

// import global styles
import './styles/main.scss'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }
])

const AppRoot = createRoot(document.querySelector('#root'))
AppRoot.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
