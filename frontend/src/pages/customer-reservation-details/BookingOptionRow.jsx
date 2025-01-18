import React, { useState, useContext, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// components
import StateButton from '@components/state-button/StateButton'

// utils
import bookingOptions from '@view-data/booking-options.js'
import { formatMoney, computeReservationTotalPrice } from '@utils'

// hooks
import { useUpdateReservationDetailsByCustomer } from '@store/features/reservationApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

// helpers
const priceDisplay = price => formatMoney(price, { minimumFractionDigits: 0 })
const numAttendeeOptionMap = {
  'family-counsel': [2, 3, 4, 5],
  'overseas-counsel': [1, 2, 3, 4, 5]
}
function BookingOptionRow ({
  rowId = 'booking-option',
  currentOptionId = '',
  currentNumAttendee = 1,
  disableUpdate = false,
  currentTotalPrice = 0,
  onUpdateModeChange = null,
  onUpdateSuccess = () => {}
}) {
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [updatedOption, setUpdatedOption] = useState(currentOptionId)
  const [updatedNumAttendee, setUpdatedNumAttendee] = useState(currentNumAttendee)
  const [updateBookingOption, {
    isLoading: isUpdating
  }] = useUpdateReservationDetailsByCustomer()

  // computed-state
  const bookingOption = useMemo(
    () => bookingOptions.find(item => item.id === currentOptionId),
    [currentOptionId]
  )
  const numAttendeeOptions = useMemo(
    () => numAttendeeOptionMap[updatedOption] || null,
    [updatedOption]
  )

  // methods
  const toggleUpdateMode = (e) => {
    e.stopPropagation()

    setIsUpdateMode(v => !v)
    setUpdatedOption(currentOptionId)
    setUpdatedNumAttendee(currentNumAttendee)
  }

  const updateHandler = () => {}

  // effects
  useEffect(() => {
    onUpdateModeChange && onUpdateModeChange(isUpdateMode ? rowId : null)
  }, [isUpdateMode])

  if (!bookingOption) { return null }

  return (
    <div className='summary-list__item has-sub-block'>
      <div className='sub-block'>
        <span className='summary-list__label fit-content'>
          <span>상담 옵션</span>
          {
            !disableUpdate &&
            <button className='is-small is-secondary modify-btn'
              type='button'
              disabled={isUpdating}
              onClick={toggleUpdateMode}>
              {isUpdateMode ? '뒤로' : '변경'}
            </button>
          }

          {
            isUpdateMode &&
            <StateButton classes='is-small update-btn is-in-label'
              type='button'
              disabled={currentOptionId === updatedOption}
              onClick={updateHandler}
              displayLoader={isUpdating}
            >수정</StateButton>
          }
        </span>

        {
          !isUpdateMode && (
            <span className='summary-list__value'>{bookingOption.name}</span>
          )
        }
      </div>

      {
        isUpdateMode && (
          <>
            <div className='sub-block booking-option-update-item'>
              <label>옵션 선택 :</label>

              <span className='selectbox is-small booking-option-select'>
                <select className='select'
                  tabIndex='0'
                  value={updatedOption}
                  onChange={e => setUpdatedOption(e.target.value)}>
                  {
                    bookingOptions.map(option => (
                      <option value={option.id} key={option.id}>{option.name}</option>
                    ))
                  }
                </select>
              </span>
            </div>

            <div className='sub-block booking-option-update-item'>
              <label>인원 선택 (본인포함) :</label>

              <span className='selectbox is-small booking-option-select'>
                <select className='select'
                  tabIndex='0'
                  value={updatedNumAttendee}
                  onChange={e => setUpdatedValue(parseInt(e.target.value))}>
                  {
                    numAttendeeOptions.map(num => (
                      <option value={num} key={num}>{num}</option>
                    ))
                  }
                </select>
              </span>
            </div>

            <div className='sub-block price-difference'>
              <label>변경 상담료:</label>

              <span className='price-change'>
                <span className='current-price'>100,000</span>
                <i className='icon-arrow-right'></i>
                <span className='new-price'>150,000</span>
              </span>
            </div>
          </>
        )
      }
    </div>
  )
}

export default React.memo(BookingOptionRow)
