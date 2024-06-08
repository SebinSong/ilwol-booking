import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavermapsProvider } from 'react-naver-maps'

// utils
import { classNames as cn } from '@utils'
import useMq from '@hooks/useMediaQuery'

// child components
import PageTemplate from '../PageTemplate'
import HomeIntroduction from './HomeIntroduction'
import KakaoChannelIcon from '@components/svg-icons/KakaoChannelIcon'
import CarouselSlider from '@components/carousel-slider/CarouselSlider.jsx'
import NewsBanner from './NewsBanner.jsx'

const { IlwolLogo } = React.Global

import './Home.scss'

export default function Home () {
  // local state
  const navigate = useNavigate()
  const [showIntroduction, setShowIntroduction] = useState(false)

  // hooks
  const isDesktop = useMq('desktop')

  // methods
  const onReserveBtnClick = () => {
    navigate('/booking/counsel-option')
  }
  const onYoutubeBtnClick = () => {
    window.open('https://www.youtube.com/@ilwolseonnyeo', '_blank')
  }
  const onChannelIconClick = () => {
    window.open('https://pf.kakao.com/_csjiG', '_blank')
  }

  return (
    <NavermapsProvider ncpClientId='piqbzhw41l'>
      <PageTemplate classes={cn('page-home', showIntroduction && 'showing-introduction')}>
        {
          showIntroduction
            ? <>
                <HomeIntroduction onBackClick={() => { setShowIntroduction(false) }} />

                <button type='button' className='is-purple reserve-btn-fixed'
                  onClick={onReserveBtnClick}>
                  <span className='icon-chevron-right-circle is-prefix'></span>
                  <span>예약하기</span>
                </button>
              </>
            : <>
                <div className='main-toolbar'>
                  <IlwolLogo classes='project-logo' width={isDesktop ? 18 : 16} />
            
                  <h2 className='is-serif has-text-bold page-title'>일월선녀 해달별</h2>
                </div>

                <div className='content-main'>
                  <div className='home-carousel-container mt-30'>
                    <span className='youtube-news-tag'>
                      <i className='icon-youtube is-prefix'></i>
                      <span className='youtube-text'>유튜브 소식</span>
                    </span>
                    <CarouselSlider classes='home-youtube-carousel' type='youtube' />
                  </div>
          
                  <div className='home-content-container'>
                    <NewsBanner classes='home-news-banner' />

                    <div className='button-container'>
                      <button type='button'
                        className='is-secondary introduction-btn'
                        onClick={() => setShowIntroduction(true)}>
                        <span className='icon-info-circle is-prefix'></span>
                        소개 / 리뷰 / 오시는 길
                      </button>
            
                      <button type='button'
                        className='booking-btn'
                        onClick={onReserveBtnClick}
                      >예약하기</button>
                    </div>
                      
                  </div>
                </div>

                <span className='link admin-login-cta'
                  tabIndex={0}
                  onClick={() => navigate('/admin/manage-reservation')}>
                    <i className='icon-gear'></i>
                    <span>관리자 로그인</span>
                </span>

                <KakaoChannelIcon classes='kakao-channel-logo' width={34}
                  onClick={onChannelIconClick} />
              </>
        }
      </PageTemplate>
    </NavermapsProvider>
  )
}
