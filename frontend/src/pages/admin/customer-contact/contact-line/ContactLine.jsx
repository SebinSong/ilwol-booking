import React, { useState, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

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
const wrapSearchWithMarkEl = (str, search) => {
  const foundIndex = str.indexOf(search)
  const splitted = [
    str.slice(0, foundIndex),
    search,
    str.slice(foundIndex + search.length)
  ]

  return splitted.map((v, i) => {
    if (v === search) {
      return <mark className='search-highlight' key={i}>{v}</mark>
    } else {
      return <span key={i}>{v}</span>
    }
  })
}

function ContactLine ({
  data = {},
  classes = '',
  searchValue = '',
  onSelect = null,
  selected = false
}) {
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [isContentOpen, setIsContentOpen] = useState(false)
  const {
    name,
    contact,
    contactType,
    records = []
  } = data

  // derived-state
  const confirmed = records.filter(record => record.status === 'confirmed')
  const pending = records.filter(record => record.status === 'pending')
  const cancelled = records.filter(record => record.status === 'cancelled')

  // methods
  const toggleContent = () => { setIsContentOpen(v => !v) }

  const copyContact = () => {
    if (navigator.clipboard && contact) {
      try {
        navigator.clipboard.writeText(contact.replace(/\s/g, ''))

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

  const onItemSelect = (e) => {
    e.preventDefault()

    onSelect && onSelect()
  }

  const onMessageBtnClick = () => {
    if (contactType !== 'mobile') { return }

    const [prefix, number] = contact.split(' ')
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
  const nameValue = useMemo(() => {
    const search = searchValue.trim()

    return (!search || !name.includes(search)) ? name : wrapSearchWithMarkEl(name, search)
  }, [searchValue])
  const contactValue = useMemo(() => {
    const search = searchValue.trim()

    return (!search || !contact.includes(search)) ? contact : wrapSearchWithMarkEl(contact, search)
  }, [searchValue])

  return (
    <div className={cn('admin-contact-line-container', isContentOpen && 'is-content-open', selected && 'is-selected', classes)}>
      <div className='contact-line__upper-section'>
        <span className='icon-container'>
          <i className={cn(selected ? 'icon-check' : 'icon-user')}></i>
        </span>

        <div className='name-and-contact'
          onClick={onItemSelect}>
          <span className='name-value' onClick={onItemSelect}>{nameValue}</span>
          <span className='contact-value'>{contactValue}</span>
        </div>

        <div className='cta-container'>
          <button className='is-extra-small is-primary details-btn'
            onClick={toggleContent}>
              <i className={cn(isContentOpen ? 'icon-chevron-up-circle' : 'icon-chevron-down-circle', 'is-prefix')}></i>
              <span>{isContentOpen ? '접기' : '보기'}</span>
          </button>

          <div className='small-btns'>
            <button className='is-extra-small icon-only is-secondary'
              onClick={copyContact}>
              <i className='icon-copy'></i>
            </button>

            <button className='is-extra-small icon-only is-secondary'
              onClick={onMessageBtnClick}>
              <i className='icon-mail'></i>
            </button>
          </div>
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

        {
          cancelled.length > 0 &&
          <div className='contact-reservation-history'>
            <div className='history-type'>
              <span className='inline-small-padding status-pill text-bg-warning mr-4'>취소</span>
              내역 -
            </div>
            <div className='history-content'>
              {
                cancelled.map((entry, index) => (
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
