import React, { useRef, useState, useMemo, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { DEFAULT_TIME_SLOTS } from '@view-data/constants.js'

// components
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import StateButton from '@components/state-button/StateButton'

// hooks
import {
  useGetReservationStatus,
  useUpdateReservationDetailsByCustomer
} from '@store/features/reservationApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'
import { useGetFutureDayoffs } from '@store/features/adminApiSlice.js'

// utils
import {
  checkDateAndTimeAvailable,
  humanDate
} from '@utils'

import './UpdateReservationSchedule.scss'

function UpdateReservationSchedule ({
  classes = '',
  isOverseasOption = false,
  initialDate = null,
  initialTimeSlot = '',
  onBackClick = () => {},
  onUpdateSuccess = () => {}
}) {
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

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
  const [updateReservationSchedule, {
    isLoading: isUpdatingReservationSchedule,
    isError: isReservationScheduleError,
    error: reservationScheduleError
  }] = useUpdateReservationDetailsByCustomer()
  const [disabledDates, setDisabledDates] = useState(null)
  const [reservedDays, setReservedDays] = useState({})
  const [date, setDate] = useState(initialDate)
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot)
  const [updateError, setUpdateError] = useState('')
  const rootEl = useRef(null)

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
          ? <Feedback type='error'
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
    const dateHuman = humanDate(date, { month: 'short', day: 'numeric', year: 'numeric' })
    if (!window.confirm(
      `상담 일정 변경을 진행하시겠습니까? (변경 후 일정: ${dateHuman}, ${timeSlot})`)
    ) { return }

    try {
      await checkDateAndTimeAvailable(date, timeSlot)
      const res = await updateReservationSchedule({
        id: reservationId,
        updates: { counselDate: date, timeSlot },
        type: 'schedule'
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '업데이트 완료!',
        content: '예약 날짜/시간이 성공적으로 수정되었습니다.'
      })
      onUpdateSuccess()
    } catch (err) {
      setUpdateError(err?.message || err?.data?.message)
    }
  }

  const onCalendarSelect = val => {
    setDate(val)
    setTimeSlot('')
  }

  // effects
  useEffect(() => {
    loadData()

    if (rootEl?.current) {
      rootEl.current.scrollIntoView({
        block: 'center',
        inline: "nearest"
      })
    }
  }, [])

  return (
    <div ref={rootEl} className={`update-reservation-schedule-container page-form-constraints ${classes}`}>
      {
        feedbackEl
          ? <div className='update-feedback-container'>{ feedbackEl }</div>
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
