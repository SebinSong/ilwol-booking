import React, { useEffect } from 'react'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'

import './ConfirmAndPayment.scss'

export default function ConfirmAndPayment () {
  const {
    counselOptionInstore,
    counselDateInStore,
    counselTimeSlotInStore,
    counselPersonalDetailsInStore,
    checkStepStateAndGo
  } = useCounselOptionSteps()

  // effects
  useEffect(() => {
    checkStepStateAndGo('personal-details')
  }, [])

  return (
    <div className='confirm-and-payment page-form-constraints'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>예약 및 결제</span>
      </h3>

      <div className='booking-details-container'>

      </div>
    </div>
  )
}
