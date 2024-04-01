import React, { useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import AdminReservationList from './reservation-list/AdminReservationList'
import CarouselSlider from '@components/carousel-slider/CarouselSlider.jsx'

import './AdminManageReservation.scss'

export default function AdminManageReservation () {
  return (
    <AdminPageTemplate classes='page-admin-manage-reservation'>
      <div className='admin-manage-reservation-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-calendar is-prefix'></i>
          <span>예약 관리</span>
        </h2>

        <p className='admin-page-description'>예약 아이템들을 한 눈에 볼 수 있습니다.</p>

        <CarouselSlider classes='mt-20 mb-20' />

        <AdminReservationList />
      </div>
    </AdminPageTemplate>
  )
}
