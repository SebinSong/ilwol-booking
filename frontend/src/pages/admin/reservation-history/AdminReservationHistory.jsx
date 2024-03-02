import React from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'

export default function AdminReservationHistory () {
  return (
    <AdminPageTemplate classes='page-admin-reservation-history'>
      <div className='admin-reservation-history-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-bulleted-list is-prefix'></i>
          <span>예약 히스토리</span>
        </h2>

        <p className='admin-page-description'>지난 예약 아이템들을 조회할 수 있습니다.</p>

        <div className='admin-reservation-history__content'>
          <p>
            <i className='icon-gear is-prefix'></i>
            준비중입니다.
          </p>
        </div>
      </div>
    </AdminPageTemplate>
  )
}
