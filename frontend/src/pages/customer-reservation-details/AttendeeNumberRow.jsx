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

  const updateHandler = async () => {
    if (!window.confirm('상담 인원을 수정하시겠습니까?')) { return }

    try {
      const result = await updateAttendeeNumber({
        id: reservationId,
        updates: { numAttendee: updatedValue },
        type: 'num-attendee'
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '수정 완료!',
        content: '상담인원이 성공적으로 수정되었습니다.'
      })
      onUpdateSuccess()
    } catch (err) {
      console.error('AttendeeNumberRow.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '수정 오류!',
        content: '요청 처리중 오류가 발생하였습니다.'
      })

      setUpdatedValue(numAttendee)
    } finally {
      setIsUpdateMode(false)
    }
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
