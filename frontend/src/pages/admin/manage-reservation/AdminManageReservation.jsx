import React, { useContext } from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'

// hooks
import { ToastContext } from '@hooks/useToast.js'

import './AdminManageReservation.scss'

export default function AdminManageReservation ({ classes = '' }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  return (
    <AdminPageTemplate classes={cn('page-admin-manage-reservation', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-bulleted-list is-prefix'></i>
        <span>예약 관리</span>
      </h2>
    </AdminPageTemplate>
  )
}
