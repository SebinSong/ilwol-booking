import React, { useState } from 'react'
import { useImmer } from 'use-immer'
import { MOBILE_PREFIXES } from '@view-data/constants.js'
import { isStringNumberOnly } from '@utils'
// components
const { WarningMessage } = React.Global
import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'

import './AdminSendMessage.scss'

export default function AdminSendMessage () {
  // local state
  const [details, setDetails] = useImmer({
    prefix: '010',
    firstSlot: '',
    secondSlot: '',
    mobileNumList: [],
    message: ''
  })
  const [additionErr, setAdditionErr] = useState('')

  // computed state
  const isAddBtnEnabled = ['firstSlot', 'secondSlot'].every(key => details[key]?.length >= 4)
  
  // methods
  const genUpdateFactory = (key, numberOnly = false) => {
    return e => {
      const val = e.target.value

      if (numberOnly && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft[key] = val
      })

      additionErr && clearAdditionErr()
    }
  }
  const showAdditonError = type => {
    const msgMap = {
      'existing-num': '발신번호가 이미 추가되어 있습니다.'
    }
    setAdditionErr(msgMap[type])
  }
  const clearAdditionErr = () => setAdditionErr('')
  const addNumberToList = () => {
    const { prefix, firstSlot, secondSlot, mobileNumList } = details
    const numToAdd = `${prefix} ${firstSlot}${secondSlot}`.trim()

    if (mobileNumList.includes(numToAdd)) {
      showAdditonError('existing-num')
    } else {
      setDetails(draft => {
        draft.mobileNumList.push(numToAdd)
        draft.firstSlot = ''
        draft.secondSlot = ''
      })
    }
  }
  const removeNumFromList = (num) => {
    if (details.mobileNumList.includes(num)) {
      setDetails(draft => {
        draft.mobileNumList = details.mobileNumList.filter(x => x !== num)
      })
    }
  }
  const onSendBtnClick = async () => {
    alert('준비중...')
  }

  return (
    <AdminPageTemplate classes='page-admin-send-message'>
      <div className='admin-send-message-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-mail is-prefix'></i>
          <span>웹발신 문자 보내기</span>
        </h2>

        <p className='admin-page-description'>"[웹발신] 일월선녀 해달별" 태그가 달린 웹발신 문자를 전송합니다.</p>

        <div className='page-form-constraints'>
          <div className='form-field'>
            <span className='label'>발신번호 추가:</span>

            <div className='mobile-number-field'>
              <div className='selectbox'>
                <select className='select'
                  value={details.prefix}
                  onChange={genUpdateFactory('prefix')}>
                  {
                    MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
                  }
                </select>
              </div>

              <div className='mobile-number-wrapper'>
                <input type='text' className='input'
                  value={details.firstSlot}
                  onInput={genUpdateFactory('firstSlot', true)}
                  maxLength={4}
                  inputMode='numeric'
                  placeholder='예) 1234' />

                <span className='dash-sign'>-</span>

                <input type='text' className='input'
                  value={details.secondSlot}
                  onInput={genUpdateFactory('secondSlot', true)}
                  maxLength={4}
                  inputMode='numeric'
                  placeholder='예) 1234' />
              </div>
            </div>

            {
              additionErr &&
              <WarningMessage toggle={true} message={additionErr} />
            }
    
            <div className='add-btn-container'>
              <button className='is-primary is-small add-btn'
                type='button'
                disabled={!isAddBtnEnabled}
                onClick={addNumberToList}>추가</button>
            </div>
          </div>
        </div>

        {
          Boolean(details.mobileNumList?.length) &&
          <>
            <div className='mobile-num-list-container mt-20'>
              <span className='label mb-20'>
                발신번호 리스트
                <span className='mandatory has-text-bold'>{`(${details.mobileNumList.length} 개)`}</span>
              </span>

              <div className='mobile-num-list'>
                {
                  details.mobileNumList.map(num => (
                    <div className='mobile-number-item' key={num}>
                      <span className='num-text'>{num}</span>
                      <i className='icon-trash num-delete-btn' tabIndex={0}
                        onClick={() => removeNumFromList(num)}></i>
                    </div>
                  ))
                }
              </div>
            </div>

            <div className='page-form-constraints send-message-form mt-50'>
              <div className='form-field'>
                <span className='label'>메세지 작성:</span>

                <textarea type='text' className='textarea'
                  value={details.message}
                  onInput={genUpdateFactory('message')}
                  placeholder='메세지를 입력하세요.'
                  maxLength={500} />

                <div className='buttons-container is-right-aligned mt-30 mb-0'>
                  <StateButton classes='is-primary'
                    type='button'
                    disabled={details.message.length < 10}
                    onClick={onSendBtnClick}
                  >전송하기</StateButton>
                </div>
              </div>
            </div>
          </>
        }
      </div>
    </AdminPageTemplate>
  )
}
