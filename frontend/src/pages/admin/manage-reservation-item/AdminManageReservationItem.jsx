import React from 'react'
import { classNames as cn } from '@utils'
import { useParams } from 'react-router-dom'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'

import './AdminManageReservationItem.scss'

// helpers
const dobToString = dob => {
  const { system = 'lunar', year, month, date } = dob
  return `${system === 'lunar' ? '양력' : '음력'} ${year}-${month}-${date}`
}

export default function AdminManageReservationItem () {
  const { id: reservationId } = useParams()

  // local-state
  const {
    data = null,
    isLoading: isLoadingDetails,
    isError: isDetailsError
  } = useGetReservationDetails(reservationId)

  // computed state
  const pDetails = data?.personalDetails || {}

  const feedbackEl = isLoadingDetails
    ? <div className='admin-feeback-container'>
        <TextLoader>
          예약 아이템 로딩중...
        </TextLoader>
      </div>
    : isDetailsError
      ? <Feedback type='error' classes='mt-20'>
          예약 아이템 로드중 에러가 발생하였습니다.
        </Feedback>
      : null

  if (data) {
    console.log('@@ reservation data: ', data)
  }
  return (
    <AdminPageTemplate classes='page-admin-manage-reservation-item'>
      <h2 className='admin-page-title'>
        <i className='icon-clock is-prefix'></i>
        <span>예약 항목 보기</span>
      </h2>

      <div className='admin-reservation-item-content'>
        {
          feedbackEl ||
          <>
            <div className='copy-reservation-id'>
              <span>예약 ID: </span>

              <CopyToClipboard classes='copy-bank-transfer-details'
                textToCopy={reservationId}
                toastOpt={{
                  heading: '예약 ID 복사',
                  content: '클립보드에 저장 되었습니다.'
                }}>
                <span className='id-display'>{reservationId}</span>
              </CopyToClipboard>
            </div>

            <div className='reservation-details-container mt-20'>
              <div className='summary-list'>
                <div className='summary-list__title'>예약 상세 내역</div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>이름</span>
                  <span className='summary-list__value is-normal-color'>
                    {pDetails.name}
                    <span className='ml-4'>{pDetails.gender === 'male' ? '(남)' : '(여)'}</span>
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>생년월일</span>
                  <span className='summary-list__value is-normal-color'>
                    {dobToString(pDetails.dob)}
                  </span>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
