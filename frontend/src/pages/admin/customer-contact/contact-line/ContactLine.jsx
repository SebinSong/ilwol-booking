import React, { useState, useContext } from 'react'

// utils
import { ToastContext } from '@hooks/useToast.js'
import {
  numericDateToString,
  humanDate,
  classNames as cn
} from '@utils'

import './ContactLine.scss'

// helpers
const dateReadable = date => {
  const d = new Date(numericDateToString(date))
  return humanDate(d, { month: 'short', day: 'numeric', year: 'numeric' })
}

function ContactLine ({
  data = {},
  classes = ''
}) {
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [isContentOpen, setIsContentOpen] = useState(false)
  const {
    name,
    contact,
    contactType,
    confirmed = [],
    pending = []
  } = data

  // methods
  const toggleContent = () => { setIsContentOpen(v => !v) }
  const copyContact = () => {
    if (navigator.clipboard && contact) {
      try {
        navigator.clipboard.writeText(contact)

        addToastItem({
          type: 'success',
          heading: '연락처 복사',
          content: '클립보드에 저장 되었습니다.'
        })
      } catch (err) {
        console.error('copy-to-clipboard action failed: ', err)
      }
    }
  }

  return (
    <div className={cn('admin-contact-line-container', isContentOpen && 'is-content-open', classes)}>
      <div className='contact-line__upper-section'>
        <span className='icon-container'>
          <i className='icon-user'></i>
        </span>

        <div className='name-and-contact'>
          <span className='name-value'>{name}</span>
          <span className='contact-value'>{contact}</span>
        </div>

        <div className='cta-container'>
          <button className='is-extra-small icon-only is-secondary'
            onClick={copyContact}>
            <i className='icon-copy'></i>
          </button>

          <button className='is-extra-small is-secondary'
            onClick={toggleContent}>
              <i className={cn(isContentOpen ? 'icon-chevron-up-circle' : 'icon-chevron-down-circle', 'is-prefix')}></i>
              <span>{isContentOpen ? '접기' : '보기'}</span>
          </button>
        </div>
      </div>
    
      <div className='contact-line__lower-section'>
        {
          confirmed.length > 0 &&
          <div className='contact-reservation-history'>
            <div className='history-type'>
              <span className='inline-small-padding status-pill text-bg-success mr-4'>확정</span>
              내역 -
            </div>
            <div className='history-content'>
              {
                confirmed.map((entry, index) => (
                  <div className='history-item' key={index}>
                    <span>{`${dateReadable(entry.counselDate)} ${entry.timeSlot}`}</span>
                  </div>
                ))
              }
            </div>
          </div>
        }

        {
          pending.length > 0 &&
          <div className='contact-reservation-history'>
            <div className='history-type'>
              <span className='inline-small-padding status-pill text-bg-validation mr-4'>대기</span>
              내역 -
            </div>
            <div className='history-content'>
              {
                pending.map((entry, index) => (
                  <div className='history-item' key={index}>
                    <span>{`${dateReadable(entry.counselDate)} ${entry.timeSlot}`}</span>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default React.memo(ContactLine)
