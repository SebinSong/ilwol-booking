import React, { useState, useContext, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  humanDate,
  numericDateToString,
  formatMoney,
  getStatusName,
  getCounselMethodNameById,
  classNames as cn
} from '@utils'

// components
import PageTemplate from '../PageTemplate'
import RocketIcon from '@components/svg-icons/RocketIcon'
import TextLoader from '@components/text-loader/TextLoader'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'
import UpdateReservationSchedule from './UpdateReservationSchedule.jsx'
import CounselMethodRow from './CounselMethodRow.jsx'
import AttendeeNumberRow from './AttendeeNumberRow.jsx'
import BookingOptionRow from './BookingOptionRow.jsx'

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
    'on-site-payment': 'text-bg-purple',
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
    isError,
    refetch
  } = useGetReservationDetails(
    reservationId,
    { refetchOnMountOrArgChange: true }
  )
  const [
    deleteReservation,
    {
      isLoading: isDeletingReservation,
      isError: isDeleteError
    }
  ] = useDeleteReservation()
  const [isDeleted, setIsDeleted] = useState(false)
  const [isUpdatingTime, setIsUpdatingTime] = useState(false)
  const [isUpdatingAttendeeNumber, setIsUpdatingAttendeeNumber] = useState(false)
  const [noAmiation, setNoAnimation] = useState(false)

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

  const updateModeOn = () => {
    setNoAnimation(true)
    setTimeout(() => {
      if (isUpdatingTime) { return }

      setIsUpdatingTime(true)
    }, 10)
  }
  const updateModeOff = useCallback(() => setIsUpdatingTime(false), [])
  const onUpdateSuccess = useCallback(() => {
    setIsUpdatingTime(false)
    refetch()
  }, [])

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
    const counselDate = data.counselDate

    const isAdminGenerated = data.optionId === 'admin-generated'
    const isOverseasOption = data.optionId === 'overseas-counsel'
    const isStatusPending = data?.status === 'pending'
    const isStatusConfirmed = data?.status === 'confirmed'
    const isStatusOnSitePayment = data?.status === 'on-site-payment'
    const isStatusCancelled = data?.status === 'cancelled'
    const showAttendeeNumber = ['family-counsel', 'overseas-counsel'].includes(data.optionId)
    const customerMemo = pDetails.memo || ''

    return (
      <PageTemplate classes='page-customer-reservation-details'>
        <div className={cn('page-width-constraints content-container is-success', noAmiation && 'no-animation')}>
          <div className='page-header'>
            <RocketIcon classes='page-icon' width='96' />
  
            <h3 className='is-title-3'>
              <span>고객님의 예약은 현재 </span>
              <span className={cn('reservation-status-tag', getStatusClass(data?.status))}>{getStatusName(data?.status, true)}</span>
              <span>상태입니다.</span>
            </h3>
          </div>
  
          <div className='reservation-summary'>
            <div className='summary-list'>
              <div className='summary-list__title'>
                <span>예약 내역</span>
                {
                  isStatusPending &&
                  <StateButton classes='is-warning is-small cancel-btn'
                    type='button'
                    displayLoader={isDeletingReservation}
                    onClick={onDeleteClick}>
                    <span>예약 취소</span>
                  </StateButton>
                }
              </div>
  
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
  
              <BookingOptionRow optionId={data.optionId} />

              {
                showAttendeeNumber &&
                <AttendeeNumberRow optionId={data.optionId}
                  disableUpdate={isStatusCancelled}
                  numAttendee={pDetails.numAttendee}
                  currentTotalPrice={data.totalPrice}
                  onUpdateModeChange={setIsUpdatingAttendeeNumber}
                  onUpdateSuccess={refetch} />
              }

              {
                Boolean(!isAdminGenerated && pDetails.method) &&
                <CounselMethodRow method={pDetails.method}
                  disableUpdate={isOverseasOption || isStatusCancelled}
                  onUpdateSuccess={refetch} />
              }
  
              <div className='summary-list__item align-center'>
                <span className='summary-list__label'>
                  <span>날짜/시간</span>
                  {
                    !isStatusCancelled &&
                    <button className='is-small is-secondary modify-btn'
                      type='button'
                      onClick={updateModeOn}>변경</button>
                  }
                </span>
                <span className='summary-list__value'>
                  <span>{ humanDate(numericDateToString(data.counselDate), { month: 'short', day: 'numeric', year: 'numeric' }) }</span>
                  <span className='ml-4'>{ data.timeSlot }</span>
                </span>
              </div>
              
              {
                Boolean(customerMemo) &&
                <div className='summary-list__item is-customer-memo'>
                  <span className='summary-list__label'>상담 메모</span>
                  <span className='summary-list__value'>{customerMemo}</span>
                </div>
              }
              
              {
                !isUpdatingAttendeeNumber && (
                  <div className='summary-list__item'>
                    <span className='summary-list__label'>상담료</span>
                    <span className='summary-list__value is-big text-color-default'>
                      { isAdminGenerated ? 'N/A' : formatMoney(data.totalPrice, { minimumFractionDigits: 0 }) }
                    </span>
                  </div>
                )
              }
            </div>
          </div>
          {
            isUpdatingTime
              ? <UpdateReservationSchedule classes='mt-50'
                  initialDate={numericDateToString(data.counselDate)}
                  initialTimeSlot={data.timeSlot}
                  isOverseasOption={isOverseasOption}
                  onBackClick={updateModeOff}
                  onUpdateSuccess={onUpdateSuccess} />
              : isStatusPending
                ? <>
                    <div className='bank-transfer-details mt-10'>
                      <p>아래 계좌로 입금해 주시면, 선녀님 또는 관리자가 예약을 <span className='reservation-status-tag text-bg-success inline-small-padding mr-4'>확정</span>후 알려 드리겠습니다.</p>
    
                      <CopyToClipboard classes='copy-bank-transfer-details mb-30'
                        textToCopy='우리은행 심순애 1002-358-833662'
                        toastOpt={{
                          heading: '계좌정보 복사.',
                          content: '클립보드에 저장 되었습니다.'
                        }}>
                        <span className='bank-transfer-info'>우리은행 심순애 1002 358 833662</span>
                      </CopyToClipboard>
    
                      <div className='things-to-note'>
                        <h3 className='note-title'>
                          <i className='icon-triangle-exclamation mr-4'></i>
                          계좌이체 유의사항
                        </h3>
    
                        <ul className='list'>
                          <li>
                            <span className='has-text-bold mr-4'>1.</span>
                            <span className='has-text-bold'>입금자</span>와 <span className='has-text-bold'>예약자명</span>은 동일해야 합니다.
                          </li>
                          <li>
                            <span className='has-text-bold mr-4'>2.</span>
                            상담료 <span className='has-text-bold'>전액</span>을 입금하셔야 하며, 일부 입금시 예약이 확정되지 않습니다.
                          </li>
                          <li>
                            <span className='has-text-bold mr-4'>3.</span>
                            <span className='has-text-bold'>환불</span>은 예약하신 날짜 기준 <span className='has-text-bold'>1일 전</span>까지 연락주시면 전액 환불해 드립니다.
                          </li>
                        </ul>
                      </div>
                    </div>
    
                    <div className='buttons-container c-btn-container'>
                      <button className='is-secondary'
                        type='button'
                        onClick={() => navigate('/booking/counsel-option')}>
                          <i className='icon-home is-prefix'></i>
                        <span>예약 홈으로</span>
                      </button>
                    </div>
                  </>
                : isStatusConfirmed || isStatusOnSitePayment
                  ? <div className='inquiry-instruction mt-30'>
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