import React from 'react'

import Stepper from '@components/stepper/Stepper'
import OptionCard from '@components/option-card/OptionCard'
import PageTemplate from '../PageTemplate'
import { BOOKING_STEPS } from '~/constants.js'

import './Booking.scss'

export default function Booking () {
  return (
    <PageTemplate classes='page-booking'>

      <div className='page-width-constraints'>
        <h2 className='is-title-3 mb-40 page-title has-text-serif is-bold'>
          <i className='icon-calendar is-prefix'></i>
          <span>상담 예약하기</span>
        </h2>

        <Stepper classes='booking-stepper mb-60' list={BOOKING_STEPS} current={3} />

        <div className='counsel-option-container'>
          <OptionCard name='1인 개인 상담'
            description='개인 운세, 취업, 학업, 연애 상담'
            price='100,000' />
        </div>
      </div>
    </PageTemplate>
  )
}
