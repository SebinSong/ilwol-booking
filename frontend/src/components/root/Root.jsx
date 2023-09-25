import React from 'react'
import { Provider } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import store from '@store/index.js'
import { classNames as cn } from '@utils'

// components
import ToastContainer from '@components/toast/ToastContainer'

// hooks
import { useToast, ToastContext } from '@hooks/useToast.js'

// components
import Toolbar from '../toolbar/Toolbar'

export default function Root () {
  // local state
  const location = useLocation()
  const hideToolbar = ['/'].includes(location.pathname)

  // toast-utils
  const toastUtils = useToast([])

  return (
    <Provider store={store}>
      <div className={cn('app-layout', hideToolbar && 'toolbar-hidden')}>
        <ToastContext.Provider value={toastUtils}>
          { !hideToolbar && <Toolbar classes='l-toolbar' /> }

          <Outlet />
          <ToastContainer />
        </ToastContext.Provider>
      </div>
    </Provider>
  )
}