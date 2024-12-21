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

// hooks
import { useDeleteContact } from '@store/features/adminApiSlice.js'

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
  onDelete = null,
  selected = false
}) {
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [deleteContactById, { isLoading: isDeletingContact }] = useDeleteContact()
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
  const onSitePayments = records.filter(record => record.status === 'on-site-payment')

  // methods
  const toggleContent = (e) => {
    e.stopPropagation()
    setIsContentOpen(v => !v) 
  }

  const copyContact = (e) => {
    e.stopPropagation()

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
    onSelect && onSelect(data)
  }

  const onMessageBtnClick = (e) => {
    if (contactType !== 'mobile') { return }

    const [prefix, number] = contact.split(' ')
    navigate(
      '/admin/send-message',
      {
        state: {
          to: [`${prefix}${number}`] 
        }
      }
    )
  }

  const onDeleteBtnClick = async (e) => {
    if (!data._id) { return }

    try {
      const result = await deleteContactById(data._id).unwrap()

      addToastItem({
        type: 'success',
        heading: '연락처 삭제',
        content: '연락처가 성공적으로 삭제되었습니다.'
      })

      onDelete && onDelete()
    } catch (err) {
      console.error('ContactLine.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '삭제 오류!',
        content: '연락처 삭제중 오류가 발생하였습니다. 다시 시도해 주세요.'
      })
    }
  }

  const stopClickPropagation = (e) => {
    e.stopPropagation()
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
    <div className={cn('admin-contact-line-container', isContentOpen && 'is-content-open', selected && 'is-selected', classes)}
      onClick={onItemSelect}>
      <div className='contact-line__upper-section'>
        <span className='icon-container'>
          <i className={cn(selected ? 'icon-check' : 'icon-user')}></i>
        </span>

        <div className='name-and-contact'>
          <span className='name-value'>{nameValue}</span>
          <span className='contact-value'>{contactValue}</span>
        </div>

        <div className='cta-container'>
          <button className='is-extra-small is-primary details-btn'
            onClick={toggleContent}>
              <i className={cn(isContentOpen ? 'icon-chevron-up-circle' : 'icon-chevron-down-circle', 'is-prefix')}></i>
              <span>{isContentOpen ? '접기' : '보기'}</span>
          </button>

          <div className='small-btns' onClick={stopClickPropagation}>
            <button className='is-extra-small icon-only is-secondary'
              onClick={copyContact}>
              <i className='icon-copy'></i>
            </button>

            <button className='is-extra-small icon-only is-secondary'
              onClick={onMessageBtnClick}>
              <i className='icon-mail'></i>
            </button>

            <button className='is-extra-small icon-only is-warning-outline'
              onClick={onDeleteBtnClick}
              disabled={isDeletingContact}>
              <i className='icon-trash'></i>
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
          onSitePayments.length > 0 &&
          <div className='contact-reservation-history'>
            <div className='history-type'>
              <span className='inline-small-padding status-pill text-bg-purple mr-4'>현지</span>
              내역 -
            </div>
            <div className='history-content'>
              {
                onSitePayments.map((entry, index) => (
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
