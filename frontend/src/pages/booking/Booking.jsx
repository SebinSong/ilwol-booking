import React from 'react'

import Stepper from '@components/stepper/Stepper'
import OptionCard from '@components/option-card/OptionCard'
import PageTemplate from '../PageTemplate'
import { BOOKING_STEPS } from '@view-data/constants.js'
import bookingOptions from '@view-data/booking-options.js'

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
          {
            bookingOptions.map(
              option => <OptionCard key={option.id} {...option} />
            )
          }
          
        </div>
      </div>
    </PageTemplate>
  )
}
