import React from 'react'

// utils
import bookingOptions from '@view-data/booking-options.js'

function BookingOptionRow ({
  optionId = ''
}) {

  // local-state
  const bookingOption = bookingOptions.find(item => item.id === optionId)

  if (!bookingOption) { return null }

  return (
    <div className='summary-list__item'>
      <span className='summary-list__label'>상담 옵션</span>
      <span className='summary-list__value'>{bookingOption.name}</span>
    </div>
  )
}

export default React.memo(BookingOptionRow)
