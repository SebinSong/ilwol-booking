import React from 'react'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { classNames as cn } from '@utils'

// components
import Toolbar from '../toolbar/Toolbar'

export default function Root () {
  // local state
  const location = useLocation()
  const hideToolbar = ['/'].includes(location.pathname)

  console.log('current location: ', location)
  return (
    <div className={cn('app-layout', hideToolbar && 'toolbar-hidden')}>
      { !hideToolbar && <Toolbar classes='l-toolbar' /> }

      <Outlet />
    </div>
  )
}