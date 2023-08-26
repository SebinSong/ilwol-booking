import React from 'react'
import { useNavigate } from 'react-router-dom'
import Toolbar from '@components/toolbar/Toolbar.jsx'
import PageTemplate from '../PageTemplate'

import './Home.scss'

export default function Home () {
  // local state
  const navigate = useNavigate()

  return (
    <PageTemplate classes='page-home'>
      <h2 className='is-title-2'>
        <i class='icon-info-circle is-prefix'></i>
        <span>랜딩 페이지</span>
      </h2>

      <div className='button-container'>
        <button type='button'
          className='booking-btn'
          onClick={() => navigate('/booking')}
        >예약하기</button>
      </div>
    </PageTemplate>
  )
}
