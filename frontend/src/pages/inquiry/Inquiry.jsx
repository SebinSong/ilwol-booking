import React from 'react'
import { validateEmail, classNames as cn } from '@utils'
import { useImmer } from 'use-immer'
import { useValidation } from '@hooks/useValidation'

import PageTemplate from '../PageTemplate'

const { WarningMessage } = React.Global

import './Inquiry.scss'

export default function Inquiry () {
  // local-state
  const [details, setDetails] = useImmer({
    name: '',
    email: '',
    message: ''
  })

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
  const enableSubmitBtn = Boolean(details.name) &&
    details.email.length > 3 &&
    details.message.length >= 20

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

  const submitHandler = (e) => {
    e.preventDefault()

    if (validateAll()) {
      alert('Coming soon!')
    }
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

          <WarningMessage classes='inquiry-form-warning'
            toggle={isErrorActive('email') || isErrorActive('name')}
            message={formError?.errMsg} />

          <div className='form-field mb-0 mt-30'>
            <label>
              <span className='label'>
                문의 사항
                <span className='mandatory'>{'(필수)'}</span>
              </span>

              <textarea type='text' className='textarea'
                value={details.message}
                onInput={updateFactory('message')}
                placeholder='문의 하실 사항을 남겨주세요'
                maxLength={500} />
            </label>

            <p className='helper info'>
              문의 사항은 관리자 또는 선녀님께서 검토 후에 메일로 답변 드리겠습니다.
              <span className='has-text-bold'>{'(최소 20자, 최대 500자 이내)'}</span>
            </p>
          </div>

          <div className='buttons-container mt-40'>
            <button type='submit'
              className='is-primary submit-btn'
              disabled={!enableSubmitBtn}>
              제출
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
