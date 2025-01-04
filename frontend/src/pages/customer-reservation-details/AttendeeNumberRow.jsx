import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

// components
import StateButton from '@components/state-button/StateButton'

// hooks
import { useUpdateReservationDetailsByCustomer } from '@store/features/reservationApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

// helpers
const selectOptionMap = {
  'family-counsel': [2, 3, 4, 5],
  'overseas-counsel': [1, 2, 3, 4, 5]
}

function AttendeeNumberRow ({
  optionId = '',
  numAttendee = 1,
  disableUpdate = false,
  onUpdateSuccess = () => {}
}) {
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [updatedValue, setUpdatedValue] = useState(numAttendee)
  const [updateAttendeeNumber, {
    isLoading: isUpdating
  }] = useUpdateReservationDetailsByCustomer()
  const optionsList = selectOptionMap[optionId]

  // methods
  const toggleUpdateMode = (e) => {
    e.stopPropagation()

    setIsUpdateMode(v => !v)
    setUpdatedValue(numAttendee)
  }

  const updateHandler = () => {
    if (!window.confirm('상담 방식을 수정하시겠습니까?')) { return }
  }

  return (
    <div className='summary-list__item attendee-number-row'>
      <span className='summary-list__label'>
        <span>인원 (본인포함)</span>
        {
          !disableUpdate &&
          <button className='is-small is-secondary modify-btn'
            type='button'
            disabled={isUpdating}
            onClick={toggleUpdateMode}>
            {isUpdateMode ? '뒤로' : '변경'}
          </button>
        }
      </span>

      {
        isUpdateMode ? (
          <span className='summary-list__value is-inline-flex'>
            <span className='selectbox is-small num-attendee-select'>
              <select className='select'
                tabIndex='0'
                value={updatedValue}
                onChange={e => setUpdatedValue(e.target.value)}>
                {
                  optionsList.map(num => (
                    <option value={num} key={num}>{num}</option>
                  ))
                }
              </select>
            </span>

            <StateButton classes='is-small update-btn'
              type='button'
              disabled={numAttendee === updatedValue}
              onClick={updateHandler}
              displayLoader={isUpdating}
              dis>수정</StateButton>
          </span>
        ) : (
          <span className='summary-list__value'>{numAttendee}명</span>
        )
      }
    </div>
  )
}

export default React.memo(AttendeeNumberRow)
