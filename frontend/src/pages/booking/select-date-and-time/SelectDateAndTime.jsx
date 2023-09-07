import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import { DEFAULT_TIME_SLOTS } from '@view-data/constants.js'
import {
  addCounselDate,
  addCounselTimeSlot
} from '@store/features/counselDetailsSlice.js'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'

import './SelectDateAndTime.scss'

export default function SelectDateAndTime () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // local-state
  const {
    counselDateInStore,
    counselTimeSlotInStore,
    checkStepStateAndGo
  } = useCounselOptionSteps()

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
      alert(JSON.stringify(err))
    }
  }

  const backToPreviousStep = () => {
    navigate('/booking/counsel-option')
  }

  // effects
  useEffect(() => {
    checkStepStateAndGo('counsel-option')
  }, [])

  return (
    <div className='select-date-and-time'>
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
