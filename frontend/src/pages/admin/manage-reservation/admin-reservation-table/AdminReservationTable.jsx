import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  classNames as cn,
  numericDateToString,
  humanDate,
  getStatusName,
  getStatusClass
} from '@utils'
import bookingOptions from '@view-data/booking-options.js'
import { COUNSEL_METHOD } from '@view-data/constants.js'

// components
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import AccordionButton from '@components/accordion/accordion-button/AccordionButton'
import Checkbox from '@components/checkbox/Checkbox.jsx'

import './AdminReservationTable.scss'

// helpers
const displayDate = date => {
  const dateStr = numericDateToString(date)
  return humanDate(dateStr, { month: 'short', day: 'numeric', year: 'numeric' })
}
const combineDateAndTime = entry => (
  <>
    <span>{displayDate(entry.counselDate)}</span>
    <span className='text-color-purple ml-4'>{entry.timeSlot}</span>
  </>
)
const combineDateAndTimeSearchable = entry => {
  return `${displayDate(entry.counselDate)}__${entry.timeSlot}`
}
const getName = entry => {
  const { name, numAttendee } = entry.personalDetails
  const calendarMemo = entry?.calendarMemo ? `(${entry.calendarMemo})` : ''

  return name + (numAttendee >= 2 ? ` 외${numAttendee - 1}명`: '') + calendarMemo
}
const getMobileDisplay = entry => {
  const { mobile } = entry.personalDetails
  return mobile?.number
    ? `${mobile.prefix}${mobile.number}`
    : 'N/A'
}
const getCounselTypeName = entry => {
  return entry.optionId === 'admin-generated'
    ? '관리자생성 아이템'
    : bookingOptions.find(x => x.id === entry.optionId)?.name || ''
}
const getCounselMethodName = entry => COUNSEL_METHOD.find(x => x.value === entry.personalDetails.method).name || ''
const transformListEntry = entry => {
  const r = {
    dateAndTime: combineDateAndTime(entry),
    counselDateOriginal: entry.counselDate,
    name: getName(entry),
    mobileDisplay: getMobileDisplay(entry),
    counselType: getCounselTypeName(entry),
    methodName: getCounselMethodName(entry),
    createdDate: entry.createdAt ? humanDate(entry.createdAt, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
    createdDateOriginal: entry.createdAt,
    status: entry.status,
    id: entry._id
  }

  r.searchable = `${combineDateAndTimeSearchable(entry)}__${r.name}__${r.counselType}__${r.methodName}`
  return r
}

// sort & filter related
const sortTypeList = [
  { id: 'created-date', name: '생성날짜순', value: 'created-date' },
  { id: 'booking-date', name: '최근예약순', value: 'booking-date' },
]

// child component
function StatusTag ({ status }) {
  return (
    <span className={cn('status-tag inline-small-padding',getStatusClass(status))}>
      {getStatusName(status, true, true)}
    </span>
  )
}

function AdminReservationTable ({
  list,
  classes = '',
  emptyMessage = '보여줄 데이터가 없습니다.',
  toggleBtnType = 'default',
  toggleBtnText = '',
  children = null,
  showStatus = false,
  usetableSelection = false,
  onSelectionChange = () => {}
}) {
  const navigate = useNavigate()

  // local-state
  const [isDisplaying ,setIsDisplaying] = useState(true)
  const [search, setSearch] = useState('')
  const [sortType, setSortType] = useState('booking-date') // either 'created-date' or 'reservation-date'
  const [allSelected, setAllSelected] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])

  // computed state
  const noData = !list || list.length === 0
  const dataToDisplay = useMemo(
    () => {
      if (!list) { return [] }

      let listClone = list.map(transformListEntry)
        .filter(entry => entry.searchable.includes(search.trim()))

      if (sortType === 'created-date') {
        const ArrHasCreatedAt = listClone.filter(entry => Boolean(entry.createdDateOriginal))
        const ArrNoCreatedAt = listClone.filter(entry => !entry.createdDateOriginal)
        
        ArrHasCreatedAt.sort((a, b) => (new Date(b.createdDateOriginal).getTime() - new Date(a.createdDateOriginal).getTime()))
        ArrNoCreatedAt.sort((a, b) => (new Date(a.counselDateOriginal).getTime() - new Date(b.counselDateOriginal).getTime()))
        listClone = [ ...ArrHasCreatedAt, ...ArrNoCreatedAt ]
      } else {
        listClone.sort((a, b) => (a.counselDateOriginal - b.counselDateOriginal))
      }

      return listClone
    }, [list, search, sortType]
  )

  // effects
  useEffect(() => {
    onSelectionChange(selectedItems)
  }, [selectedItems])

  // methods
  const onItemClick = (entry) => {
    navigate(`/admin/manage-reservation-item/${entry.id}`)
  }
  const toggleTable = useCallback(
    (val) => { setIsDisplaying(val) }, []
  )
  const toggleAllCheckbox = useCallback(
    () => setAllSelected(v => {
      const newVal = !v

      setSelectedItems(
        newVal ? list.map(entry => entry._id) : []
      )
      return newVal
    }), [] 
  )
  const onItemCheckBoxClick = (targetId) => {
    setSelectedItems(idList => {
      return idList.includes(targetId)
        ? idList.filter(v => v !== targetId)
        : [...idList, targetId]
    })
  }


  return (
    <div className={cn('admin-reservation-table', classes)}>
      <AccordionButton classes='admin-reservation-table__toggle-btn'
        onToggle={toggleTable}
        initValue={true}
        type={toggleBtnType}>
        { `${toggleBtnText + (!noData ? ` (${list.length}건)` : '')}` || '예약 내역' }
      </AccordionButton>

      {
        noData
          ? isDisplaying && <p className='admin-no-data'>{emptyMessage}</p>
          : <div className={cn('admin-reservation-table__content', !isDisplaying && 'is-hidden')}>
              <div className='admin-reservation-table__search-and-filter'>
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
    
                <div className='input-with-pre-icon admin-reservation-table__search-input'>
                  <i className='icon-search pre-icon'></i>

                  <input className='input search-input-el'
                    type='text'
                    value={search}
                    placeholder='이름/날짜/etc. 검색'
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
                                {
                                  usetableSelection &&
                                  <th className='th-checkbox'>
                                    <Checkbox classes='table-checkbox'
                                      value={allSelected}
                                      onChange={toggleAllCheckbox} />
                                  </th>
                                }
                                <th className='th-created-at'>생성일자</th>
                                <th className='th-counsel-time'>상담 날짜/시간</th>
                                <th className='th-name'>이름</th>
                                <th className='th-mobile'>연락처</th>
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
                                      {
                                        usetableSelection &&
                                        <td className='td-checkbox'>
                                          <Checkbox classes='table-checkbox'
                                            value={selectedItems.includes(entry.id)}
                                            onChange={() => onItemCheckBoxClick(entry.id)} />
                                        </td>
                                      }
                                      <td className='td-created-at'>{entry.createdDate}</td>
                                      <td className='td-counsel-time'>{entry.dateAndTime}</td>
                                      <td className='td-name' onClick={() => onItemClick(entry)}>
                                        {
                                          showStatus && <StatusTag status={entry.status} />
                                        }
                                        <span>{entry.name}</span>
                                      </td>
                                      <td className='td-mobile'>
                                        {
                                          entry.mobileDisplay !== 'N/A'
                                            ? <CopyToClipboard classes='copy-contact'
                                                textToCopy={entry.mobileDisplay}>
                                                <span className='copy-contact-value'>{entry.mobileDisplay}</span>
                                              </CopyToClipboard>
                                            : entry.mobileDisplay
                                        }
                                      </td>
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

              {
                Boolean(children && dataToDisplay.length) &&
                <div className='admin-reservation-table__cta-container'>
                  {children}
                </div>
              }
            </div>
      }
    </div>
  )
}

export default React.memo(AdminReservationTable)