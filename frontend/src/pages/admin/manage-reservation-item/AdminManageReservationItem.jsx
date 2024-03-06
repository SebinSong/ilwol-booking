import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'
import { useUpdateReservationDetails, useAdminDeleteReservation } from '@store/features/adminApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

// utils
import {
  getCounselTypeNameById,
  getCounselMethodNameById,
  getStatusName,
  numericDateToString,
  humanDate,
  formatMoney,
  dobToString,
  classNames as cn
} from '@utils'
import { RESERVATION_STATUSES } from '@view-data/constants.js'

import './AdminManageReservationItem.scss'

// helpers
const combineMobile = mobile => mobile?.number ? `${mobile.prefix} ${mobile.number}` : ''

const getStatusClass = status => {
  return ({
    'pending': 'text-bg-validation',
    'confirmed': 'text-bg-success',
    'cancelled': 'text-bg-warning'
  })[status]
}
const getStatusIcon = status => {
  return ({
    'pending': 'icon-clock',
    'confirmed': 'icon-check-circle',
    'cancelled': 'icon-close-circle'
  })[status]
}

export default function AdminManageReservationItem () {
  const navigate = useNavigate()
  const { id: reservationId } = useParams()
  const [searchParams] = useSearchParams()
  const { addToastItem, unloadAllToast } = useContext(ToastContext)
  const customerItemLink = `${window.location.origin}/reservation-details/${reservationId}`

  // local-state
  const [currentStatus, setCurrentStatus] = useState('')
  const {
    data = {},
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch
  } = useGetReservationDetails(
    reservationId,
    { refetchOnMountOrArgChange: Boolean(searchParams.get('reload')) }
  )
  const [
    updateReservationDetails,
    {
      isLoading: isUpdatingReservationDetails,
      isError: isReservationDetailsError
    }
  ] = useUpdateReservationDetails()
  const [
    deleteReservation,
    {
      isLoading: isDeletingReservation
    }
  ] = useAdminDeleteReservation()

  // computed state
  const isAdminGenerated = data?.optionId === 'admin-generated'
  const pDetails = data?.personalDetails || {}
  const hasContactDetails = Boolean(pDetails?.mobile?.number || pDetails?.email || pDetails?.kakaoId)
  const hasMobileNumber = Boolean(pDetails?.mobile?.number)

  // effects
  useEffect(() => {
    if (data.status) { setCurrentStatus(data.status)}
  }, [data])

  // methods
  const updateReservationStatus = async () => {
    if (['confirmed', 'cancelled'].includes(currentStatus) &&
      !window.confirm(
        hasMobileNumber
          ? '상태 업데이트를 하시겠습니까? 고객에게 알림문자가 날아갑니다.'
          : '상태 업데이트를 하시겠습니까?'
      )
    ) { return }

    try {
      const res = await updateReservationDetails({
        id: reservationId,
        updates: { status: currentStatus }
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '업데이트됨!',
        content: '예약 상태가 성공적으로 업데이트되었습니다.'
      })
      refetch()
    } catch (err) {
      console.error('AdminManageReservationItem.jsx caught: ', err)

      addToastItem({
        type: 'warning',
        heading: '업데이트 실패!',
        content: '예약 상태 업데이트중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  const copyCustomerLink = () => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(customerItemLink)

        unloadAllToast()
        addToastItem({
          type: 'success',
          heading: '고객링크 복사',
          content: '클립보드에 저장 되었습니다.'
        })
      } catch (err) {
        console.error('copy-to-clipboard action failed: ', err)
      }
    }
  }

  const onDeleteBtnClick = async () => {
    if (!window.confirm('예약 아이템을 제거하시겠습니까? 데이터는 완전히 사라지며, 복구할 수 없습니다.')) { return } // @@@

    try {
      const res = await deleteReservation(reservationId).unwrap()

      if (res.deletedId) {
        addToastItem({
          type: 'success',
          heading: '예약 삭제!',
          content: '예약 아이템이 제거되었습니다.'
        })
        navigate(-1)
      }
    } catch (err) {
      console.error('AdminManageReservationItem.jsx caught: ', err)

      addToastItem({
        type: 'warning',
        heading: '제거 실패!',
        content: '예약 아이템 제거중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      })
    }
  }

  const onModifyBtnClick = () => { navigate(`/admin/update-reservation-item/${reservationId}`) }

  const onMessageBtnClick = () => {
    const { prefix = '', number = '' } = pDetails?.mobile || {}
  
    navigate(
      '/admin/send-message',
      {
        state: {
          to: [`${prefix}-${number.slice(0, 4)}-${number.slice(4)}`] 
        } 
      }
    )
  }

  // views
  const feedbackEl = isLoadingDetails
    ? <div className='admin-feedback-container'>
        <TextLoader>
          예약 아이템 로딩중...
        </TextLoader>
      </div>
    : isDetailsError
      ? <Feedback type='error' classes='mt-20' showError={true}>
          예약 아이템 로드중 에러가 발생하였습니다.
        </Feedback>
      : null

  return (
    <AdminPageTemplate classes='page-admin-manage-reservation-item'>
      <h2 className='admin-page-title mb-40'>
        <i className='icon-clock is-prefix'></i>
        <span>예약 항목 보기</span>
      </h2>

      <div className='admin-reservation-item-content'>
        {
          feedbackEl ||
          <>
            <div className='admin-details-call-to-action-container'>
              <button className='is-secondary is-small'
                onClick={() => navigate(-1)}>
                <i className='icon-chevron-left-circle is-prefix'></i>
                <span>뒤로 가기</span>
              </button>

              <div className='admin-id-copy'>
                <span>예약 ID: </span>

                <CopyToClipboard
                  textToCopy={reservationId}
                  toastOpt={{
                    heading: '예약 ID 복사',
                    content: '클립보드에 저장 되었습니다.'
                  }}>
                  <span className='id-display'>{reservationId}</span>
                </CopyToClipboard>
              </div>
            </div>

            <div className='reservation-details-container mt-20'>
              <div className='summary-list'>
                <div className='summary-list__title c-table-title'>
                  <span className='mr-4'>예약 상세 내역</span>
                  <button className='is-secondary is-table-btn ml-4'
                    onClick={onModifyBtnClick}>수정</button>

                  <button className='is-warning is-table-btn ml-4'
                    onClick={onDeleteBtnClick}
                    disabled={isDeletingReservation}>
                    제거
                  </button>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상태</span>
                  <span className='summary-list__value'>
                    <span className={cn('status-tag', getStatusClass(data?.status))}>
                      <i className={cn(getStatusIcon(data?.status))}></i>
                      {`${getStatusName(data?.status)}`}
                    </span>
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>이름</span>
                  <span className='summary-list__value is-normal-color'>
                    {pDetails.name}
                    {
                      !isAdminGenerated &&
                      <span className='ml-4'>
                        {pDetails?.gender === 'male' ? '(남)' : '(여)'}
                      </span>
                    }
                  </span>
                </div>

                {
                  !isAdminGenerated &&
                  <div className='summary-list__item'>
                    <span className='summary-list__label'>생년월일</span>
                    <span className='summary-list__value is-normal-color'>
                      {dobToString(pDetails.dob)}
                    </span>
                  </div>
                }

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상담 날짜/시간</span>
                  <span className='summary-list__value'>
                    <span>{humanDate(numericDateToString(data.counselDate), { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className='ml-4'>{data.timeSlot}</span>
                  </span>
                </div>

                {
                  !isAdminGenerated &&
                  <>
                    <div className='summary-list__item'>
                      <span className='summary-list__label'>총 결제금액</span>
                      <span className='summary-list__value'>
                        {formatMoney(data?.totalPrice || 0, { minimumFractionDigits: 0 })}
                      </span>
                    </div>

                    <div className='summary-list__item'>
                      <span className='summary-list__label'>총 인원</span>
                      <span className='summary-list__value is-normal-color'>
                        {`${pDetails.numAttendee}명`}
                      </span>
                    </div>
                  </>
                }

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상담 옵션</span>
                  <span className='summary-list__value'>
                    {getCounselTypeNameById(data?.optionId)}
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상담 방식</span>
                  <span className='summary-list__value is-normal-color'>
                    {getCounselMethodNameById(pDetails.method)}
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>고객용 예약 링크</span>
                  <span className='summary-list__value'>
                    <button className='is-table-btn is-secondary'
                      onClick={copyCustomerLink}>
                        <i className='icon-copy is-prefix'></i>
                      <span>복사하기</span>
                    </button>
                  </span>
                </div>

                {
                  hasContactDetails &&
                  <div className='summary-list__item is-column'>
                    <span className='summary-list__label'>연락처</span>

                    <div className='summary-list__sub-item'>
                      <span className='sub-label'>핸드폰</span>
                      <span className='sub-value'>{
                        pDetails?.mobile?.number
                          ? <span className='mobile-cta-container'>
                              <CopyToClipboard textToCopy={combineMobile(pDetails.mobile)}>
                                {combineMobile(pDetails.mobile)}
                              </CopyToClipboard>

                              <button className='is-secondary is-table-btn icon-only' type='button'
                                onClick={onMessageBtnClick}>
                                <i className='icon-mail'></i>
                              </button>
                            </span>
                          : 'N/A'
                      }</span>
                    </div>

                    <div className='summary-list__sub-item'>
                      <span className='sub-label'>이메일</span>
                      <span className='sub-value'>{
                        pDetails?.email
                          ? <CopyToClipboard textToCopy={pDetails?.email}>
                              {pDetails?.email}
                            </CopyToClipboard>
                          : 'N/A'
                      }</span>
                    </div>

                    <div className='summary-list__sub-item'>
                      <span className='sub-label'>Kakao ID</span>
                      <span className='sub-value'>{
                        pDetails?.kakaoId
                          ? <CopyToClipboard textToCopy={pDetails?.kakaoId}>
                              {pDetails?.kakaoId}
                            </CopyToClipboard>
                          : 'N/A'
                      }</span>
                    </div>
                  </div>
                }

                {
                  pDetails?.memo &&
                  <div className='summary-list__item is-column'>
                    <span className='summary-list__label'>메모</span>

                    <p className='memo-value'>
                      {pDetails?.memo}
                    </p>
                  </div>
                }
              </div>
            </div>

            <div className='status-update-container'>
              <div className='form-field status-update-field'>
                <span className='label'>상태 업데이트:</span>

                <div className='selectbox num-attendee-select'>
                  <select className='select'
                    value={currentStatus}
                    onChange={(e) => { setCurrentStatus(e.target.value) }}>
                    {
                      RESERVATION_STATUSES.map(entry => <option key={entry.value} value={entry.value}>{entry.name}</option>)
                    }
                  </select>
                </div>
              </div>

              <StateButton classes='is-primary status-update-btn'
                type='button'
                disabled={!data.status || currentStatus === data.status}
                displayLoader={isUpdatingReservationDetails}
                onClick={updateReservationStatus}>업데이트</StateButton>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
