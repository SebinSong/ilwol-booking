import React, { useMemo } from 'react'
import { Provider } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import store from '@store/index.js'
import { classNames as cn } from '@utils'

// components
import ToastContainer from '@components/toast/ToastContainer'
import Toolbar from '../toolbar/Toolbar'
import AdminToolbar from '../toolbar/AdminToolbar'

// hooks
import { useToast, ToastContext } from '@hooks/useToast.js'

export default function Root () {
  // local state
  const location = useLocation()
  const hideToolbar = useMemo(
    () => ['/'].includes(location.pathname),
    [location]
  )
  const ToolbarType = useMemo(
    () => (location.pathname || '').startsWith('/admin/') ? AdminToolbar : Toolbar,
    [location]
  )

  // toast-utils
  const toastUtils = useToast([])

  return (
    <Provider store={store}>
      <div className={cn('app-layout', hideToolbar && 'toolbar-hidden')}>
        <ToastContext.Provider value={toastUtils}>
          { !hideToolbar && <ToolbarType classes='l-toolbar' /> }

          <Outlet />
          <ToastContainer />
        </ToastContext.Provider>
      </div>
    </Provider>
  )
}