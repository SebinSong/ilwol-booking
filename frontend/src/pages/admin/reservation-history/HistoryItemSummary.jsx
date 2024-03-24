import React from 'react'

// components
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'
import { formatMoney } from '@utils'

// helpers
const getGender = val => {
  return val === 'male' ? '남'
    : val === 'female' ? '여'
    : 'N/A'
}

const getDOB = dob => {
  if (!dob || !dob?.system) { return 'N/A' }
  const system = dob.system === 'solar' ? '음력' : '양력'
  const zeroPad = v => v.length === 1 ? `0${v}` : v

  return `(${system}) ${dob.year}-${zeroPad(dob.month)}-${zeroPad(dob.date)}`
}

const getMobile = mobile => `${mobile.prefix} ${mobile.number}`

function HistoryItemSummary ({ classes = '', data = null }) {
  if (!data) { return null }

  const {
    dateAndTime,
    name,
    status,
    counselType,
    methodName,
    data: originalData = {}
  } = data

  const {
    originalReservationId = '',
    totalPrice = 0,
    personalDetails: pd = {}
  } = originalData

  return (
    <ul className={classes}>
      <li className='history-item-summary__line'>
        <label className='item-summary__label'>예약 ID</label>
        <div className='item-summary__values'>
          <CopyToClipboard textToCopy={originalReservationId} disablePopup={true}>
            <span className='ctc-preview'>{originalReservationId}</span>
          </CopyToClipboard>
        </div>
      </li>

      <li className='history-item-summary__line is-vertical'>
        <label className='item-summary__label'>상담자</label>

        <div className='sub-line-container'>
          <div className='sub-line'>
            <span className='sub-line__label'>이름</span>
            <span className='sub-line__value has-text-bold'>{name}</span>
          </div>

          <div className='sub-line'>
            <span className='sub-line__label'>성별</span>
            <span className='sub-line__value'>{getGender(pd?.gender)}</span>
          </div>

          <div className='sub-line'>
            <span className='sub-line__label'>생년월일</span>
            <span className='sub-line__value'>{getDOB(pd?.dob)}</span>
          </div>

          <div className='sub-line'>
            <span className='sub-line__label'>연락처(모바일)</span>
            <span className='sub-line__value'>
            {
              pd?.mobile?.number
                ? <CopyToClipboard textToCopy={getMobile(pd.mobile)} disablePopup={true}>
                    <span className='ctc-preview'>{getMobile(pd.mobile)}</span>
                  </CopyToClipboard>
                : 'N/A'
            }
            </span>
          </div>

          <div className='sub-line'>
            <span className='sub-line__label'>연락처(카카오ID)</span>
            <span className='sub-line__value'>
              {
                pd?.kakaoId ? <span className='has-text-bold'>{pd.kakaoId}</span> : 'N/A'
              }
            </span>
          </div>

          <div className='sub-line'>
            <span className='sub-line__label'>연락처(이메일)</span>
            <span className='sub-line__value'>
              {
                pd?.email ? <span className='has-text-bold'>{pd.email}</span> : 'N/A'
              }
            </span>
          </div>
        </div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>상담 날짜</label>
        <div className='item-summary__values'>
          <span className='has-text-bold'>{dateAndTime}</span>
        </div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>예약 상태</label>
        <div className='item-summary__values'>{status}</div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>싱담 타입</label>
        <div className='item-summary__values'>{counselType}</div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>싱담 방식</label>
        <div className='item-summary__values'>{methodName}</div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>총 상담료</label>
        <div className='item-summary__values'>
          {
            !totalPrice
            ? 'N/A'
            : <span className='has-text-bold'>{formatMoney(totalPrice, { minimumFractionDigits: 0 })}</span>
          }
        </div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>싱담 방식</label>
        <div className='item-summary__values'>{methodName}</div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>총 상담 인원</label>
        <div className='item-summary__values'>{pd?.numAttendee ? `${pd.numAttendee} 명` : 'N/A'}</div>
      </li>

      <li className='history-item-summary__line'>
        <label className='item-summary__label'>메모</label>
        <div className='item-summary__values'>{pd?.memo ? pd.memo : 'N/A'}</div>
      </li>
    </ul>
  )
}

export default React.memo(HistoryItemSummary)