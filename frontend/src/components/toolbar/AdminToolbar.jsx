import React, { useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { classNames as cn } from '@utils'
import { selectUserInfo } from '@store/features/authDetailsSlice.js'
import { useAdminLogout } from '@store/features/authApiSlice'
import { clearCredentials } from '@store/features/authDetailsSlice'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { NavMenuContext } from '@hooks/useNavMenu.js'

import './ToolbarCommon.scss'

const { IlwolLogo } = React.Global

function AdminToolbar ({
  classes = '',
  toggleNavigation = null
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)
  const { toggleNavMenu } = useContext(NavMenuContext)

  // local-state
  const [adminLogout, { isLoading: isLoggingOut }] = useAdminLogout()
  const userInfo = useSelector(selectUserInfo)
  const isOwner = useMemo(
    () => userInfo?.userType === 'admin-owner', [userInfo]
  )

  // methods
  const toAdminHome = () => navigate('/admin/manage-reservation')

  const logoutHandler = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) { return }

    try {
      const res = await adminLogout()
      dispatch(clearCredentials())
      navigate('/admin-login')
    } catch (err) {
      console.error('AdminToolbar.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '로그아웃 오류!',
        content: '로그아웃 처리중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  return (
    <div className={cn('app-toolbar is-admin-toolbar', classes)}>
      <div className='left-group'>
        <h1 className='is-title-4 is-serif toolbar-title'
          onClick={() => navigate('/')}>
          <IlwolLogo classes='toolbar-logo' width={16} />
          <span>해달별 관리자</span>
        </h1>
      </div>

      <ul className='right-group'>
        <li className='admin-level-badge'
          onClick={toAdminHome}>
          <i className={cn(isOwner ? 'icon-star' : 'icon-user', 'badge-icon')}></i>
          <span className='badge-level'>{ isOwner ? '주인장' : '스탭' }</span>
        </li>

        <li className='nav-item'>
          <button className='is-unstyled is-serif'
            disabled={isLoggingOut}
            onClick={logoutHandler}>로그아웃</button>
        </li>

        <li className='nav-item nav-menu-btn'>
          <button className='is-unstyled'
            onClick={toggleNavMenu}>
            <i className='icon-menu'></i>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default React.memo(AdminToolbar)
