import React, { useMemo } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import ContactLine from './contact-line/ContactLine'
// hooks
import { useGetAllContacts } from '@store/features/adminApiSlice.js'

import './AdminCustomerContact.scss'

export default function AdminCustomerContact () {
  // local-state
  const {
    data: contactData,
    isLoading: isContactsLoading,
    isError: isContactsError
  } = useGetAllContacts()

  // computed state
  const feedbackEl = useMemo(
    () => {
      const content = (isContactsLoading)
        ? <TextLoader>주소록 데이터 로딩중..</TextLoader>
        : isContactsError
          ? <Feedback type='error'
                showError={true}
                hideCloseBtn={true} 
                message='주소록 데이터 로드중 오류가 발생했습니다.' />
          : null

      return content
        ? <div className='admin-feedback-container'>{content}</div>
        : null
    },
    [isContactsLoading, isContactsError]
  )

  return (
    <AdminPageTemplate classes='page-admin-customer-contact'>
      <div className='page-width-constraints'>
        <h2 className='admin-page-title'>
          <i className='icon-id-card is-prefix'></i>
          <span>고객 주소록</span>
        </h2>

        <p className='admin-page-description'>예약 사이트 이용자들의 연락처 정보를 조회합니다.</p>

        <div className='admin-customer-contact__content'>
          {
            feedbackEl ||
            <>
              <p>{contactData.length}개의 주소록 데이터가 로드되었습니다.</p>
              <div className='mt-30'>
                {
                  contactData.map(entry => <ContactLine data={entry} key={entry._id} />)
                }
              </div>
            </>
          }
        </div>
      </div>
    </AdminPageTemplate>
  )
}
