import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageTemplate from '../PageTemplate'

const { IlwolLogo } = React.Global

import './Home.scss'

export default function Home () {
  // local state
  const navigate = useNavigate()

  return (
    <PageTemplate classes='page-home'>
      <IlwolLogo classes='project-logo' width={56} />

      <h2 className='is-title-2 is-serif page-title mb-30'>
        <span>일월선녀</span>
        <span>해달별</span>
      </h2>

      <div className='button-container'>
        <button type='button'
          className='booking-btn'
          onClick={() => navigate('/booking/counsel-option')}
        >예약하기</button>

        <span className='link admin-login-cta'
          tabIndex={0}
          onClick={() => navigate('/admin-login')}>
            <i className='icon-gear'></i>
            <span>관리자 로그인</span>
          </span>
      </div>
    </PageTemplate>
  )
}
