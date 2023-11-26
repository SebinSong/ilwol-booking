import React, { useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import bookingOptions from '@view-data/booking-options.js'
import {
  humanDate,
  numericDateToString,
  formatMoney,
  getStatusName,
  classNames as cn
} from '@utils'

// components
import PageTemplate from '../PageTemplate'
import RocketIcon from '@components/svg-icons/RocketIcon'
import TextLoader from '@components/text-loader/TextLoader'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'

// hooks
import {
  useGetReservationDetails,
  useDeleteReservation
} from '@store/features/reservationApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

import './CustomerReservationDetails.scss'

// helpers
const getStatusClass = status => {
  return ({
    'pending': 'text-bg-validation',
    'confirmed': 'text-bg-success',
    'cancelled': 'text-bg-warning'
  })[status]
}

export default function CustomerReservationDetails () {
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)
  const { id: reservationId } = useParams()

  // local-state
  const {
    data = {},
    isLoading,
    isError
  } = useGetReservationDetails(reservationId)
  const [
    deleteReservation,
    {
      isLoading: isDeletingReservation,
      isError: isDeleteError
    }
  ] = useDeleteReservation()
  const [isDeleted, setIsDeleted] = useState(false)

  // methods
  const onDeleteClick = async () => {
    if (!window.confirm('취소된 예약은 복구가 불가합니다. 정말 취소하시겠습니까?')) { return }
    
    try {
      const res = await deleteReservation(reservationId).unwrap()

      if (res.deletedId) {
        setIsDeleted(true)
      }
    } catch (err) {
      console.error('CustomerReservationDetails.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '서버 오류!',
        content: '예약 취소 처리중 오류가 발생하였습니다. 관리자에게 문의하세요.'
      })
    }
  }

  // feedback component
  let feedbackEl = isDeleted
    ? <div className='feedback-container'>
        <i className='icon-trash'></i>
        <h3 className='is-title-4'>
          예약이 성공적으로 <span className='reservation-status-tag text-bg-warning'>취소</span>되었습니다.
        </h3>
        <button className='is-secondary'
          onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
      </div>
    : isLoading
        ? <TextLoader classes='loader-ani'>로딩중..</TextLoader>
        : Object.keys(data).length === 0 // no-data loaded
            ? <div className='feedback-container'>
                <i className='icon-close-circle'></i>
                <h3 className='is-title-4'>예약 정보를 찾을 수 없습니다.</h3>
                <button className='is-secondary'
                  onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
              </div>
            : null

  if (feedbackEl) {
    return (
      <PageTemplate classes='page-customer-reservation-details'>
        <div className='page-width-constraints content-container'>
          {feedbackEl}
        </div>
      </PageTemplate>
    )
  } else {
    const pDetails = data.personalDetails || {}
    const bookingOption = bookingOptions.find(item => item.id === data.optionId)
    const counselDate = data.counselDate
    const isStatusPending = data?.status == 'pending'
    const isStatusConfirmed = data?.status == 'confirmed'

    return (
      <PageTemplate classes='page-customer-reservation-details'>
        <div className='page-width-constraints content-container is-success'>
          <div className='page-header'>
            <RocketIcon classes='page-icon' width='108' />
  
            <h3 className='is-title-3'>
              <span>고객님의 예약은 현재 </span>
              <span className={cn('reservation-status-tag', getStatusClass(data?.status))}>{getStatusName(data?.status, true)}</span>
              <span>상태입니다.</span>
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
                  <span>{ humanDate(numericDateToString(data.counselDate), { month: 'short', day: 'numeric', year: 'numeric' }) }</span>
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
  
          {
            isStatusPending
            ? <>
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

                <div className='buttons-container c-btn-container'>
                  <StateButton classes='is-warning'
                    type='button'
                    displayLoader={isDeletingReservation}
                    onClick={onDeleteClick}>
                    예약 취소
                  </StateButton>

                  <button className='is-secondary'
                    type='button'
                    onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
                </div>
              </>
            : isStatusConfirmed
              ? <div className='inquiry-instruction'>
                  <p>예약 날 뵙겠습니다. 문의사항이 있으시면, 선녀님께 
                    <span className='ml-4 has-text-bold'>카톡</span>
                    이나 
                    <span className='ml-4 has-text-bold'>문자</span> 
                    연락 주시기 바랍니다.
                  </p>

                  <CopyToClipboard classes='copy-kakao-id mb-10'
                    textToCopy='dragonrex'
                    toastOpt={{
                      heading: '카카오 ID 복사.',
                      content: '클립보드에 저장 되었습니다.'
                    }}>
                    <span className='ctc-text'>카카오 ID 복사</span>
                  </CopyToClipboard>

                  <CopyToClipboard classes='copy-kakao-id'
                    textToCopy='01095398700'
                    toastOpt={{
                      heading: '전화번호 복사.',
                      content: '클립보드에 저장 되었습니다.'
                    }}>
                    <span className='ctc-text'>전화번호 복사</span>
                  </CopyToClipboard>
                </div>
              : null
          }
        </div>
      </PageTemplate>
    )
  }
}