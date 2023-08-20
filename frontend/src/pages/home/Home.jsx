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
      <h2>랜딩 페이지</h2>

      <div className='button-container'>
        <button type='button'
          onClick={() => navigate('/booking')}
          className='booking-btn'>예약하기</button>
      </div>
    </PageTemplate>
  )
}
