import React, { useContext } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'

// hooks
import { ToastContext } from '@hooks/useToast.js'

import './AdminInquiry.scss'

export default function AdminInquiry ({ classes = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  return (
    <AdminPageTemplate classes={cn('page-admin-inquiry', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-mail is-prefix'></i>
        <span>고객 문의사항</span>
      </h2>
    </AdminPageTemplate>
  )
}
