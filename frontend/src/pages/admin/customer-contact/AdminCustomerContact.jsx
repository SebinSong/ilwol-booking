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
  const [sortByDate, setSortByDate] = useState(false)
  const [search, setSearch] = useState('')

  // computed state
  const feedbackEl = useMemo(
    () => {
      const content = (isContactsLoading)
        ? <TextLoader>연락처 데이터 로딩중..</TextLoader>
        : isContactsError
          ? <Feedback type='error'
                showError={true}
                hideCloseBtn={true} 
                message='연락처 데이터 로드중 오류가 발생했습니다.' />
          : null

      return content
        ? <div className='admin-feedback-container'>{content}</div>
        : null
    },
    [isContactsLoading, isContactsError]
  )
  const dataToShow = useMemo(
    () => {
      const list = (contactData || []).filter(entry => entry.searchable.includes(search))

      if (sortByDate) {
        list.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      }
      return list
    },
    [contactData, search, sortByDate]
  )

  return (
    <AdminPageTemplate classes='page-admin-customer-contact'>
      <div className='page-width-constraints'>
        <h2 className='admin-page-title'>
          <i className='icon-id-card is-prefix'></i>
          <span>고객 연락처</span>
        </h2>

        <p className='admin-page-description'>예약 사이트 이용자들의 연락처 정보를 조회합니다.</p>

        <div className='admin-customer-contact__content'>
          {
            feedbackEl ||
            <>
              {
                contactData?.length > 0
                  ? <>
                      <div className='load-info-box'>
                        <p className='contact-load-info'>
                          <span className='has-text-bold text-color-magenta mr-2'>{contactData.length}</span>개의 연락처가 로드됨.
                        </p>
                      </div>

                      <div className='search-bar-container'>
                        <div className='input-with-pre-icon'>
                          <i className='icon-search pre-icon'></i>

                          <input className='input is-small search-input'
                            type='text'
                            value={search}
                            placeholder='이름 또는 번호 입력'
                            onInput={e => setSearch(e.target.value)} />
                        </div>

                        <button className='is-secondary is-extra-small sort-btn'
                          onClick={() => setSortByDate(v => !v)}>
                          <i className='icon-bulleted-list is-prefix'></i>
                          <span>
                            { sortByDate ? '가나다 순으로' : '최근 순서로' }
                          </span>
                        </button>
                      </div>

                      <div className='admin-contact-list'>
                        {
                          dataToShow.length > 0
                            ? dataToShow.map(entry => <ContactLine data={entry} key={entry._id} searchValue={search} />)
                            : <p className='helper info mt-0'>검색결과가 없습니다.</p>
                        }
                      </div>
                    </>
                  : <p className='helper info'>로드된 데이터가 없습니다.</p>
              }
            </>
          }
        </div>
      </div>
    </AdminPageTemplate>
  )
}
