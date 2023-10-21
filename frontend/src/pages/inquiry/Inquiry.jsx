import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'
import { validateEmail, classNames as cn } from '@utils'

// hooks
import { useValidation } from '@hooks/useValidation'
import { usePostInquiry } from '@store/features/inquiryApiSlice.js'

// components
import PageTemplate from '../PageTemplate'
import StateButton from '@components/state-button/StateButton'
import Feedback from '@components/feedback/Feedback'
import CommunicationIcon from '@components/svg-icons/CommunicationIcon'

const { WarningMessage } = React.Global

import './Inquiry.scss'

export default function Inquiry () {
  const navigate = useNavigate()

  // local-state
  const [details, setDetails] = useImmer({
    name: '',
    title: '',
    email: '',
    message: ''
  })
  const [isInquirySent, setIsInquirySent] = useState(false)
  const [postInquiry, {
    isLoading,
    isError,
    error
  }] = usePostInquiry()

  // validation setup
  const {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  } = useValidation(details, [
    {
      key: 'name',
      check: val => val.length >= 2,
      errMsg: '이름은 2글자 이상 입력해야 합니다.'
    },
    {
      key: 'email',
      check: val => validateEmail(val),
      errMsg: '올바른 포맷의 이메일을 입력하세요.'
    }
  ])

  // computed state
  const msgLen = details.message.length
  const enableSubmitBtn = Boolean(details.name) &&
    Boolean(details.title) &&
    details.email.length > 3 &&
    msgLen >= 20

  const lenIndicator = `${msgLen}/500`

  // methods
  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })

      if (formError?.errKey === key) {
        clearFormError()
      }
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (validateAll()) {
      try {
        const res = await postInquiry({
          name: details.name,
          email: details.email,
          title: details.title,
          message: details.message
        }).unwrap()

        setIsInquirySent(true)
      } catch (e) {
        console.error('submitHandler in Inquiry.jsx caught: ', e)
      }
    }
  }

  if (isInquirySent) {
    return (
      <PageTemplate classes='page-inquiry'>
        <div className='page-width-constraints'>
          <div className='inquiry-sent-container'>
            <CommunicationIcon classes='sent-icon' width='80' />

            <div className='sent-paragraph'>
              <h3 className='is-title-3'>문의사항/의견이 접수 되었습니다.</h3>
              <span>접수된 내용은 선녀님 또는 관리자가 검토 후에 답변/피드백 드리겠습니다.</span>
            </div>

            <button className='is-secondary'
              type='button'
              onClick={() => navigate('/booking/counsel-option')}>예약 홈으로</button>
          </div>
        </div>
      </PageTemplate>
    )
  }

  return (
    <PageTemplate classes='page-inquiry'>
      <div className='page-width-constraints'>
        <h2 className='is-title-2 is-sans mb-40 page-title'>
          <i className='icon-mail is-prefix'></i>
          <span>문의하기</span>
        </h2>

        <form className='inquiry-submit-form' onSubmit={submitHandler}>
          <div className='name-and-email-container'>
            <label className='name-field'>
              <span className='label'>
                이름
                <span className='mandatory'>{'(필수)'}</span>
              </span>

              <input type='text'
                className={cn('input', isErrorActive('name') && 'is-error')}
                value={details.name}
                onInput={updateFactory('name')}
                data-vkey='name'
                placeholder='이름을 입력하세요' />
            </label>

            <label className='email-field'>
              <span className='label'>
                이메일
                <span className='mandatory'>{'(필수)'}</span>
              </span>

              <input type='text'
                data-vkey='email'
                className={cn('input', isErrorActive('email') && 'is-error')}
                value={details.email}
                onInput={updateFactory('email')}
                placeholder='이메일' />
            </label>
          </div>

          <div className='form-field mt-30'>
            <label>
              <span className='label'>
                제목
                <span className='mandatory'>{'(필수)'}</span>
              </span>

              <input type='text'
                className='input'
                value={details.title}
                onInput={updateFactory('title')}
                placeholder='제목' />
            </label>
          </div>

          <WarningMessage classes='inquiry-form-warning'
            toggle={isErrorActive('email') || isErrorActive('name')}
            message={formError?.errMsg} />

          <div className='form-field mt-30'>

          </div>

          <div className='form-field mb-0 mt-30'>
            <label>
              <span className='label msg-label'>
                문의 사항
                <span className='mandatory'>{'(필수)'}</span>

                { msgLen > 0 &&
                  <span className={cn('length-indicator', msgLen > 500 && 'is-over')}>{lenIndicator}</span>
                }
              </span>

              <textarea type='text' className='textarea'
                value={details.message}
                onInput={updateFactory('message')}
                placeholder='문의하실 사항을 남겨주세요'
                maxLength={500} />
            </label>

            <p className='helper info'>
              문의 사항은 관리자 또는 선녀님께서 검토 후에 메일로 답변 드리겠습니다.
              <span className='has-text-bold'>{'(최소 20자, 최대 500자 이내)'}</span>
            </p>
          </div>

          <Feedback type='error' classes='mt-20'
            showError={isError}
            message='문의사항 접수중 오류가 발생하였습니다. 다시 시도해 주세요.' />

          <div className='buttons-container mt-40'>
            <StateButton type='submit'
              classes='is-primary submit-btn'
              disabled={!enableSubmitBtn}>제출</StateButton>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
