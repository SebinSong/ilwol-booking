import React, { useMemo, useState } from 'react'

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
  const [search, setSearch] = useState('')

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
  const dataToShow = useMemo(
    () => {
      return (contactData || []).filter(entry => entry.searchable.includes(search))
    },
    [contactData, search]
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
              <div className='search-bar-container'>
                <p className='contact-load-info'>
                  <span className='has-text-bold text-color-magenta mr-2'>{contactData.length}</span>개의 주소록이 로드됨.
                </p>

                <div className='input-with-pre-icon'>
                  <i className='icon-search pre-icon'></i>

                  <input className='input is-small'
                    type='text'
                    value={search}
                    placeholder='이름 또는 번호 입력'
                    onInput={e => setSearch(e.target.value)} />
                </div>
              </div>
              
              <div className='admin-contact-list'>
                {
                  dataToShow.map(entry => <ContactLine data={entry} key={entry._id} />)
                }
              </div>
            </>
          }
        </div>
      </div>
    </AdminPageTemplate>
  )
}
