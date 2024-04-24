import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'
import { COUNSEL_METHOD, EXTENDED_TIME_SLOTS, MOBILE_PREFIXES } from '@view-data/constants.js'
import { CLIENT_ERROR_TYPES } from '@view-data/constants.js'

// components
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import {
  useCreateAdminReservation,
  useGetDetailedReservationStatus,
  useGetDayoffs
} from '@store/features/adminApiSlice.js'

// utils
import {
  classNames as cn,
  stringifyDate,
  isStringNumberOnly,
  addDaysToDate
} from '@utils'

import './AdminAddReservationItem.scss'

// helpers
const { WarningMessage } = React.Global
const todayDateStr = stringifyDate(new Date())
const legendList = [
  { color: 'magenta', text: '선택됨' },
  { color: 'success', text: '오늘' },
  { color: 'validation', text: '쉬는날 / 예약 있음' }
]

export default function AdminAddReservationItem () {
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [
    createAdminReservation,
    {
      isLoading,
      isError,
      error
    }
  ] = useCreateAdminReservation()
  const {
    data: dayOffsData,
    isLoading: isDayoffsLoading,
    isError: isDayoffsError
  } = useGetDayoffs()
  const [getDetailedReservationStatus, {
    data: bookingData,
    isLoading: isLoadingStatus,
    isError: isStatusError
  }] = useGetDetailedReservationStatus()
  const [details, setDetails] = useImmer({
    name: '',
    counselDate: '',
    timeSlot: '',
    method: 'visit',
    mobile: {
      prefix: '010',
      firstSlot: '',
      secondSlot: ''
    }
  })
  const [errFeebackMsg, setErrFeedbackMsg] = useState('')

  // computed state
  const occupiedTimeSlots = useMemo(() => {
    return details?.counselDate && bookingData && bookingData[details.counselDate]
      ? Object.keys(bookingData[details.counselDate])
      : []
  }, [details?.counselDate])
  const enableSubmitBtn = useMemo(() => {
    const { name, counselDate, timeSlot } = details
    return Boolean(name?.length >= 2 && counselDate && timeSlot)
  }, [details])

  useEffect(() => {
    getDetailedReservationStatus()
  }, [])

  // methods
  const updateFactory = key => {
    return e => {
      const val = e.target.value

      setDetails(draft => {
        draft[key] = val
      })
    }
  }

  const updateMobileFactory = (key, numberOnly = false) => {
    return e => {
      const val = e.target.value

      if (numberOnly && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft.mobile[key] = val
      })
    }
  }

  const onCalendarSelect = value => {
    setDetails(draft => {
      draft.counselDate = value
      draft.timeSlot = ''
    })
  }
  const onTimeSlotSelect = value => {
    setDetails(draft => {
      draft.timeSlot = value
    })
  }

  const undefaultSubmit = (e) => {
    e.preventDefault()
  }

  const submitHandler = async () => {
    const { mobile } = details
    const hasMobileField = Boolean(mobile.firstSlot || mobile.secondSlot)
    let warningText = `[${details.counselDate} ${details.timeSlot}] 예약 아이템을 생성하시겠습니까?`

    if (hasMobileField) {
      // !!TODO!! - add validation for correct mobile-number format here.
      warningText += ` 고객에게 입금 안내 문자가 날아갑니다.`
    }
    if (!window.confirm(warningText)) { return }

    try {
      const res = await createAdminReservation({
        optionId: 'admin-generated',
        counselDate: details.counselDate,
        timeSlot: details.timeSlot,
        personalDetails: {
          name: details.name,
          mobile: {
            prefix: mobile.prefix,
            number: `${mobile.firstSlot}${mobile.secondSlot}`
          },
          method: details.method
        }
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '생성 완료!',
        content: '예약 아이템이 생성되었습니다.'
      })
      navigate('/admin/manage-reservation')
    } catch (err) {
      const errData = err.data || {}
      const errMsgMap = {
        'time': '선택한 날짜가 휴일로 설정되어 있거나 혹은 그 시간에 이미 예약 아이템이 존재합니다. 다른 옵션을 선택해 주세요.',
        'mobile': '입력한 전화번호로 이미 예약한 내역이 존재합니다.',
        'default': '예약 처리중 오류가 발생하였습니다. 다시 시도해 주세요.'
      }
      const displayErrMsg = errData.errType === CLIENT_ERROR_TYPES.EXISTING_RESERVATION
        ? errMsgMap[errData.invalidType] || errMsgMap.default
        : errMsgMap.default

      setErrFeedbackMsg(displayErrMsg)
      console.error('AdminAddReservationItem caught: ', err)
    }
  }

  // views
  const feedbackEl = (isLoadingStatus || isDayoffsLoading)
    ? <div className='admin-feedback-container'>
        <TextLoader classes='mb-30'>
          예약현황/쉬는날 데이터 로딩중...
        </TextLoader>
      </div>
    : (isStatusError || isDayoffsError)
        ? <Feedback type='error' classes='mt-20 mb-30' showError={true}>
            예약현황/쉬는날 데이터 로드중 에러가 발생하였습니다.
          </Feedback>
        : null

  return (
    <AdminPageTemplate classes='page-admin-add-reservation-item'>
      <h2 className='admin-page-title'>
        <i className='icon-pencil is-prefix'></i>
        <span>예약 생성</span>
      </h2>

      <p className='admin-page-description'>관리자가 임의로 예약 아이템을 생성합니다.</p>
      {
        feedbackEl ||
        <div className='admin-add-reservation-item-content'>
          <form className='form-container' onSubmit={undefaultSubmit}>
            <div className='form-field select-date-time-container'>
              <span className='label mb-10'>날짜/시간 선택</span>
              
              <div className='calendar-container'>
                <Calendar onChange={onCalendarSelect}
                  minDate={new Date()}
                  fullyBookedDates={dayOffsData}
                  value={details?.counselDate} />
              </div>

              <div className='legends-container is-right-aligned mt-20'>
                {
                  legendList.map(entry => (
                    <div key={entry.text} className={`legend-item ${'is-' + entry.color}`}>
                      <span className='color-pad'></span>
                      <span className='item-text'>{entry.text}</span>
                    </div>
                  ))
                }
              </div>

              {
                Boolean(details?.counselDate) &&
                <div className='time-selection-container mt-30'>
                  <TimeSlot classes='time-slot'
                    slotList={EXTENDED_TIME_SLOTS}
                    value={details?.timeSlot}
                    occupiedSlots={occupiedTimeSlots}
                    onSelect={onTimeSlotSelect}
                    disableContactMemo={true}
                    disableAutoScroll={true} />
                </div>
              }
            </div>

            <div className='summary-list'>
              <div className='form-field'>
                <label>
                  <span className='label'>이름</span>

                  <input type='text'
                    className='input common-input-width'
                    value={details.name}
                    onInput={updateFactory('name')}
                    placeholder='이름을 입력하세요' />
                </label>
              </div>

              <div className='form-field'>
                <span className='label'>
                  연락처
                  <span className='optional'>{'(선택사항)'}</span>
                </span>

                <div className='mobile-number-field'>
                  <div className='selectbox'>
                    <select className='select'
                      value={details?.mobile?.prefix}
                      onChange={updateMobileFactory('prefix')}>
                      {
                        MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
                      }
                    </select>
                  </div>

                  <div className='mobile-number-wrapper'>
                    <input type='text' className='input'
                      value={details?.mobile?.firstSlot}
                      onInput={updateMobileFactory('firstSlot', true)}
                      maxLength={4}
                      inputMode='numeric'
                      placeholder='예) 1234' />

                    <span className='dash-sign'>-</span>

                    <input type='text' className='input'
                      value={details?.mobile?.secondSlot}
                      onInput={updateMobileFactory('secondSlot', true)}
                      maxLength={4}
                      inputMode='numeric'
                      placeholder='예) 1234' />
                  </div>
                </div>
              </div>

              <div className='form-field'>
                <label>
                  <span className='label'>상담 방식</span>

                  <span className='selectbox'>
                    <select className='select common-input-width'
                      tabIndex='0'
                      value={details.method}
                      data-vkey='method'
                      onChange={updateFactory('method')}>
                      {
                        COUNSEL_METHOD.map(entry => (
                          <option value={entry.value} key={entry.id}>{entry.name}</option>
                        ))
                      }
                    </select>
                  </span>
                </label>
              </div>
            </div>

            <Feedback type='error' classes='mt-20'
              showError={isError}
              message={errFeebackMsg} />

            <div className='buttons-container is-right-aligned mt-30 mb-0'>
              <StateButton classes='is-primary'
                type='submit'
                disabled={!enableSubmitBtn}
                onClick={submitHandler}
              >생성하기</StateButton>
            </div>
          </form>
        </div>
      }
    </AdminPageTemplate>
  )
}
