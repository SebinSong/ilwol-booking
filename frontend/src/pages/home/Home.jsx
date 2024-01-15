import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavermapsProvider } from 'react-naver-maps'

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

  // methods
  const onReserveBtnClick = () => {
    navigate('/booking/counsel-option')
  }
  const onYoutubeBtnClick = () => {
    window.open('https://www.youtube.com/@ilwolsung', '_blank')
  }

  return (
    <NavermapsProvider ncpClientId='piqbzhw41l'>
      <PageTemplate classes={cn('page-home', showIntroduction && 'showing-introduction')}>
        {
          showIntroduction
            ? <HomeIntroduction onBackClick={() => { setShowIntroduction(false) }} />
            : <div className='content-main'>
                <IlwolLogo classes='project-logo' width={56} />
        
                <h2 className='is-title-2 is-serif page-title'>
                  <span>일월선녀</span>
                  <span>해달별</span>
                </h2>
        
                <div className='button-container mt-20'>
                  <button type='button'
                    className='is-secondary youtube-btn'
                    onClick={onYoutubeBtnClick}>
                    <span className='icon-youtube is-prefix'></span>
                    <span className='has-text-bold mr-4'>Youtube</span> 채널 바로가기
                  </button>

                  <button type='button'
                    className='is-secondary introduction-btn'
                    onClick={() => setShowIntroduction(true)}>
                    <span className='icon-info-circle is-prefix'></span>
                    선녀님 소개 / 오시는 길
                  </button>
        
                  <button type='button'
                    className='booking-btn'
                    onClick={onReserveBtnClick}
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

        {
          showIntroduction &&
          <button type='button' className='is-primary reserve-btn-fixed'
            onClick={onReserveBtnClick}>
            <span className='icon-chevron-right-circle is-prefix'></span>
            <span>예약하기</span>
          </button>
        }
      </PageTemplate>
    </NavermapsProvider>
  )
}
