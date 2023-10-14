import React, { useContext } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Container from '@components/container/Container'

import AdminPageTemplate from '@pages/AdminPageTemplate'

// hooks
import { ToastContext } from '@hooks/useToast.js'

export default function AdminDashboard ({
  classes = ''
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  return (
    <AdminPageTemplate classes='page-admin-dashboard'>
      <div className='page-form-constraints'>
        <p>관리자 페이지 각종 기능들을 준비중입니다.</p>
      </div>
    </AdminPageTemplate>
  )
}
