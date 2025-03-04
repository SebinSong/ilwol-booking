import React, { useState, useMemo, useEffect, useCallback } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import ReservationHistoryTable from './ReservationHistoryTable.jsx'
import Modal from '@components/modal/Modal.jsx'
import Checkbox from '@components/checkbox/Checkbox.jsx'
import TableNavigation from '@components/table-navigation/TableNavigation.jsx'
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
  cloneDeep,
  debounce,
  getStatusName
} from '@utils'

// css
import './AdminReservationHistory.scss'

// helpers
const filterTypesList = () => ['pending', 'confirmed', 'cancelled', 'on-site-payment']
const displayDate = date => {
  const dateStr = numericDateToString(date)
  return humanDate(dateStr, { month: 'short', day: 'numeric', year: 'numeric' })
}
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
const getCounselMethodName = entry => COUNSEL_METHOD.find(x => x.value === entry.personalDetails.method).name || ''
const getDateAndTime = entry => `${entry.counselDate ? numericDateToString(entry.counselDate): ''} ${entry.timeSlot || ''}`
const combineDateAndTimeSearchable = entry => {
  return `${displayDate(entry.counselDate)}__${entry.timeSlot}`
}
const transformListEntry = entry => {
  const r = {
    name: getName(entry),
    contact: getContact(entry),
    counselType: getCounselTypeName(entry),
    dateAndTime: getDateAndTime(entry),
    methodName: getCounselMethodName(entry),
    status: entry.status === 'on-site-payment' ? '현지' : getStatusName(entry.status, true),
    statusRaw: entry.status || '',
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
const sortTypeList = [
  { id: 'created-date', name: '생성날짜순', value: 'created-date' },
  { id: 'booking-date', name: '예약날짜순', value: 'booking-date' },
]
const getSortFunc = (type = 'created-date') => {
  return ({
    'created-date': (a,b) => {
      return a.createdDateMil === 0 && b.createdDateMil === 0
        ? (b.data.counselDate + parseInt(b.data.timeSlot)) - (a.data.counselDate + parseInt(a.data.timeSlot))
        : b.createdDateMil - a.createdDateMil
    },
    'booking-date': (a,b) => {
      return b.data.counselDate === a.data.counselDate
        ? parseInt(b.data.timeSlot) -  parseInt(a.data.timeSlot)
        : b.data.counselDate - a.data.counselDate
    }
  })[type]
}

export default function AdminReservationHistory () {
  // local-state
  const {
    data, isLoading, isError
  } = useGetArchivedReservations()
  const [preSortedData, setPreSortedData] = useState(null)
  const [sortType, setSortType] = useState('created-date')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(filterTypesList())

  // table-navigation related
  const [tableIndex, setTableIndex] = useState(0)
  const [tableUnit, setTableUnit] = useState(30)

  // computed state
  const filteredAndSortedData = useMemo(
    () => {
      if (!preSortedData) { return [] }

      const list = preSortedData[sortType]
      return list
        .filter(entry => entry.searchable.includes(search.trim()))
        .filter(entry => statusFilter.includes(entry.data.status))
    },
    [preSortedData, search, statusFilter, sortType]
  )

  const dataToDisplay = useMemo(
    () => {
      if (!filteredAndSortedData?.length) { return [] }

      const sliceStart = tableUnit * tableIndex
      const sliced = filteredAndSortedData.slice(sliceStart, sliceStart + tableUnit)
      return sliced
    }, [filteredAndSortedData, tableUnit, tableIndex]
  )

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
  const toggleConfirmed = useCallback(() => {
    toggleStatusFilter('confirmed')
  }, [])
  const toggleOnSitePayment = useCallback(() => {
    toggleStatusFilter('on-site-payment')
  }, [])
  const togglePending = useCallback(() => {
    toggleStatusFilter('pending')
  }, [])
  const toggleCancelled = useCallback(() => {
    toggleStatusFilter('cancelled')
  }, [])
  const setAllStatus = () => {
    setStatusFilter(filterTypesList())
  }
  const OnSearchInputDebounced = useCallback(
    debounce((e) => {
      setSearch(e.target.value)
    }, 300),
    []
  )

  // effects
  useEffect(() => {
    if (data?.length) {
      const allTransformed = data.map(transformListEntry)

      setPreSortedData({
        'created-date': cloneDeep(allTransformed).sort(getSortFunc('created-date')),
        'booking-date': cloneDeep(allTransformed).sort(getSortFunc('booking-date'))
      })
    }
  }, [data])

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
                    <div className='history-filters-container'>
                    <span className='slight-section-title'>테이블 정렬/필터</span>

                      <div className='filter-line'>
                        <span className='filter-label'>정렬: </span>
                        <div className='filter-content'>
                          <span className='selectbox is-small sort-select-el'>
                            <select className='select'
                              tabIndex='0'
                              value={sortType}
                              data-vkey='table-sort'
                              onChange={e => setSortType(e.target.value)}>
                              {
                                sortTypeList.map(entry => (
                                  <option value={entry.value} key={entry.id}>{entry.name}</option>
                                ))
                              }
                            </select>
                          </span>
                        </div>
                      </div>

                      <div className='filter-line'>
                        <span className='filter-label'>상태 필터: </span>

                        <div className='filter-content status-filter-content'>
                          <Checkbox classes='status-filter-checkbox'
                            value={statusFilter.includes('confirmed')}
                            onChange={toggleConfirmed} 
                            text='확정' />
                          <Checkbox classes='status-filter-checkbox'
                            value={statusFilter.includes('on-site-payment')}
                            onChange={toggleOnSitePayment} 
                            text='현지' />
                          <Checkbox classes='status-filter-checkbox'
                            value={statusFilter.includes('pending')}
                            onChange={togglePending} 
                            text='대기' />
                          <Checkbox classes='status-filter-checkbox'
                            value={statusFilter.includes('cancelled')}
                            onChange={toggleCancelled} 
                            text='취소' />
                          <button className='is-secondary is-extra-small all-status-btn'
                            onClick={setAllStatus}>전체</button>
                        </div>
                      </div>
                    </div>

                    <div className='history-search-and-page-navigation'>
                      <div className='input-with-pre-icon is-small history-search-input'>
                        <i className='icon-search pre-icon'></i>

                        <input className='input'
                          type='text'
                          placeholder='이름/연락처/etc. 검색'
                          onInput={OnSearchInputDebounced} />
                      </div>

                      <TableNavigation classes='history-table-navigation'
                        value={tableIndex} unit={tableUnit} total={filteredAndSortedData?.length || 0}
                        onChange={setTableIndex}
                        onUnitChange={setTableUnit} />
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
