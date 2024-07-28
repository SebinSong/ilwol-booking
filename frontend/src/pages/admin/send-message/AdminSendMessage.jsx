import React, { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { MOBILE_PREFIXES } from '@view-data/constants.js'
import { isStringNumberOnly } from '@utils'

// components
const { WarningMessage } = React.Global
import AdminPageTemplate from '@pages/AdminPageTemplate'
import StateButton from '@components/state-button/StateButton'
import LoaderModal from '@components/loader-modal/LoaderModal'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import { useSendWebMessage } from '@store/features/adminApiSlice.js'

import './AdminSendMessage.scss'

export default function AdminSendMessage () {
  const navigate = useNavigate()
  const { addToastItem } = useContext(ToastContext)
  const { state = {} } = useLocation() 
  const isFromCustomerContact = state?.isFromCustomerContact || false

  // local state
  const [details, setDetails] = useImmer({
    prefix: '010',
    firstSlot: '',
    secondSlot: '',
    mobileNumList: Array.isArray(state?.to) ? state.to : [],
    message: state?.autoMsg ? state.autoMsg : ''
  })
  const [showFailed, setShowFailed] = useState(false)
  const [failedTries, setFailedTries] = useState(null)
  const [sendWebMessage, {
    isLoading: isSending
  }] = useSendWebMessage()
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
    const numToAdd = `${prefix}${firstSlot}${secondSlot}`.trim()

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
    if (!window.confirm('메세지 발송을 진행하시겠습니까?')) { return }

    setShowFailed(false)
    const { mobileNumList, message } = details 
    try {
      const result = await sendWebMessage({
        message,
        to: mobileNumList.map(num => num.replaceAll('-', ''))
      })
      const failedLen = result?.failed?.length || 0
      const successCount = mobileNumList.length - failedLen

      if (failedLen) {
        setFailedTries(result.failed)
        setShowFailed(true)
      }

      addToastItem({
        type: 'success',
        heading: `발송 완료 (${successCount}건)`,
        content: `총 ${successCount} 건의 메세지를 성공적으로 발송하였습니다.`
      })
    } catch (err) {
      console.error('AdminSendMessage.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '발송 오류',
        content: '메세지 발송에 실패하였습니다. 다시 시도해 주세요.'
      })
    }
  }

  return (
    <AdminPageTemplate classes='page-admin-send-message'>
      <div className='admin-send-message-wrapper'>
        <h2 className='admin-page-title'>
          <i className='icon-mail is-prefix'></i>
          <span>문자 전송하기</span>
        </h2>

        <p className='admin-page-description'>[일월선녀 해달별] 태그가 달린 Web발신 문자를 전송합니다. 여러개의 번호를 추가하여 단체문자를 보낼수도 있습니다.</p>

        <div className='page-form-constraint'>
          {
            isFromCustomerContact &&
            <div className='top-cta-container mb-20'>
              <button className='is-secondary is-small'
                onClick={() => navigate('/admin/customer-contact')}>
                <i className='icon-chevron-left-circle is-prefix'></i>
                <span className='text'>연락처 페이지로</span>
              </button>
            </div>
          }

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

              {
                Boolean(showFailed && failedTries?.length) &&
                <div className='failed-try-container mt-20'>
                  <span className='label text-color-warning mb-10'>{`발송 실패 (${failedTries?.length || 0} 건):`}</span>

                  <div className='failed-try-item'>
                    <div className='failed-num'>01012341234</div>
                    <div className='failed-reason'>'to' 필드는 숫자만 입력 가능하며, 최대 25자까지 가능합니다</div>
                  </div>
                </div>
              }
            </div>

            <div className='page-form-constraint send-message-form mt-50'>
              <div className='form-field'>
                <span className='label'>
                  메세지 작성:
                  <span className='mandatory'>(최소 10자)</span>
                </span>

                <textarea type='text' className='textarea'
                  value={details.message}
                  onInput={genUpdateFactory('message')}
                  placeholder='메세지를 입력하세요.'
                  maxLength={600} />

                <div className='buttons-container is-left-aligned mt-20 mb-30'>
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

        <LoaderModal showModal={isSending}>
          <span>메세지 발송 중..</span>
        </LoaderModal>
      </div>
    </AdminPageTemplate>
  )
}
