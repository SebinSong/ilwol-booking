import React, { useState, useMemo, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import bookingOptions from '@view-data/booking-options.js'
import { selectCounselOption, addCounselOption } from '@store/features/counselDetailsSlice.js'
import { ToastContext } from '@hooks/useToast.js'

import OptionCard from '@components/option-card/OptionCard'

import './SelectBookingOption.scss'

export default function SelectBookingOption () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const optionInStore = useSelector(selectCounselOption)
  const [selectedOptionid, setSelectedOptionId] = useState(optionInStore?.id || '')

  // methods
  const onContinueClick = async () => {
    try {
      if (selectedOptionid) {
        dispatch(addCounselOption({ id: selectedOptionid }))
        navigate('/booking/date-and-time')
      }
    } catch (err) {
      console.error('error: ', err)
      addToastItem({
        type: 'warning',
        heading: '에러 발생!',
        content: err?.message || '예기치 못한 이슈가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  return (
    <div className='counsel-option-container'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>상담 옵션 선택</span>
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
