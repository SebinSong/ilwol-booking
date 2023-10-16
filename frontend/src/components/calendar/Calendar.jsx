import React, { useCallback } from 'react'
import ReactCalendar from 'react-calendar'
import dayjs from 'dayjs'
import { addDaysToDate } from '@utils'

// [ reference: wiki-page for react-calendar ] - https://github.com/wojtekmaj/react-calendar/wiki/Recipes

import './Calendar.scss'

const dayFormatter = (locale, date) => dayjs(date).format('DD')
const stringifyDate = date => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = ('0' + (1 + d.getMonth())).slice(-2)
  const day = ('0' + d.getDate()).slice(-2)

  return `${year}-${month}-${day}`
}

export default function Calendar ({
  value = null,
  onChange = () => {},
  classes = '',
  minDate = null,
  allowMultiple = false
}) {
  const tomorrow = addDaysToDate(new Date(), 1)

  // methods
  const changeHandler = date => {
    onChange(stringifyDate(date))
  }
  const defineTileClassName = useCallback(
    ({ date }) => {
      if (!allowMultiple) { return null }

      return Array.isArray(value) && value.includes(stringifyDate(date))
        ? 'is-multiple-selected'
        : null
    }, [allowMultiple, value]  
  )

  return (
    <ReactCalendar onChange={changeHandler}
      value={value}
      locale='ko'
      className={`ilwol-calendar ${classes}`}
      minDate={minDate || tomorrow}
      formatDay={dayFormatter}
      tileClassName={defineTileClassName}
      minDetail='decade' />
  )
}
