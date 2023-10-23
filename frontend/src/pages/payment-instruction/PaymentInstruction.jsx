import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bookingOptions from '@view-data/booking-options.js'
import { humanDate, formatMoney } from '@utils'
// components
import PageTemplate from '../PageTemplate'
import RocketIcon from '@components/svg-icons/RocketIcon'
import TextLoader from '@components/text-loader/TextLoader'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

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

  if (feedbackEl) {
    return (
      <PageTemplate classes='page-payment-instruction'>
        <div className='page-width-constraints content-container'>
          {feedbackEl}
        </div>
      </PageTemplate>
    )
  } else {
    const pDetails = data.personalDetails || {}
    const bookingOption = bookingOptions.find(item => item.id === data.optionId)
    const counselDate = data.counselDate

    return (
      <PageTemplate classes='page-payment-instruction'>
        <div className='page-width-constraints content-container is-success'>
          <div className='page-header'>
            <RocketIcon classes='page-icon' width='108' />
  
            <h3 className='is-title-3'>
              <i className='icon-check-circle text-color-success'></i>
              <span>예약이 접수되었습니다.</span>
            </h3>
          </div>
  
          <div className='reservation-summary'>
            <div className='summary-list'>
              <div className='summary-list__title'>예약 내역</div>
  
              <div className='summary-list__item'>
                <span className='summary-list__label'>상담자</span>
                <span className='summary-list__value'>
                  { pDetails.name }
                  {
                    pDetails.numAttendee > 1
                    && <span className='more-attendee'>{`외 ${pDetails.numAttendee - 1}명`}</span>
                  }
                </span>
              </div>
  
              <div className='summary-list__item'>
                <span className='summary-list__label'>상담 옵션</span>
                <span className='summary-list__value'>{bookingOption.name}</span>
              </div>
  
              <div className='summary-list__item'>
                <span className='summary-list__label'>날짜/시간</span>
                <span className='summary-list__value'>
                  <span>{ humanDate(data.counselDate, { month: 'short', day: 'numeric', year: 'numeric' }) }</span>
                  <span className='ml-4'>{ data.timeSlot }</span>
                </span>
              </div>

              <div className='summary-list__item'>
                <span className='summary-list__label'>상담료</span>
                <span className='summary-list__value is-big text-color-default'>
                  { formatMoney(data.totalPrice, { minimumFractionDigits: 0 }) }
                </span>
              </div>
            </div>
          </div>
  
          <div className='bank-transfer-details'>
            <p>아래 계좌로 입금해 주시면, 선녀님 또는 관리자가 예약을 확정 후 알려 드리겠습니다.</p>

            <CopyToClipboard classes='copy-bank-transfer-details'
              textToCopy='제일은행 김은숙 635 20 144462'
              toastOpt={{
                heading: '계좌정보 복사.',
                content: '클립보드에 저장 되었습니다.'
              }}>
              <span className='bank-transfer-info'>제일은행 김은숙 635 20 144462</span>
            </CopyToClipboard>
          </div>

          <div className='buttons-container'>
            <button className='is-secondary'
              type='button'
              onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
          </div>
        </div>
      </PageTemplate>
    )
  }
}

