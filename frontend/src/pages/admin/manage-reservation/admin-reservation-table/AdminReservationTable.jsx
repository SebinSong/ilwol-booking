import React from 'react'
import {
  classNames as cn,
  numericDateToString
} from '@utils'
import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD } from '@view-data/constants.js'
// hooks
import useMq from '@hooks/useMediaQuery.js'

import './AdminReservationTable.scss'

// helpers
const combineDateAndTime = entry => `${numericDateToString(entry.counselDate)} ${entry.timeSlot}`
const getName = entry => {
  const { name, numAttendee } = entry.personalDetails

  return name + (numAttendee >= 2 ? ` 외${numAttendee - 1}명`: '')
}
const getCounselTypeName = entry => bookingOptions.find(x => x.id === entry.optionId)?.name || ''
const getCounselMethodName = entry => COUNSEL_METHOD.find(x => x.value === entry.personalDetails.method).name || ''

function AdminReservationTable ({ list, classes = '' }) {

  if (!list) {
    return <p>보여줄 데이터가 없습니다.</p>
  }

  return (
    <div className={cn('ilwol-table-container admin-reservation-table', classes)}>
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
              list.map((entry) => {
                return (
                  <tr key={entry.searchable || entry._id}>
                    <td className='td-counsel-time'>{combineDateAndTime(entry)}</td>
                    <td className='td-name'>{getName(entry)}</td>
                    <td className='td-counsel-type'>{getCounselTypeName(entry)}</td>
                    <td className='td-counsel-method'>{getCounselMethodName(entry)}</td>
                    <td className='td-action'>
                      <button className='is-secondary is-table-btn'>보기</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default React.memo(AdminReservationTable)