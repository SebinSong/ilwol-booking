import React from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'

import './AdminCustomerContact.scss'

export default function AdminCustomerContact () {
  return (
    <AdminPageTemplate classes='page-admin-customer-contact'>
      <div classNaame='admin-customer-contact-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-id-card is-prefix'></i>
          <span>고객 주소록</span>
        </h2>

        <p className='admin-page-description'>예약 사이트 이용자들의 연락처 정보를 조회합니다.</p>

        <div className='admin-customer-contact__content'>
        </div>
      </div>
    </AdminPageTemplate>
  )
}
