import React, { useState, useMemo } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import ReservationHistoryTable from './ReservationHistoryTable.jsx'

// hooks
import { useGetArchivedReservations } from '@store/features/adminApiSlice.js'

// utils
import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD } from '@view-data/constants.js'
import {
  classNames as cn,
  numericDateToString,
  humanDate
} from '@utils'

// css
import './AdminReservationHistory.scss'

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
const getName = entry => {
  const { name, numAttendee } = entry.personalDetails

  return name + (numAttendee >= 2 ? ` 외${numAttendee - 1}명`: '')
}
const getCounselTypeName = entry => {
  return entry.optionId === 'admin-generated'
    ? '관리자생성 아이템'
    : bookingOptions.find(x => x.id === entry.optionId)?.name || ''
}
const getStatusName = (entry) => {
  return ({
    'confirmed': '확정',
    'cancelled': '취소',
    'pending': '대기'
  })[entry.status] || ''
}
const getStatus = (entry) => {
  const status = entry.status
  if (!status) { return null }

  const nameMap = {
    'confirmed': '확정',
    'cancelled': '취소',
    'pending': '대기'
  }

  const classMap = {
    'pending': 'text-bg-validation',
    'confirmed': 'text-bg-success',
    'cancelled': 'text-bg-warning'
  }

  return <span className={cn('status-pill', classMap[status])}>{nameMap[status]}</span>
}
const getCounselMethodName = entry => COUNSEL_METHOD.find(x => x.value === entry.personalDetails.method).name || ''
const combineDateAndTimeSearchable = entry => {
  return `${displayDate(entry.counselDate)}__${entry.timeSlot}`
}
const transformListEntry = entry => {
  const r = {
    dateAndTime: combineDateAndTime(entry),
    name: getName(entry),
    status: getStatus(entry),
    counselType: getCounselTypeName(entry),
    methodName: getCounselMethodName(entry),
    id: entry._id
  }

  r.searchable = `${combineDateAndTimeSearchable(entry)}__${r.name}__${r.counselType}__${r.methodName}`
  return r
}

export default function AdminReservationHistory () {
  // local-state
  const {
    data, isLoading, isError
  } = useGetArchivedReservations()
  const [search, setSearch] = useState('')

  // computed state
  const dataToDisplay = useMemo(
    () => {
      if (!data?.length) { return [] }
  
      return data.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))
    }, [data, search]
  )

  // computed state
  const feedbackEl = useMemo(
    () => {
      const content = isLoading
      ? <TextLoader>예약 데이터 로딩중..</TextLoader>
      : isError
        ? <Feedback type='error'
            showError={true}
            hideCloseBtn={true} 
            message='과거 예약 데이터 로드중 오류가 발생했습니다.' />
        : null

      return content ? <div className='admin-feedback-container'>{content}</div> : null
    }, [isLoading, isError]
  )

  return (
    <AdminPageTemplate classes='page-admin-reservation-history'>
      <div className='admin-reservation-history-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-bulleted-list is-prefix'></i>
          <span>지난 예약 보기</span>
        </h2>

        <p className='admin-page-description'>지난 예약 아이템들을 조회할 수 있습니다.</p>

        <div className='admin-reservation-history__content'>
          {
            feedbackEl || (
              data?.length > 0
                ? <>
                    <ReservationHistoryTable classes='history-table' data={dataToDisplay} />
                  </>
                : <p className='helper info'>로드된 데이터가 없습니다.</p>
            )
          }
        </div>
      </div>
    </AdminPageTemplate>
  )
}
