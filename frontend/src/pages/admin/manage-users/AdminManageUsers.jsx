import React, { useState } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import StateButton from '@components/state-button/StateButton'

// css
import './AdminManageUsers.scss'

export default function AdminManageUsers () {
  // local-state
  const [search, setSearch] = useState('')

  // views
  const feedbackEl = (
    <div className='admin-feedback-container'>
      <TextLoader>
        유저 데이터 로딩중...
      </TextLoader>
    </div>
  )

  return (
    <AdminPageTemplate classes='page-admin-manage-users'>
      <div className='admin-manage-users-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-group is-prefix'></i>
          <span>유저 관리</span>
        </h2>

        {
          feedbackEl ||
          <>
            <div className='search-input-container mb-30'>
              <div className='input-with-pre-icon'>
                <i className='icon-search pre-icon'></i>

                <input className='input admin-search-input'
                  type='text'
                  value={search}
                  onInput={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className='ilwol-table-container users-list-table'>
              <p> Coming soon! - 테이블 추가하기 </p>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
