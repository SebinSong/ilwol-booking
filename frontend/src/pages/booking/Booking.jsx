import React, { useState } from 'react'

import Stepper from '@components/stepper/Stepper'
import OptionCard from '@components/option-card/OptionCard'
import PageTemplate from '../PageTemplate'
import { BOOKING_STEPS } from '@view-data/constants.js'
import bookingOptions from '@view-data/booking-options.js'

import './Booking.scss'

export default function Booking () {
  // local-state
  const [selectedOptionid, setSelectedOptionId] = useState('')

  // methods
  const onContinueClick = () => {
    alert('TODO: implement!')
  }

  return (
    <PageTemplate classes='page-booking'>

      <div className='page-width-constraints'>
        <h2 className='is-title-2 is-sans mb-40 page-title'>
          <i className='icon-calendar is-prefix'></i>
          <span>상담 예약하기</span>
        </h2>

        <Stepper classes='booking-stepper mb-60' list={BOOKING_STEPS} current={1} />

        <div className='counsel-option-container'>
          <h3 className='is-title-4 is-sans page-section-title'>
            <i className='icon-chevron-right-circle is-prefix'></i>
            <span>상담 옵션</span>
          </h3>

          <div className='counsel-option-list'>
            {
              bookingOptions.map(
                option => <OptionCard classes='counsel-option-card'
                  key={option.id}
                  {...option}
                  onSelect={setSelectedOptionId}
                  isSelected={selectedOptionid === option.id} />
              )
            }
          </div>
        </div>

        <div className='buttons-container'>
          <button type='button'
            className='continue-btn'
            disabled={!selectedOptionid}
            onClick={onContinueClick}
          >다음</button>
        </div>
      </div>
    </PageTemplate>
  )
}
