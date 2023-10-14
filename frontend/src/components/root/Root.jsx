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
import { useNavMenu, NavMenuContext } from '@hooks/useNavMenu.js'

export default function Root () {
  // local state
  const location = useLocation()

  // computed state
  const hideToolbar = useMemo(
    () => ['/'].includes(location.pathname), [location]
  )
  const isAdminPage = useMemo(
    () => (location.pathname || '').startsWith('/admin/'), [location]
  )
  const ToolbarType = useMemo(
    () => isAdminPage ? AdminToolbar : Toolbar,
    [isAdminPage]
  )

  // hooks
  const toastUtils = useToast([])
  const navMenuUtils = useNavMenu()

  return (
    <Provider store={store}>
      <div className={cn(
        'app-layout',
        { 'toolbar-hidden': hideToolbar, 'is-admin-page': isAdminPage }
      )}>
        <ToastContext.Provider value={toastUtils}>
          <NavMenuContext.Provider value={navMenuUtils}>
            { !hideToolbar && <ToolbarType classes='l-toolbar' /> }

            <Outlet />
            <ToastContainer />
          </NavMenuContext.Provider>
        </ToastContext.Provider>
      </div>
    </Provider>
  )
}