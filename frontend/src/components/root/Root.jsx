import React from 'react'
import { Provider } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import store from '@store/index.js'
import { classNames as cn } from '@utils'

// components
import Toolbar from '../toolbar/Toolbar'

export default function Root () {
  // local state
  const location = useLocation()
  const hideToolbar = ['/'].includes(location.pathname)

  return (
    <Provider store={store}>
      <div className={cn('app-layout', hideToolbar && 'toolbar-hidden')}>
        { !hideToolbar && <Toolbar classes='l-toolbar' /> }

        <Outlet />
      </div>
    </Provider>
  )
}