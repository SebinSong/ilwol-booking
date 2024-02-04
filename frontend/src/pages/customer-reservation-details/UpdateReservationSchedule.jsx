import React, { useState, useMemo, useEffect } from 'react'
import { DEFAULT_TIME_SLOTS } from '@view-data/constants.js'

// components
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import StateButton from '@components/state-button/StateButton'

// hooks
import { useGetReservationStatus } from '@store/features/reservationApiSlice.js'
import { useGetFutureDayoffs } from '@store/features/adminApiSlice.js'

import './UpdateReservationSchedule.scss'

function UpdateReservationSchedule ({
  classes = '',
  isOverseasOption = false,
  initialDate = null,
  initialTimeSlot = '',
  onBackClick = () => {}
}) {
  // local-state
  const [getReservationStatus, {
    isLoading: isLoadingReservationData,
    isError: isReservationDataError,
    error: reservationDataError
  }] = useGetReservationStatus()
  const [getFutureDayoffs, {
    isLoading: isDayoffsLoading,
    isError: dayoffsError
  }] = useGetFutureDayoffs()
  const [disabledDates, setDisabledDates] = useState(null)
  const [reservedDays, setReservedDays] = useState({})
  const [date, setDate] = useState(initialDate)
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot)

  /// computed state
  const occupiedTimeSlots = useMemo(
    () => {
      const arrToUse = reservedDays && date ? reservedDays[date] || [] : []

      return initialTimeSlot
        ? arrToUse.filter(v => v !== initialTimeSlot)
        : arrToUse
    },
    [date, reservedDays]
  )
  const feedbackEl = useMemo(
    () => {
      return (isLoadingReservationData || isDayoffsLoading)
        ? <TextLoader>예약 데이터 로딩 중...</TextLoader>
        : (isReservationDataError || dayoffsError)
          ? <Feedback type='error' classes='mt-20'
              showError={true}
              hideCloseBtn={true}
              message='데이터 로드 중 오류가 발생하였습니다.' />
          : null
    },
    [isLoadingReservationData, isDayoffsLoading, isReservationDataError, dayoffsError]
  )
  const disableSubmitBtn = useMemo(
    () => !date || !timeSlot || (date === initialDate && timeSlot === initialTimeSlot),
    [date, timeSlot]
  )

  // methods
  const loadData = async () => {
    const [responseData, dayoffsData] = await Promise.all([
      getReservationStatus().unwrap(),
      getFutureDayoffs().unwrap()
    ])
    const { reserved = null, fullyBooked = null } = responseData || {}

    reserved && setReservedDays(reserved)
    setDisabledDates([
      ...(fullyBooked || []),
      ...(dayoffsData || [])
    ])
  }

  const submitHandler = async () => {
    if (!window.confirm(`상담 일정 변경을 진행하시겠습니까? (변경 내역: ${date}, ${timeSlot})`)) { return }
  }

  const onCalendarSelect = val => {
    setDate(val)
    setTimeSlot('')
  }

  // effects
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className={`update-reservation-schedule-container ${classes}`}>
      {
        feedbackEl
          ? <div className='feedback-container'>{ feedbackEl }</div>
          : <div className='form-field select-date-time-container'>
              <span className='label mb-10'>날짜/시간 변경</span>
      
              <div className='calendar-container'>
                <Calendar onChange={onCalendarSelect}
                  fullyBookedDates={disabledDates}
                  value={date} />
              </div>
      
              {
                Boolean(date) &&
                <div className='time-selection-container mt-30'>
                  <TimeSlot classes='time-slot'
                    slotList={DEFAULT_TIME_SLOTS}
                    value={timeSlot}
                    occupiedSlots={occupiedTimeSlots}
                    onSelect={setTimeSlot}
                    isOverseasOption={isOverseasOption} />
                </div>
              }

              <div className='buttons-container is-row mt-30 mb-0'>
                <button className='is-secondary' type='button'
                  onClick={onBackClick}>
                  <i className='icon-chevron-left-circle is-prefix'></i>
                  <span>뒤로가기</span>
                </button>

                <StateButton classes='is-primary' type='button'
                  disabled={disableSubmitBtn}
                  onClick={submitHandler}
                >변경하기</StateButton>
              </div>
            </div>
      }
    </div>
  )
}

export default React.memo(UpdateReservationSchedule)
