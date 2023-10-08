import React, { useContext, useCallback } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Container from '@components/container/Container'
import { useAdminLogout } from '@store/features/authApiSlice'
import { clearCredentials } from '@store/features/authDetailsSlice'

import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'

// hooks
import { ToastContext } from '@hooks/useToast.js'

export default function AdminDashboard ({
  classes = ''
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [adminLogout, { isLoading }] = useAdminLogout()
  // methods
  const logoutHandler = async () => {
    try {
      const res = await adminLogout()
      dispatch(clearCredentials())
      navigate('/admin-login')
    } catch (err) {
      console.log('AdminDashboard.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '로그아웃 오류!',
        content: '로그아웃 처리중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  return (
    <AdminPageTemplate classes='page-admin-dashboard'>
      <div className='page-form-constraints'>
        <p>관리자 페이지 각종 기능들을 준비중입니다.</p>

        <div className='buttons-container'>
          <StateButton classes='is-secondary'
            type='button'
            onClick={logoutHandler}>로그아웃</StateButton>
        </div>
      </div>
    </AdminPageTemplate>
  )
}
