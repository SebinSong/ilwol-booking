import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { humanDate, formatMoney } from '@utils'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'
import CartIcon from '@components/svg-icons/CartIcon'
import { COUNSEL_METHOD_ID_NAME_MAP } from '@view-data/constants.js'

import './Reserve.scss'

// helper
const displayMoney = val => formatMoney(val, { minimumFractionDigits: 0 })

export default function ConfirmAndPayment () {
  const navigate = useNavigate()

  // local-state
  const {
    counselOptionInstore: counselOption,
    counselDateInStore: counselDate,
    counselTimeSlotInStore: counselTimeSlot,
    counselPersonalDetailsInStore: personalDetails,
    checkStepStateAndGo
  } = useCounselOptionSteps()

  // effects
  useEffect(() => {
    checkStepStateAndGo('personal-details')
  }, [])

  // computed-states
  const optionId = counselOption?.id || ''
  const isOverseasCounsel = optionId === 'overseas-counsel'
  const isFamilyCounsel = optionId === 'family-counsel'

  const additionalAttendee = isFamilyCounsel ? Math.max(personalDetails.numAttendee - 1, 0) : 0
  const defaultPrice = isFamilyCounsel ? counselOption.price -  counselOption.additionalPrice : counselOption.price
  const additionalFee = additionalAttendee > 0 ? additionalAttendee * counselOption.additionalPrice : 0
  const totalPrice = defaultPrice + additionalFee

  // methods
  const onReserveClick = () => {
    alert('Coming soon!')
  }
  const navigateFactory = (path) => () => navigate(path)

  return (
    <div className='reserve-step page-form-constraints'>
      <div className='confirm-page__header'>
        <CartIcon classes='confirm-page__cart-icon'
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
              isFamilyCounsel &&
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
              isFamilyCounsel &&
              <span className='family-counsel-price-info'>
                {`(${displayMoney(defaultPrice)} + ${additionalAttendee} x ${displayMoney(counselOption.additionalPrice)})`}
              </span>
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

      <div className='buttons-container mt-40'>
        <button type='button'
          className='is-primary reserve-btn'
          onClick={onReserveClick}>
          예약하기
        </button>
      </div>
    </div>
  )
}
