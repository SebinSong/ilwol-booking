import React, { useState, useMemo } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import ReservationHistoryTable from './ReservationHistoryTable.jsx'
import Modal from '@components/modal/Modal.jsx'

// hooks
import { useGetArchivedReservations } from '@store/features/adminApiSlice.js'

// utils
import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD } from '@view-data/constants.js'
import {
  classNames as cn,
  numericDateToString,
  humanDate,
  humanDateWithTime,
  cloneDeep
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
const getContact = entry => {
  const pd = entry.personalDetails || {}

  if (pd?.mobile?.number) {
    return `${pd.mobile.prefix}${pd.mobile.number}`
  } else { return 'N/A' }
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
    contact: getContact(entry),
    status: getStatus(entry),
    counselType: getCounselTypeName(entry),
    methodName: getCounselMethodName(entry),
    createdDate: entry.originalCreatedAt
      ? humanDateWithTime(entry.originalCreatedAt)
      : 'N/A',
    createdDateMil: entry.originalCreatedAt
      ? new Date(entry.originalCreatedAt).getTime()
      : 0,
    id: entry._id,
    data: cloneDeep(entry)
  }

  r.searchable = `${combineDateAndTimeSearchable(entry)}__${r.name}__${r.contact}`
  return r
}
const getSortFunc = (type = 'created-date') => {
  return ({
    'created-date': (a,b) => {
      return a.createdDateMil === 0 && b.createdDateMil === 0
        ? (b.data.counselDate + parseInt(b.data.timeSlot)) - (a.data.counselDate + parseInt(a.data.timeSlot))
        : b.createdDateMil - a.createdDateMil
    }
  })[type]
}

export default function AdminReservationHistory () {
  // local-state
  const {
    data, isLoading, isError
  } = useGetArchivedReservations()
  const [sortType, setSortType] = useState('created-date')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(['pending', 'confirmed', 'cancelled'])

  // computed state
  const dataToDisplay = useMemo(
    () => {
      if (!data?.length) { return [] }
      
      const list = data.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))
        .filter(entry => statusFilter.includes(entry.data.status))

      const sortFunc = getSortFunc(sortType)
      list.sort(sortFunc)

      return list
    }, [data, search, statusFilter, sortType]
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

  // methods
  const toggleStatusFilter = (value) => {
    setStatusFilter(current => {
      return current.includes(value)
        ? current.filter(x => x !== value)
        : [ ...current, value ]
    })
  }

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
                    <div className='history-filters-container mb-10'>
                      <div className='history-filter-line'>
                        <span className='history-filter-label has-text-bold'>상태 필터:</span>
                        <div className='cta-containers'>
                          <span tabIndex='0'
                            onClick={() => toggleStatusFilter('pending')}
                            className={cn('status-pill text-bg-validation status-filter-item', statusFilter.includes('pending') && 'is-active')}
                          >대기</span>
                          <span tabIndex='0'
                            onClick={() => toggleStatusFilter('confirmed')}
                            className={cn('status-pill text-bg-success status-filter-item', statusFilter.includes('confirmed') && 'is-active')}
                          >확정</span>
                          <span tabIndex='0'
                            onClick={() => toggleStatusFilter('cancelled')}
                            className={cn('status-pill text-bg-warning status-filter-item', statusFilter.includes('cancelled') && 'is-active')}
                          >취소</span>
                        </div>
                      </div>
                    </div>
                    <div className='history-search-and-page-navigation mb-20'>
                      <div className='input-with-pre-icon is-small history-search-input'>
                        <i className='icon-search pre-icon'></i>

                        <input className='input'
                          type='text'
                          value={search}
                          placeholder='이름/연락처/etc. 검색'
                          onInput={e => setSearch(e.target.value)} />
                      </div>
                    </div>
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
