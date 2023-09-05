import React, { useState } from 'react'
import Calendar from '@components/calendar/Calendar'

import './SelectDateAndTime.scss'

export default function SelectDateAndTime () {
  // local-state
  const [date, setDate] = useState(new Date())

  return (
    <div className='select-date-and-time'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>날짜/시간 선택</span>
      </h3>

      <div className='calendar-container'>
        <Calendar onChange={setDate} value={date} />
      </div>
    </div>
  )
}
