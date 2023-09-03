import React from 'react'
import { useParams } from 'react-router-dom'

import { BOOKING_STEPS, getStepOrder } from '@view-data/booking-steps.js'

// child components
import Stepper from '@components/stepper/Stepper'
import SelectBookingOption from './select-booking-option/SelectBookingOption'

import PageTemplate from '../PageTemplate'

import './Booking.scss'

const getContentComponentById = stepId => {
  return ({
    'counsel-option': SelectBookingOption
  })[stepId] || null
}

export default function Booking () {
  const { id: stepId } = useParams()

  // local-state
  const currentStepNum = getStepOrder(stepId)
  const ContentComponent = getContentComponentById(stepId)

  return (
    <PageTemplate classes='page-booking'>

      <div className='page-width-constraints'>
        <h2 className='is-title-2 is-sans mb-40 page-title'>
          <i className='icon-calendar is-prefix'></i>
          <span>상담 예약하기</span>
        </h2>

        <Stepper classes='booking-stepper mb-60' list={BOOKING_STEPS} current={currentStepNum} />

        <div className='page-booking__content'>
          { Boolean(ContentComponent) && <ContentComponent /> }
        </div>
      </div>
    </PageTemplate>
  )
}
