import React, { useMemo } from 'react'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'

// hooks
import { useGetArchivedReservations } from '@store/features/adminApiSlice.js'

// css
import './AdminReservationHistory.scss'

export default function AdminReservationHistory () {
  // local-state
  const {
    data, isLoading, isError
  } = useGetArchivedReservations()

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
                    <p className='helper info'>{data.length}개의 데이터가 로드되었습니다.</p>
                  </>
                : <p className='helper info'>로드된 데이터가 없습니다.</p>
            )
          }
        </div>
      </div>
    </AdminPageTemplate>
  )
}
