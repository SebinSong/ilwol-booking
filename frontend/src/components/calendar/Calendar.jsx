import React from 'react'
import ReactCalendar from 'react-calendar'
import { addDaysToDate } from '@utils'

import './Calendar.scss'

export default function Calendar ({
  value = null,
  onChange = () => {},
  classes = ''
}) {
  const today = new Date()
  const tomorrow = addDaysToDate(new Date(), 1)

  return (
    <ReactCalendar onChange={onChange}
      value={value}
      locale='ko'
      className={`ilwol-calendar ${classes}`}
      minDate={tomorrow}
      minDetail='year' />
  )
}
