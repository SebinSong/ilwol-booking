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
      <h2 className='is-title-2 is-serif page-title mb-30'>
        <span>일월선녀<br />해달별<sup class='c-logo'>&copy;</sup></span>
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
