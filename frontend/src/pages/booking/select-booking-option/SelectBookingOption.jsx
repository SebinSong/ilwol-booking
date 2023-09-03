import React, { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import bookingOptions from '@view-data/booking-options.js'
import { selectCounselOption, addOption } from '@store/features/counselDetailsSlice.js'

import OptionCard from '@components/option-card/OptionCard'

import './SelectBookingOption.scss'

export default function SelectBookingOption () {
  const dispatch = useDispatch()

  // local-state
  const optionInStore = useSelector(selectCounselOption)
  const [selectedOptionid, setSelectedOptionId] = useState(optionInStore?.id || '')

  // methods
  const onContinueClick = () => {
    if (selectedOptionid) {
      dispatch(addOption({ id: selectedOptionid }))
    }
  }

  return (
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

      <div className='buttons-container mt-60'>
        <button type='button'
          className='is-primary continue-btn'
          disabled={!selectedOptionid}
          onClick={onContinueClick}
        >다음</button>
      </div>
    </div>
  )
}
