import React from 'react'
import ReactCalendar from 'react-calendar'
import dayjs from 'dayjs'
import { addDaysToDate } from '@utils'

// [ reference: wiki-page for react-calendar ] - https://github.com/wojtekmaj/react-calendar/wiki/Recipes

import './Calendar.scss'

const dayFormatter = (locale, date) => dayjs(date).format('DD')

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
      formatDay={dayFormatter}
      minDetail='year' />
  )
}
