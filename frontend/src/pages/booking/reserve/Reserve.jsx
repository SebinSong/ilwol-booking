import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { humanDate, formatMoney } from '@utils'
import {
  COUNSEL_METHOD_ID_NAME_MAP,
  CLIENT_ERROR_TYPES
} from '@view-data/constants.js'

// components
import ConfirmIcon from '@components/svg-icons/ConfirmIcon'
import StateButton from '@components/state-button/StateButton'
import Feedback from '@components/feedback/Feedback'

// hooks
import { usePostReservation } from '@store/features/reservationApiSlice.js'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'
import { clearCounselDetails } from '@store/features/counselDetailsSlice.js'

import './Reserve.scss'

// helper
const displayMoney = val => formatMoney(val, { minimumFractionDigits: 0 })
const errorFeedbackMap = {
  'mobile': '동일한 연락처로 예약한 내역이 존재합니다. 연락처당 하나의 예약만 제출이 가능합니다.',
  'kakaoId': '동일한 카카오 아이디로 예약한 내역이 존재합니다. ID당 하나의 예약만 제출이 가능합니다.',
  'time': '중복된 예약이 존재합니다. 날짜/시간을 다시 선택 후 예약하세요.'
}

export default function ConfirmAndPayment () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // local-state
  const {
    counselOptionInstore: counselOption,
    counselDateInStore: counselDate,
    counselTimeSlotInStore: counselTimeSlot,
    counselPersonalDetailsInStore: personalDetails,
    checkStepStateAndGo
  } = useCounselOptionSteps()
  const [postReservation, {
    isLoading,
    isError,
    error
  }] = usePostReservation()

  // effects
  useEffect(() => {
    checkStepStateAndGo('personal-details')
  }, [])

  // computed-states
  const optionId = counselOption?.id || ''
  const isOverseasCounsel = optionId === 'overseas-counsel'
  const isFamilyCounsel = optionId === 'family-counsel'
  const numAttendeeSelectable = isOverseasCounsel || isFamilyCounsel

  const additionalAttendee = numAttendeeSelectable ? Math.max(personalDetails.numAttendee - 1, 0) : 0
  const defaultPrice = isFamilyCounsel ? counselOption.price -  counselOption.additionalPrice : counselOption.price
  const additionalFee = additionalAttendee > 0 ? additionalAttendee * counselOption.additionalPrice : 0
  const totalPrice = defaultPrice + additionalFee

  if (isError) {
    console.log('@@@ error obj: ', error)
  }
  const errFeebackMsg = isError && error.data.errType === CLIENT_ERROR_TYPES.EXISTING_RESERVATION
    ? errorFeedbackMap[error.data.invalidType]
    : '예약 처리중 오류가 발생하였습니다. 다시 시도해 주세요.'

  // methods
  const onReserveClick = async () => {
    try {
      const res = await postReservation({
        optionId,
        counselDate,
        timeSlot: counselTimeSlot,
        personalDetails,
        totalPrice
      }).unwrap()

      const itemId = res?.reservationId

      if (itemId) { // submission succeeded
        dispatch(clearCounselDetails()) // clear persisted data from store / local-storage
        navigate(`/payment-instruction/${itemId}`)
      }
    } catch (e) {
      console.error('Reserve.jsx caught: ', e)
    }
  }
  const navigateFactory = (path) => () => navigate(path)

  return (
    <div className='reserve-step page-form-constraints'>
      <div className='confirm-page__header'>
        <ConfirmIcon classes='confirm-page__confirm-icon'
          width={82} />

        <h3 className='is-title-2 is-sans step-title'>예약 정보</h3>
      </div>

      <div className='confirm-page__details-table'>
        <div className='confirm-page__details-item'>
          <span className='label'>상담 종류:</span>
          <span className='details-value has-text-bold'>
            {counselOption.name}

            <button className='is-secondary is-small modify-btn'
              onClick={navigateFactory('/booking/counsel-option')}>변경</button>
          </span>
        </div>

        <div className='confirm-page__details-item date-and-time'>
          <span className='label'>날짜/시간:</span>
          <span className='details-value has-text-bold text-color-magenta'>
            <span className='date-value'>{humanDate(counselDate, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className='time-slot-value'>{counselTimeSlot}</span>

            <button className='is-secondary is-small modify-btn'
              onClick={navigateFactory('/booking/date-and-time')}>변경</button>
          </span>
        </div>

        <div className='confirm-page__details-item'>
          <span className='label'>총 상담 인원:</span>
          <span className='details-value has-text-bold'>
            <span className='text-color-magenta'>{personalDetails.numAttendee}</span>
            <span className='unit-append'>명</span>

            {
              numAttendeeSelectable &&
              <button className='is-secondary is-small modify-btn'
                onClick={navigateFactory('/booking/personal-details')}>변경</button>
            }
          </span>
        </div>

        <div className='confirm-page__details-item'>
          <span className='label'>총 가격:</span>
          <span className='details-value is-for-total-price has-text-bold text-color-magenta'>
            <span className='total-price-value'>
              {displayMoney(totalPrice)}
              <span className='unit-append'>원</span>
            </span>
            {
              numAttendeeSelectable && additionalFee > 0
              ? <span className='family-counsel-price-info'>
                  {`(${displayMoney(defaultPrice)} + ${additionalAttendee} x ${displayMoney(counselOption.additionalPrice)})`}
                </span>
              : null
            }
          </span>
        </div>

        <div className='confirm-page__personal-details'>
          <span className='label personal-details-label'>
            <span>개인 정보 및 기타:</span>
            <button className='is-secondary is-small modify-btn'
              onClick={navigateFactory('/booking/personal-details')}>변경</button>
          </span>

          <div className='personal-details-item'>
            <span className='sub-label'>이름/성별</span>

            <span className='sub-value'>
              <span>{personalDetails.name}</span>
              <span className='unit-append'>{personalDetails.gender === 'male' ? '(남)' : '(여)'}</span>
            </span>
          </div>

          <div className='personal-details-item'>
            <span className='sub-label'>생년월일</span>

            <span className='sub-value'>
              <span>{personalDetails.dob.system === 'solar' ? '음력' : '양력'}</span>
              <span className='unit-append'>{personalDetails.dob.year}년</span>
              <span className='unit-append'>{personalDetails.dob.month}월</span>
              <span className='unit-append'>{personalDetails.dob.date}일</span>
            </span>
          </div>

          {
            isOverseasCounsel
              ? <div className='personal-details-item'>
                  <span className='sub-label'>카카오 ID</span>

                  <span className='sub-value'>
                    <span>{personalDetails.kakaoId}</span>
                  </span>
                </div>
              : <div className='personal-details-item'>
                  <span className='sub-label'>연락처</span>

                  <span className='sub-value'>
                    <span>{'(' + personalDetails.mobile.prefix + ')'}</span>
                    <span className='unit-append'>{personalDetails.mobile.number}</span>
                  </span>
                </div>
          }

          <div className='personal-details-item'>
            <span className='sub-label'>상담 방식</span>

            <span className='sub-value'>
              <span>{COUNSEL_METHOD_ID_NAME_MAP[personalDetails.method]}</span>
            </span>
          </div>

          {
            Boolean(personalDetails.email) &&
            <div className='personal-details-item'>
              <span className='sub-label'>E-mail</span>

              <span className='sub-value'>
                <span>{personalDetails.email}</span>
              </span>
            </div>
          }
        </div>
      </div>

      <Feedback type='error' classes='mt-20'
        showError={isError}
        message={errFeebackMsg} />

      <div className='buttons-container mt-40'>
        <StateButton type='button'
          classes='is-primary reserve-btn'
          onClick={onReserveClick}>
          예약하기
        </StateButton>
      </div>
    </div>
  )
}
