import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo
} from 'react'
import { humanDate, compareArrays, classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import Calendar from '@components/calendar/Calendar'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import StateButton from '@components/state-button/StateButton'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import {
  useGetDetailedReservationStatus,
  useGetDayoffs,
  useUpdateDayoffs,
  flattenDayoffsData
} from '@store/features/adminApiSlice.js'

import './AdminDashboard.scss'

const legendList = [
  { color: 'magenta', text: '선택됨' },
  { color: 'success', text: '오늘' },
  { color: 'validation', text: '예약내역 있음' }
]

const NoDataToShow = () => (
  <div className='no-data-feedback'>
    <i className='icon-close-circle'></i>
    <span>데이터가 없습니다.</span>
  </div>
)

export default function AdminDashboard ({
  classes = ''
}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [dayOffs, setDayOffs] = useState([])
  const [selectedBookedDate, setSelectedBookedDate] = useState('')
  const [bookedDates, setBookedDates] = useState(null)
  const [getDetailedReservationStatus, {
    data: bookingData,
    isLoading: isLoadingStatus,
    isError: isStatusError
  }] = useGetDetailedReservationStatus()
  const {
    data: dayOffsData,
    isLoading: isDayoffsLoading,
    isError: isDayoffsError
  } = useGetDayoffs()
  const [updateDayoffs, {
    isLoading: isUpdatingDayoffs,
    isError: isDayoffUpdateError,
  }] = useUpdateDayoffs()

  // computed-state
  const isUpdateEnabled = useMemo(
    () => {
      return Array.isArray(dayOffsData) &&
        Array.isArray(dayOffs) &&
        !compareArrays(dayOffsData, dayOffs)
    },
    [dayOffs, dayOffsData]
  )

  // effects
  useEffect(() => {
    fetchStatusData()
  }, [])
  useEffect(() => {
    if (Array.isArray(dayOffsData)) {
      setDayOffs(dayOffsData.slice())
    }
  }, [dayOffsData])

  // methods
  const onCalendarClick = useCallback(
    (val) => {
      setDayOffs(currArr => {
        if (currArr.includes(val)) {
          return currArr.filter(entry => entry !== val)
        } else {
          const newArr = [ ...currArr, val ].sort((a, b) => a - b)
          return newArr
        }
      })
    }, []
  )

  const fetchStatusData = async () => {
    try {
      const data = await getDetailedReservationStatus().unwrap()

      if (data && Object.keys(data).length) {
        setBookedDates(Object.keys(data))
      }
    } catch (err) {
      console.error('@@@ AdminDashboard.jsx caught: ', err)
    }
  }

  const submitDayoffsUpdate = async () => {
    try {
      await updateDayoffs(dayOffs)
      addToastItem({
        type: 'success',
        heading: '업데이트됨',
        content: '쉬는 날 정보가 업데이트 되었습니다.'
      })
    } catch (err) {
      console.error('@@ submitDayoffsUpdate caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '업데이트 실패!',
        content: '쉬는 날 업데이트 중 오류가 발생하였습니다. 다시 시도해 주세요.'
      })
    }
  }

  const formatBookingData = () => {
    const targetData = bookingData[selectedBookedDate]

    if (!targetData) { return [] }

    return Object.entries(targetData)
      .map(([key, entry]) => ({ ...entry, time: key }))
  }

  const onPreviewItemClick = entry => {
    navigate(`/admin/manage-reservation-item/${entry.reservationId}`)
  }

  // views

  const feedbackEl = (isLoadingStatus || isDayoffsLoading)
    ? <div className='admin-feeback-container'>
        <TextLoader>
          예약현황/쉬는날 데이터 로딩중...
        </TextLoader>
      </div>
    : (isStatusError || isDayoffsError)
        ? <Feedback type='error' classes='mt-20'>
            예약현황/쉬는날 데이터 로드중 에러가 발생하였습니다.
          </Feedback>
        : null

  return (
    <AdminPageTemplate classes={cn('page-admin-dashboard', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-home is-prefix'></i>
        <span>대시보드</span>
      </h2>

      {
        feedbackEl ||
        <>
          <section className='admin-page-section'>
            <h3 className='admin-page-section-title'>
              <i className='icon-chevron-right-circle is-prefix'></i>
              <span>쉬는 날 정하기</span>
            </h3>

            <div className='day-off-set-container'>
              <div className='calendar-container'>
                <Calendar classes='day-off-calendar'
                  disallowBookedDate={true}
                  onChange={onCalendarClick}
                  onBookedDateClick={setSelectedBookedDate}
                  allowMultiple={true}
                  bookedDates={bookedDates}
                  value={dayOffs} />

                <div className='legends-container is-right-aligned mt-20'>
                  {
                    legendList.map(entry => (
                      <div key={entry.text} className={`legend-item ${'is-' + entry.color}`}>
                        <span className='color-pad'></span>
                        <span className='item-text'>{entry.text}</span>
                      </div>
                    ))
                  }
                </div>

                {
                  isUpdateEnabled &&
                  <div className='buttons-container is-right-aligned mt-30 mb-0'>
                    <StateButton classes='is-primary'
                      type='button'
                      displayLoader={isUpdatingDayoffs}
                      onClick={submitDayoffsUpdate}
                    >업데이트</StateButton>
                  </div>
                }
              </div>

              { selectedBookedDate &&
                <div className='booking-preview-table'>
                  <h3 className='mb-10'>
                    <i className='icon-info-circle'></i>
                    <span className='mr-4'>{ humanDate(selectedBookedDate, { month: 'short', day: 'numeric' }) }</span>
                    <span>예약 항목</span>
                  </h3>

                  <div className='ilwol-table-container'>
                    <div className='ilwol-table-inner'>
                      <table className='ilwol-table'>
                        <thead>
                          <tr>
                            <th className='th-time'>시간</th>
                            <th className='th-name'>이름</th>
                            <th></th>
                          </tr>
                        </thead>

                        <tbody>
                          {
                            formatBookingData().map(entry => (
                              <tr key={entry.time}>
                                <td className='td-time'>{entry.time}</td>
                                <td className='td-name'
                                  onClick={() => onPreviewItemClick(entry)}>{entry.name}</td>
                                <td className='td-action'>
                                  <button className='is-secondary is-table-btn'
                                    onClick={() => onPreviewItemClick(entry)}>보기</button>
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>
        </>
      }
    </AdminPageTemplate>
  )
}
