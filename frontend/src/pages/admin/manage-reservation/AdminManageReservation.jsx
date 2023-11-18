import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import AdminReservationList from './reservation-list/AdminReservationList'

// hooks
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

import './AdminManageReservation.scss'

export default function AdminManageReservation () {
  return (
    <AdminPageTemplate classes='page-admin-manage-reservation'>
      <div className='admin-manage-reservation-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-bulleted-list is-prefix'></i>
          <span>예약 관리</span>
        </h2>

        <AdminReservationList />
      </div>
    </AdminPageTemplate>
  )
}
