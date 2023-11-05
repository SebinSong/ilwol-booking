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
  fullyBookedDates = null,
  bookedDates =  null,
  allowMultiple = false
}) {
  const tomorrow = addDaysToDate(new Date(), 1)

  // methods
  const changeHandler = date => {
    onChange(stringifyDate(date))
  }
  const defineTileClassName = useCallback(
    ({ date }) => {
      const dateStr = stringifyDate(date)
      const arrayIncludes = (arr, val) => {
        return Array.isArray(arr) && arr.length && arr.includes(val)
      }

      if (arrayIncludes(fullyBookedDates, dateStr)) {
        console.log('@@@ full-booking date: ', dateStr)
      }
      return arrayIncludes(fullyBookedDates, dateStr)
        ? 'is-fully-booked'
        : arrayIncludes(bookedDates, dateStr)
          ? 'has-booking'
          : allowMultiple && arrayIncludes(value, dateStr)
            ? 'is-multiple-selected'
            : null
    },
    [allowMultiple, bookedDates, fullyBookedDates, value]  
  )

  return (
    <ReactCalendar onChange={changeHandler}
      value={allowMultiple ? null : value}
      locale='ko'
      className={`ilwol-calendar ${classes}`}
      minDate={minDate || tomorrow}
      formatDay={dayFormatter}
      tileClassName={defineTileClassName}
      minDetail='decade' />
  )
}
