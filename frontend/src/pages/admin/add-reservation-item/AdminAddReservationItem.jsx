import React, { useContext } from 'react'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'
import { COUNSEL_METHOD, DEFAULT_TIME_SLOTS } from '@view-data/constants.js'
import { CLIENT_ERROR_TYPES } from '@view-data/constants.js'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'
import Feedback from '@components/feedback/Feedback'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useCreateAdminReservation } from '@store/features/adminApiSlice.js'
// utils
import {
  classNames as cn,
  stringifyDate
} from '@utils'

import './AdminAddReservationItem.scss'

// helpers
const { WarningMessage } = React.Global
const todayDateStr = stringifyDate(new Date())

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
  const [details, setDetails] = useImmer({
    name: '',
    counselDate: todayDateStr,
    timeSlot: DEFAULT_TIME_SLOTS[0],
    method: 'visit'
  })

  // computed state
  const errFeebackMsg = isError && error.data.errType === CLIENT_ERROR_TYPES.EXISTING_RESERVATION
    ? '선택한 날짜/시간에 이미 예약 아이템이 존재합니다. 다른 옵션을 선택해 주세요.'
    : '예약 처리중 오류가 발생하였습니다. 다시 시도해 주세요.'

  // methods
  const updateFactory = key => {
    return e => {
      const val = e.target.value

      setDetails(draft => {
        draft[key] = val
      })
    }
  }

  const undefaultSubmit = (e) => {
    e.preventDefault()
  }

  const submitHandler = async () => {
    if (!window.confirm(`[${details.counselDate} ${details.timeSlot}] 예약 아이템을 생성하시겠습니까?`)) { return }

    try {
      const res = await createAdminReservation({
        optionId: 'admin-generated',
        counselDate: details.counselDate,
        timeSlot: details.timeSlot,
        personalDetails: { name: details.name }
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '생성 완료!',
        content: '예약 아이템이 생성되었습니다.'
      })
      navigate('/admin/manage-reservation')
    } catch (err) {
      console.error('AdminAddReservationItem caught: ', err)
    }
  }

  return (
    <AdminPageTemplate classes='page-admin-add-reservation-item'>
      <h2 className='admin-page-title'>
        <i className='icon-pencil is-prefix'></i>
        <span>예약 생성</span>
      </h2>

      <p className='admin-page-description'>관리자가 임의로 예약 아이템을 생성합니다.</p>

      <div className='admin-add-reservation-item-content'>
        <form className='form-container' onSubmit={undefaultSubmit}>
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
              <label>
                <span className='label'>상담 날짜</span>

                <input type='date'
                  lang='ko'
                  min={todayDateStr}
                  className='input common-input-width'
                  value={details.counselDate}
                  onInput={updateFactory('counselDate')} />
              </label>

            </div>

            <div className='form-field'>
              <label>
                <span className='label'>상담 시간</span>

                <span className='selectbox'>
                  <select className='select common-input-width'
                    tabIndex='0'
                    value={details.timeSlot}
                    onChange={updateFactory('timeSlot')}>
                    {
                      DEFAULT_TIME_SLOTS.map(slot => (
                        <option value={slot} key={slot}>{slot}</option>
                      ))
                    }
                  </select>
                </span>
              </label>
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
              disabled={details.name.length < 2}
              onClick={submitHandler}
            >생성하기</StateButton>
          </div>
        </form>
      </div>
    </AdminPageTemplate>
  )
}
