import React from 'react'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'
import { COUNSEL_METHOD, DEFAULT_TIME_SLOTS } from '@view-data/constants.js'

// components
import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useValidation } from '@hooks/useValidation'

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

  // local-state
  const [details, setDetails] = useImmer({
    name: '',
    counselDate: todayDateStr,
    timeSlot: '',
    method: ''
  })

  // validation
  const {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  } = useValidation(details, [])

  // methods
  const updateFactory = key => {
    return e => {
      const val = e.target.value

      setDetails(draft => {
        draft[key] = val
      })

      if (isErrorActive(key)) {
        clearFormError()
      }
    }
  }

  const undefaultSubmit = (e) => {
    e.preventDefault()
  }

  const submitHandler = async () => {
    alert('coming soon!')
  }

  return (
    <AdminPageTemplate classes='page-admin-add-reservation-item'>
      <h2 className='admin-page-title'>
        <i className='icon-pencil is-prefix'></i>
        <span>예약 생성</span>
      </h2>

      <div className='admin-add-reservation-item-content'>
        <form className='form-container' onSubmit={undefaultSubmit}>
          <div className='summary-list'>
            <div className='form-field'>
              <label>
                <span className='label'>이름</span>

                <input type='text'
                  className={cn('input common-input-width', isErrorActive('name') && 'is-error')}
                  data-vkey='name'
                  value={details.name}
                  onInput={updateFactory('name')}
                  placeholder='이름을 입력하세요' />
              </label>

              {
                isErrorActive('name')
                  && <WarningMessage toggle={true} message={formError?.errMsg} />
              }
            </div>

            <div className='form-field'>
              <label>
                <span className='label'>상담 날짜</span>

                <input type='date'
                  lang='ko'
                  data-vkey='counselDate'
                  min={todayDateStr}
                  className='input common-input-width'
                  value={details.counselDate}
                  onInput={updateFactory('counselDate')} />
              </label>

              {
                isErrorActive('counselDate')
                  && <WarningMessage toggle={true} message={formError?.errMsg} />
              }
            </div>

            <div className='form-field'>
              <label>
                <span className='label'>상담 시간</span>

                <span className='selectbox'>
                  <select className='select common-input-width'
                    tabIndex='0'
                    value={details.timeSlot}
                    data-vkey='timeSlot'
                    onChange={updateFactory('timeSlot')}>
                    {
                      DEFAULT_TIME_SLOTS.map(slot => (
                        <option value={slot} key={slot}>{slot}</option>
                      ))
                    }
                  </select>
                </span>
              </label>

              {
                isErrorActive('timeSlot')
                  && <WarningMessage toggle={true} message={formError?.errMsg} />
              }
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

              {
                isErrorActive('method')
                  && <WarningMessage toggle={true} message={formError?.errMsg} />
              }
            </div>
          </div>

          <div className='buttons-container is-right-aligned mt-30 mb-0'>
            <StateButton classes='is-primary'
              type='submit'
              onClick={submitHandler}
            >생성하기</StateButton>
          </div>
        </form>
      </div>
    </AdminPageTemplate>
  )
}
