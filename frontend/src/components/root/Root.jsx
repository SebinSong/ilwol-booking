import React from 'react'
import { Outlet } from 'react-router-dom'

// components
import Toolbar from '../toolbar/Toolbar'

export default function App () {
  return (
    <div className='app-loayout'>
      <Toolbar classes='l-toolbar' />

      <Outlet />
    </div>
  )
}