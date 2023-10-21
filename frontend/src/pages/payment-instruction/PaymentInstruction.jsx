import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// components
import PageTemplate from '../PageTemplate'
import RocketIcon from '@components/svg-icons/RocketIcon'
import TextLoader from '@components/text-loader/TextLoader'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'

import './PaymentInstruction.scss'

export default function PaymentInstruction () {
  const navigate = useNavigate()
  const { id: reservationId } = useParams()

  // local-state
  const {
    data = {},
    isLoading,
    isError
  } = useGetReservationDetails(reservationId)

  console.log('@@ data: ', data)
  // feedback component
  const feedbackEl = isLoading
    ? <TextLoader classes='loader-ani'>로딩중..</TextLoader>
    : Object.keys(data).length === 0 // no-data loaded
        ? <div className='no-data-feedback'>
            <i className='icon-close-circle'></i>
            <h3 className='is-title-4'>예약 정보를 찾을 수 없습니다.</h3>
            <button className='is-secondary'
              onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
          </div>
        : null

  return (
    <PageTemplate classes='page-payment-instruction'>
      <div className='page-width-constraints content-container'>
        {
          feedbackEl ||
          <>
            <div className='page-header'>
              <RocketIcon classes='page-icon' width='108' />

              <h3 className='is-title-3'>
                <i className='icon-check-circle text-color-success'></i>
                <span>예약이 접수되었습니다.</span>
              </h3>
            </div>

            <div className='reservation-summary'>

            </div>

            <div className='bank-transfer-details'>
              <p className='text-color-grey'>
                아래 계좌로 입금해 주시면, 선녀님 또는 관리자가 확인 후, 연락처를 통해 알려드리겠습니다.
              </p>
            </div>
          </>
        }
      </div>
    </PageTemplate>
  )
}
