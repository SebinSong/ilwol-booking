import React from 'react'
import { Outlet } from 'react-router-dom'

// components
import Toolbar from '../toolbar/Toolbar'

export default function Root () {
  return (
    <div className='app-layout'>
      <Toolbar classes='l-toolbar' />

      <Outlet />
    </div>
  )
}