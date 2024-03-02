import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { useParams, useNavigate } from 'react-router-dom'
import { COUNSEL_METHOD, EXTENDED_TIME_SLOTS, CLIENT_ERROR_TYPES } from '@view-data/constants.js'
import COUNSEL_OPTIONS_LIST from '@view-data/booking-options.js'

// components
import Calendar from '@components/calendar/Calendar'
import TimeSlot from '@components/time-slot/TimeSlot'
import AdminPageTemplate from '@pages/AdminPageTemplate'
import TextLoader from '@components/text-loader/TextLoader'
import Feedback from '@components/feedback/Feedback'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import StateButton from '@components/state-button/StateButton'
import MobileNumberField from '@components/mobile-number-field/MobileNumberField'

// hooks
import { useGetReservationDetails } from '@store/features/reservationApiSlice.js'
import {
  useGetDayoffs,
  useGetDetailedReservationStatus,
  useUpdateReservationDetails
} from '@store/features/adminApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'
import { useValidation } from '@hooks/useValidation'

// utils
import {
  classNames as cn,
  formatMoney,
  numericDateToString,
  stringifyDate,
  checkDateAndTimeAvailable,
  isMobileNumberValid
} from '@utils'

import './UpdateReservationItem.scss'

// helpers
const todayDateStr = stringifyDate(new Date())
const numAttendeeOptions = [1, 2, 3, 4, 5]
const combineMobile = mobile => mobile?.number ? `${mobile.prefix} ${mobile.number}` : ''
const displayMoney = val => formatMoney(val, { minimumFractionDigits: 0 })
const computeTotalPrice = (optionId, numAttendee) => {
  const option = COUNSEL_OPTIONS_LIST.find(x => x.id === optionId)
  const additionalAttendee = numAttendee - 1
  const { price, additionalPrice } = option

  return price + (additionalAttendee > 0 ? additionalAttendee * additionalPrice : 0)
}
const legendList = [
  { color: 'magenta', text: '선택됨' },
  { color: 'success', text: '오늘' },
  { color: 'validation', text: '쉬는날 / 예약 있음' }
]


export default function AdminUpdateReservationItem () {
  const navigate = useNavigate()
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [details, setDetails] = useImmer({
    counselDate: '',
    timeSlot: '',
    optionId: '',
    method: '',
    numAttendee: 1,
    name: '',
    mobile: ''
  })
  const [originalData, setOriginalData] = useState({})
  const [updateError, setUpdateError] = useState('') 
  const {
    data = {},
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    refetch
  } = useGetReservationDetails(reservationId)
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
  const [
    updateReservationDetails,
    {
      isLoading: isUpdatingReservationDetails,
      isError: isReservationDetailsError
    }
  ] = useUpdateReservationDetails()

  // computed state
  const pDetails = data?.personalDetails || {}
  const isAdminGenerated = details?.optionId === 'admin-generated'
  const computedTotalPrice = !isAdminGenerated && details.optionId ? computeTotalPrice(details.optionId, details.numAttendee || 1) : 0
  
  // memoized computed props
  const enableUpdateBtn = useMemo(() => {
    return Boolean(details.timeSlot) &&
      Object.entries(details).some(
        ([key, value]) => Boolean(value) &&  originalData[key] !== value
      )
  }, [details])
  const occupiedTimeSlots = useMemo(() => {
    return details?.counselDate && bookingData && bookingData[details.counselDate]
      ? Object.keys(bookingData[details.counselDate])
      : []
  }, [details?.counselDate])

  // validation
  const {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  } = useValidation(
    details,
    [
      {
        key: 'numAttendee',
        check: (val, details) => {
          if (details.optionId === 'individual-counsel') { return val === 1 }
          else { return true }
        },
        errMsg: '개인상담 옵션은 다수의 인원 선택이 불가합니다.'
      },
      {
        key: 'mobile',
        check: (val) => {
          val = val.trim()
          const len = val.length
          return len > 3 ? isMobileNumberValid(val) : len === 3
        },
        errMsg: '연락처가 올바른 형식이 아닙니다. (e.g 123-1234-1234)'
      }
    ]
  )

  // effects
  useEffect(() => {
    if (Object.keys(data).length) {
      const dateStr = numericDateToString(data.counselDate)
      const pDetails = data.personalDetails || {}

      setOriginalData({
        counselDate: dateStr,
        timeSlot: data.timeSlot,
        optionId: data.optionId,
        method: pDetails.method,
        numAttendee:pDetails.numAttendee,
        name: pDetails.name,
        mobile: `${pDetails.mobile?.prefix || ''} ${pDetails.mobile?.number || ''}`
      })
      setDetails(draft => {
        draft.counselDate = dateStr
        draft.timeSlot = data.timeSlot
        draft.optionId = data.optionId
        draft.method = pDetails.method
        draft.numAttendee = pDetails.numAttendee
        draft.name = pDetails.name
        draft.mobile = `${pDetails.mobile?.prefix || ''} ${pDetails.mobile?.number || ''}`
      })
    }
  }, [data])

  useEffect(() => {
    getDetailedReservationStatus()
  }, [])

  // methods
  const updateFactory = key => {
    return e => {
      let val = e.target.value

      if (key === 'numAttendee') {
        val = parseInt(val)
      }

      setDetails(draft => {
        draft[key] = val
      })

      if (isErrorActive(key)) {
        clearFormError()
      }

      updateError && setUpdateError('')
    }
  }

  const onMobileUpdate = useCallback(
    (val) => {
      setDetails(draft => { draft.mobile = val})

      if (isErrorActive('mobile')) {
        clearFormError()
      }
    }, [formError]
  )

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

  const genUpdatePayload = () => {
    const updates = {}

    for (const keyName of ['counselDate', 'timeSlot', 'optionId']) {
      const value = details[keyName]
      if (value !== originalData[keyName]) {
        updates[keyName] = value
      }
    }

    for (const keyName of ['method', 'numAttendee', 'name', 'mobile']) {
      const value = details[keyName]
      if (value === originalData[keyName]) { continue }

      if (!updates.personalDetails) {
        updates.personalDetails = {}
      }

      updates.personalDetails[keyName] = keyName === 'mobile'
        ? { prefix: value.split(' ')[0], number:  value.split(' ')[1] }
        : value
    }

    if (computedTotalPrice !== data.totalPrice) {
      updates.totalPrice = computedTotalPrice
    }

    return updates
  }

  const onUpdateHandler = async () => {
    if (validateAll()) {
      setUpdateError('')

      try {
        const updatePayload = genUpdatePayload()
        const isUpdatingSchedule = Boolean(updatePayload.counselDate || updatePayload.timeSlot)
        const isRemovingMobile = Boolean(updatePayload?.personalDetails?.mobile) && !Boolean(updatePayload.personalDetails.mobile?.number)
        const hasMobile = !isRemovingMobile && (Boolean(pDetails.mobile.number) || Boolean(updatePayload?.personalDetails?.mobile?.number))
        const warningMsg = isUpdatingSchedule && hasMobile
          ? `수정하시겠습니까? 고객에게 일정 변경 알림 문자가 날아갑니다.`
          : `예약 내용을 수정하시겠습니까?`

        if (isUpdatingSchedule) {
          await checkDateAndTimeAvailable(details.counselDate, details.timeSlot)
        }

        if (window.confirm(warningMsg)) {
          const res = await updateReservationDetails({
            id: reservationId,
            updates: updatePayload,
            notifyScheduleUpdate: isUpdatingSchedule && hasMobile
          }).unwrap()

          addToastItem({
            type: 'success',
            heading: '수정 완료!',
            content: '예약 내용이 성공적으로 수정되었습니다.'
          })
          navigate(`/admin/manage-reservation-item/${reservationId}?reload=true`)
        }
      } catch (err) {
        if (err?.data?.errType === CLIENT_ERROR_TYPES.EXISTING_RESERVATION) {
          setUpdateError(
            err.data.invalidType === 'mobile'
              ? '동일한 연락처의 예약이 이미 존재합니다.'
              : '중복된 예약 내역이 존재합니다. 날짜/시간 혹은 연락처를 다시 입력해주세요.'
          )
        } else {
          setUpdateError(err?.message || err?.data?.message)
        }

        return
      }
    }
  }

  // views
  const feedbackEl = (isLoadingDetails || isDayoffsLoading || isLoadingStatus)
    ? <div className='admin-feedback-container'>
        <TextLoader>
          예약 아이템/쉬는날 데이터 로딩중...
        </TextLoader>
      </div>
    : (isDetailsError || isDayoffsError || isStatusError)
      ? <Feedback type='error' classes='mt-20' showError={true}>
          예약 아이템/쉬는날 데이터 로드중 에러가 발생하였습니다.
        </Feedback>
      : null

  return (
    <AdminPageTemplate classes='page-admin-update-reservation-item'>
      <h2 className='admin-page-title mb-40'>
        <i className='icon-clock is-prefix'></i>
        <span>예약 항목 수정</span>
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

            <div className='reservation-details-container mt-30'>
              <div className='form-field select-date-time-container mb-40'>
                <span className='label mb-10'>날짜/시간 선택</span>

                <div className='calendar-container'>
                  <Calendar onChange={onCalendarSelect}
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
                <div className='summary-list__title c-table-title'>예약 내용 수정</div>

                
                <div className='summary-list__item align-center'>
                  <span className='summary-list__label'>이름</span>
                  {
                    isAdminGenerated
                      ? <>
                          <input type='text'
                            data-vkey='name'
                            min={todayDateStr}
                            className={cn('input is-small form-el-value')}
                            value={details.name}
                            onInput={updateFactory('name')} />
                        </>
                      : <span className='summary-list__value is-normal-color'>
                          {pDetails.name}
                          <span className='ml-4'>{pDetails.gender === 'male' ? '(남)' : '(여)'}</span>
                        </span>
                  }
                </div>

                <div className='summary-list__item align-center mobile-field'>
                  <span className='summary-list__label'>전화번호</span>

                  <MobileNumberField isSmall={true} getAsString={true}
                    initValueStr={originalData.mobile}
                    onUpdate={onMobileUpdate}
                    isError={isErrorActive('mobile')} />
                </div>

                {
                  !isAdminGenerated &&
                  <div className='summary-list__item align-center'>
                    <span className='summary-list__label'>상담 옵션</span>
                    <span className='summary-list__value'>
                      <span className='selectbox is-small form-el-value'>
                        <select className='select'
                          tabIndex='0'
                          value={details.optionId}
                          data-vkey='optionId'
                          onChange={updateFactory('optionId')}>
                          {
                            COUNSEL_OPTIONS_LIST.map(entry => (
                              <option value={entry.id} key={entry.id}>{entry.name}</option>
                            ))
                          }
                        </select>
                      </span>
                    </span>
                  </div>
                }

                <div className='summary-list__item align-center'>
                  <span className='summary-list__label'>상담 방식</span>
                  <span className='summary-list__value'>
                    <span className='selectbox is-small form-el-value'>
                      <select className='select'
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
                  </span>
                </div>

                {
                  !isAdminGenerated &&
                  <div className='summary-list__item align-center'>
                    <span className='summary-list__label'>
                      총 상담 인원 <span className='text-color-magenta'>(본인 포함)</span>
                    </span>
                    <span className='summary-list__value'>
                      <span className='selectbox is-small form-el-value'>
                        <select  className={cn('select', isErrorActive('numAttendee') && 'is-error')}
                          tabIndex='0'
                          value={details.numAttendee}
                          data-vkey='numAttendee'
                          onChange={updateFactory('numAttendee')}>
                          {
                            numAttendeeOptions.map(
                              num => (<option key={num} value={num}>{num}</option>)
                            )
                          }
                        </select>
                      </span>
                    </span>
                  </div>
                }

                {
                  !isAdminGenerated &&
                  <div className='summary-list__item align-center'>
                    <span className='summary-list__label'>
                      총 가격 <span className='text-color-magenta'>(자동계산)</span>
                    </span>
                    <span className='summary-list__value is-little-big'>
                      <span className='total-price-value'>
                        {displayMoney(computedTotalPrice)}
                      </span>
                    </span>
                  </div>
                }
              </div>

              {
                formError?.errMsg &&
                <Feedback type='error' classes='mt-20' showError={true}>
                  { formError?.errMsg }
                </Feedback>
              }

              {
                updateError &&
                <Feedback type='error' classes='mt-20' showError={true}>
                  { updateError }
                </Feedback>
              }

              <div className='buttons-container is-right-aligned mt-30 mb-0'>
                <StateButton classes='is-primary'
                  type='button'
                  disabled={!enableUpdateBtn}
                  onClick={onUpdateHandler}
                >수정하기</StateButton>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}