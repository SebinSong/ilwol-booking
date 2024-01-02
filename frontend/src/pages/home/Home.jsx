import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// utils
import { classNames as cn } from '@utils'

// child components
import PageTemplate from '../PageTemplate'
import HomeIntroduction from './HomeIntroduction'

const { IlwolLogo } = React.Global

import './Home.scss'

export default function Home () {
  // local state
  const navigate = useNavigate()
  const [showIntroduction, setShowIntroduction] = useState(false)

  return (
    <PageTemplate classes={cn('page-home', showIntroduction && 'showing-introduction')}>
      {
        showIntroduction
          ? <HomeIntroduction />
          : <div className='content-main'>
              <IlwolLogo classes='project-logo' width={56} />
      
              <h2 className='is-title-2 is-serif page-title mb-30'>
                <span>일월선녀</span>
                <span>해달별</span>
              </h2>
      
              <div className='button-container'>
                <button type='button'
                  className='is-secondary introduction-btn'
                  onClick={() => setShowIntroduction(true)}>
                  <span className='icon-info-circle is-prefix'></span>
                  선녀님 소개 / 오시는 길
                </button>
      
                <button type='button'
                  className='booking-btn'
                  onClick={() => navigate('/booking/counsel-option')}
                >예약하기</button>
              </div>
            </div>
      }

      {
        !showIntroduction &&
        <span className='link admin-login-cta'
          tabIndex={0}
          onClick={() => navigate('/admin/dashboard')}>
            <i className='icon-gear'></i>
            <span>관리자 로그인</span>
        </span>
      }
      
    </PageTemplate>
  )
}
