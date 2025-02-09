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
  const newTotalPrice = useMemo(
    () => computeReservationTotalPrice(updatedOption, updatedNumAttendee),
    [updatedNumAttendee, updatedOption]
  )
  const enableUpdateBtn = useMemo(
    () => {
      if (!isUpdateMode) { return false }

      return updatedOption === currentOptionId
        ? updatedNumAttendee !== currentNumAttendee
        : true
    },
    [isUpdateMode, updatedOption, updatedNumAttendee, currentOptionId, currentNumAttendee]
  )

  // methods
  const toggleUpdateMode = (e) => {
    e.stopPropagation()

    setIsUpdateMode(v => !v)
    setUpdatedOption(currentOptionId)
    setUpdatedNumAttendee(currentNumAttendee)
  }

  const onOptionSelect = (e) => {
    const selectedVal = e.target.value
    setUpdatedOption(selectedVal)

    // Automatically set the numAttendee select value
    if (numAttendeeOptionMap[selectedVal]) {
      setUpdatedNumAttendee(
        // if the selected cousel-option is the same as the current option then, reset the numAttendee to the current value too.
        // Otherwise, defaults to the minimum value.
        selectedVal === currentOptionId ? currentNumAttendee : numAttendeeOptionMap[selectedVal][0]
      )
    } else if (selectedVal === 'individual-counsel') {
      setUpdatedNumAttendee(1)
    }
  }

  const submitHandler = async () => {
    if (!window.confirm('상담 옵션을 변경하시겠습니까?')) { return }

    try {
      const result = await updateBookingOption({
        id: reservationId,
        updates: {
          optionId: updatedOption,
          numAttendee: updatedNumAttendee
        },
        type: 'counsel-option'
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '변경 완료!',
        content: '상담 옵션이 변경되었습니다.'
      })
      onUpdateSuccess()
    } catch (err) {
      console.error('BookingOptionRow.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '변경 에러',
        content: '요청 처리중 오류가 발생하였습니다.'
      })

      setUpdatedOption(currentOptionId)
      setUpdatedNumAttendee(currentNumAttendee)
    } finally {
      setIsUpdateMode(false)
    }
  }

  // effects
  useEffect(() => {
    onUpdateModeChange && onUpdateModeChange(isUpdateMode ? rowId : null)
  }, [isUpdateMode])

  if (!bookingOption) { return null }

  return (
    <div className='summary-list__item has-sub-block is-compact'>
      <div className='sub-block'>
        <span className='summary-list__label'>
          <span>상담 옵션</span>
          {
            (!disableUpdate && !isUpdateMode) && (
              <button className='is-small is-secondary modify-btn'
                type='button'
                onClick={toggleUpdateMode}>변경</button>
            )
          }
        </span>

        {
          isUpdateMode ? (
            <span className='summary-list__value'>
              <button className='is-small is-secondary modify-btn'
                type='button'
                disabled={isUpdating}
                onClick={toggleUpdateMode}>뒤로</button>

              <StateButton classes='is-small update-btn is-in-label'
                type='button'
                disabled={!enableUpdateBtn}
                onClick={submitHandler}
                displayLoader={isUpdating}
              >수정하기</StateButton>
            </span>
          ) : (
            <span className='summary-list__value'>{bookingOption.name}</span>
          )
        }
      </div>

      {
        isUpdateMode && (
          <>
            <div className='sub-block booking-option-update-item has-top-border'>
              <label>옵션 선택 :</label>

              <span className='selectbox is-small booking-option-select'>
                <select className='select'
                  tabIndex='0'
                  value={updatedOption}
                  onChange={onOptionSelect}>
                  {
                    bookingOptions.map(option => (
                      <option value={option.id} key={option.id}>{option.name}</option>
                    ))
                  }
                </select>
              </span>
            </div>

            {
              Array.isArray(numAttendeeOptions) && (
                <div className='sub-block booking-option-update-item'>
                  <label>총 인원 선택
                    { updatedOption === 'family-counsel' ? ' :' : <span> (본인포함):</span> }
                  </label>

                  <span className='selectbox is-small booking-option-select'>
                    <select className='select'
                      tabIndex='0'
                      value={updatedNumAttendee}
                      onChange={e => setUpdatedNumAttendee(parseInt(e.target.value))}>
                      {
                        numAttendeeOptions.map(num => (
                          <option value={num} key={num}>{num}</option>
                        ))
                      }
                    </select>
                  </span>
                </div>
              )
            }

            {
              currentTotalPrice !== newTotalPrice && (
                <div className='sub-block price-difference'>
                  <label>변경 상담료:</label>

                  <span className='price-change'>
                    <span className='current-price'>{priceDisplay(currentTotalPrice)}</span>
                    <i className='icon-arrow-right'></i>
                    <span className='new-price'>{priceDisplay(newTotalPrice)}</span>
                  </span>
                </div>
              )
            }
          </>
        )
      }
    </div>
  )
}

export default React.memo(BookingOptionRow)
