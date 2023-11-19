import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'

// utils
import {
  getCounselTypeNameById,
  getCounselMethodNameById,
  getStatusName,
  numericDateToString,
  humanDate,
  formatMoney,
  classNames as cn
} from '@utils'
import { RESERVATION_STATUSES } from '@view-data/constants.js'

import './AdminManageReservationItem.scss'

// helpers
const dobToString = dob => {
  const { system = 'lunar', year, month, date } = dob
  return `${system === 'lunar' ? '양력' : '음력'} ${year}-${month}-${date}`
}
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

  // local-state
  const [currentStatus, setCurrentStatus] = useState('')
  const {
    data = {},
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch
  } = useGetReservationDetails(reservationId)

  // computed state
  const pDetails = data?.personalDetails || {}

  // effects
  useEffect(() => {
    if (data.status) { setCurrentStatus(data.status)}
  }, [data])

  // methods
  const updateReservationStatus = async () => {
    alert(`coming soon!`)
  }
  const onModifyBtnClick = () => { alert(`coming soon!`) }

  // views
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
            <div className='call-to-action-container'>
              <button className='is-secondary is-small'
                onClick={() => navigate(-1)}>
                <i className='icon-chevron-left-circle is-prefix'></i>
                <span>뒤로 가기</span>
              </button>

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
            </div>

            <div className='reservation-details-container mt-20'>
              <div className='summary-list'>
                <div className='summary-list__title c-table-title'>
                  <span>예약 상세 내역</span>

                  <button className='is-secondary is-table-btn ml-4'
                    onClick={onModifyBtnClick}>예약 내용 수정</button>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상태</span>
                  <span className='summary-list__value'>
                    <span className={cn('status-tag', getStatusClass( data?.status))}>
                      <i className={cn(getStatusIcon(data?.status))}></i>
                      {`(${getStatusName(data?.status)})`}
                    </span>
                  </span>
                </div>

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

                <div className='summary-list__item'>
                  <span className='summary-list__label'>상담 날짜/시간</span>
                  <span className='summary-list__value'>
                    <span>{humanDate(numericDateToString(data.counselDate), { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className='ml-4'>{data.timeSlot}</span>
                  </span>
                </div>

                <div className='summary-list__item'>
                  <span className='summary-list__label'>총 결재금액</span>
                  <span className='summary-list__value'>
                    {formatMoney(data?.totalPrice || 0, { minimumFractionDigits: 0 })}
                  </span>
                </div>

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
                  <span className='summary-list__label'>총 인원</span>
                  <span className='summary-list__value is-normal-color'>
                    {`${pDetails.numAttendee}명`}
                  </span>
                </div>

                <div className='summary-list__item is-column'>
                  <span className='summary-list__label'>연락처</span>

                  <div className='summary-list__sub-item'>
                    <span className='sub-label'>핸드폰</span>
                    <span className='sub-value'>{
                      pDetails?.mobile?.number
                        ? <CopyToClipboard textToCopy={combineMobile(pDetails.mobile)}>
                            {combineMobile(pDetails.mobile)}
                          </CopyToClipboard>
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

              <button className='is-primary status-update-btn'
                disabled={!data.status || currentStatus === data.status}
                onClick={updateReservationStatus}>업데이트</button>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
