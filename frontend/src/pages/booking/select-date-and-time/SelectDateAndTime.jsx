import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { DEFAULT_TIME_SLOTS } from '@view-data/constants.js'
import { ToastContext } from '@hooks/useToast.js'

// components
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'

// hooks
import { addCounselDate, addCounselTimeSlot } from '@store/features/counselDetailsSlice.js'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'
import { useGetReservationStatus } from '@store/features/reservationApiSlice.js'

import './SelectDateAndTime.scss'

export default function SelectDateAndTime () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const {
    counselDateInStore,
    counselTimeSlotInStore,
    checkStepStateAndGo
  } = useCounselOptionSteps()

  const [getReservationStatus, {
    isLoading,
    isError,
    error
  }] = useGetReservationStatus()

  const [reservedDays, setReservedDays] = useState(null)
  const [dayoffs, setDayoffs] = useState(null)
  const [date, setDate] = useState(counselDateInStore ? new Date(counselDateInStore) : null)
  const [timeSlot, setTimeSlot] = useState(counselTimeSlotInStore || '')

  // computed-state
  const enableContinueBtn = Boolean(date) && Boolean(timeSlot)

  // methods
  const onContinueClick = () => {
    try {
      dispatch(addCounselDate({ date }))
      dispatch(addCounselTimeSlot(timeSlot))
      navigate('/booking/personal-details')
    } catch (err) {
      console.error('error: ', err)
      addToastItem({
        type: 'warning',
        heading: '에러 발생!',
        content: err?.message || '예기치 못한 이슈가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  const loadData = async () => {
    const responseData = await getReservationStatus().unwrap()

    const { offs = null, reserved = null } = responseData || {}
    
    offs && setDayoffs(offs)
    reserved && setReservedDays(reserved)
  }

  const backToPreviousStep = () => {
    navigate('/booking/counsel-option')
  }

  // effects
  useEffect(() => {
    checkStepStateAndGo('counsel-option')
    loadData()
  }, [])

  const feedbackEl = isLoading
    ? <TextLoader>예약 데이터 로딩 중...</TextLoader>
    : isError
      ? <Feedback type='error' classes='mt-20'
          showError={true}
          hideCloseBtn={true}
          message='데이터 로드 중 오류가 발생하였습니다.' />
      : null

  if (feedbackEl) {
    return (
      <div className='page-form-constraints select-date-and-time'>
        <div className='feedback-container'>
          { feedbackEl }
        </div>
      </div>
    )
  }

  return (
    <div className='page-form-constraints select-date-and-time'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>날짜/시간 선택</span>
      </h3>


      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>

      {
        Boolean(date) &&
        <div className='time-selection-container'>
          <TimeSlot classes='time-slot'
            slotList={DEFAULT_TIME_SLOTS}
            value={timeSlot}
            onSelect={setTimeSlot} />
        </div>
      }

      <div className='buttons-container is-row mt-60'>
        <button type='button'
          className='is-secondary back-btn'
          onClick={backToPreviousStep}>
          뒤로 가기
        </button>

        <button type='button'
          className='is-primary continue-btn'
          disabled={!enableContinueBtn}
          onClick={onContinueClick}>
          다음
        </button>
      </div>
    </div>
  )
}
