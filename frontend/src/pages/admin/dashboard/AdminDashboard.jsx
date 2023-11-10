import React, {
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import { classNames as cn } from '@utils'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import Calendar from '@components/calendar/Calendar'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useGetDetailedReservationStatus } from '@store/features/adminApiSlice.js'

import './AdminDashboard.scss'

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
  const [getDetailedReservationStatus, {
    data: detailedReservationStatus,
    isLoading: isLoadingStatus,
    isError: isStatusError,
    error
  }] = useGetDetailedReservationStatus()

  // local-state
  const [dayOffs, setDayOffs] = useState([])

  // effects
  useEffect(() => {
    getDetailedReservationStatus()
  }, [])

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

  const feedbackEl = isLoadingStatus
    ? <div className='admin-feeback-container'>
        <TextLoader>
          예약현황 데이터 로딩중...
        </TextLoader>
      </div>
    : isStatusError
        ? <Feedback type='error' classes='mt-20'>
            예약현황 로드중 에러가 발생하였습니다.
          </Feedback>
        : null

  return (
    <AdminPageTemplate classes={cn('page-admin-dashboard', classes)}>
      <h2 className='admin-page-title'>
        <i className='icon-home is-prefix'></i>
        <span>대시보드</span>
      </h2>

      <section className='admin-page-section'>
        {
          feedbackEl ||
          <>
            <h3 className='admin-page-section-title'>
              <i className='icon-chevron-right-circle is-prefix'></i>
              <span>쉬는 날 정하기</span>
            </h3>

            <Calendar classes='day-off-calendar'
              onChange={onCalendarClick}
              allowMultiple={true}
              value={dayOffs} />
          </>
        }
      </section>
    </AdminPageTemplate>
  )
}
