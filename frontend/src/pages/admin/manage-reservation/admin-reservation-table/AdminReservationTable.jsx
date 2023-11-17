import React, { useState, useEffect, useMemo } from 'react'
import {
  classNames as cn,
  numericDateToString,
  humanDate
} from '@utils'
import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD } from '@view-data/constants.js'

import './AdminReservationTable.scss'

// helpers
const displayDate = date => {
  const dateStr = numericDateToString(date)
  return humanDate(dateStr, { month: 'short', day: 'numeric', year: 'numeric' })
}
const combineDateAndTime = entry => (
  <>
    <span>{displayDate(entry.counselDate)}</span>
    <span className='text-color-magenta ml-4'>{entry.timeSlot}</span>
  </>
)
const combineDateAndTimeSearchable = entry => {
  return `${displayDate(entry.counselDate)}__${entry.timeSlot}`
}
const getName = entry => {
  const { name, numAttendee } = entry.personalDetails

  return name + (numAttendee >= 2 ? ` 외${numAttendee - 1}명`: '')
}
const getCounselTypeName = entry => bookingOptions.find(x => x.id === entry.optionId)?.name || ''
const getCounselMethodName = entry => COUNSEL_METHOD.find(x => x.value === entry.personalDetails.method).name || ''
const transformListEntry = entry => {
  const r = {
    dateAndTime: combineDateAndTime(entry),
    name: getName(entry),
    counselType: getCounselTypeName(entry),
    methodName: getCounselMethodName(entry),
    id: entry._id
  }

  r.searchable = `${combineDateAndTimeSearchable(entry)}__${r.name}__${r.counselType}__${r.methodName}`
  return r
}

function AdminReservationTable ({
  list,
  classes = '',
  emptyMessage = '보여줄 데이터가 없습니다.'
}) {
  // local-state
  const [search, setSearch] = useState('')

  // computed state
  const dataToDisplay = useMemo(
    () => {
      if (!list) { return [] }

      return list.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))
    }, [list, search]
  )

  // effects
  useEffect(() => {

  }, [])

  // methods
  const onItemClick = (entry) => {
    alert(`clicked a reservation item with the id - ${entry.id}`)
  }

  if (!list || list.length === 0) {
    return (
      <div className='admin-reservation-table'>
        <p className='admin-no-data'>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('admin-reservation-table', classes)}>
      <div className='admin-reservation-table__search-and-filter'>
        <div className='input-with-pre-icon admin-reservation-table__search-input'>
          <i className='icon-search pre-icon'></i>

          <input className='input'
            type='text'
            value={search}
            onInput={e => setSearch(e.target.value)} />
        </div>
      </div>

      {
        dataToDisplay.length === 0
          ? <p className='admin-no-data mt-40'>검색/필터 결과가 없습니다.</p>
          : <>
              <div className='ilwol-table-container admin-reservation-table__table'>
                <div className='ilwol-table-inner'>
                  <table className='ilwol-table'>
                    <thead>
                      <tr>
                        <th className='th-counsel-time'>날짜/시간</th>
                        <th className='th-name'>이름</th>
                        <th className='th-counsel-type'>상담 종류</th>
                        <th className='th-counsel-method'>상담 방식</th>
                        <th className='th-action'></th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        dataToDisplay.map((entry) => {
                          return (
                            <tr key={entry.id}>
                              <td className='td-counsel-time'>{entry.dateAndTime}</td>
                              <td className='td-name' onClick={() => onItemClick(entry)}>{entry.name}</td>
                              <td className='td-counsel-type'>{entry.counselType}</td>
                              <td className='td-counsel-method'>{entry.methodName}</td>
                              <td className='td-action'>
                                <button className='is-secondary is-table-btn'
                                  onClick={() => onItemClick(entry)}>보기</button>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </>
      }
    </div>
  )
}

export default React.memo(AdminReservationTable)