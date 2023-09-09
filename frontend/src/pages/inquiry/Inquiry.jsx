import React from 'react'
import { validateEmail } from '@utils'
import { useImmer } from 'use-immer'

import PageTemplate from '../PageTemplate'

import './Inquiry.scss'

export default function Inquiry () {
  // local-state
  const [details, setDetails] = useImmer({
    name: '',
    email: '',
    message: ''
  })

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
    }
  }

  const submitHandler = () => {
    alert('Coming soon.')
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

              <input type='text' className='input'
                value={details.name}
                onInput={updateFactory('name')}
                placeholder='이름을 입력하세요' />
            </label>

            <label className='email-field'>
              <span className='label'>
                이메일
                <span className='mandatory'>{'(필수)'}</span>
              </span>

              <input type='text' className='input'
                value={details.email}
                onInput={updateFactory('email')}
                placeholder='이메일' />
            </label>
          </div>

          <div className='form-field'>
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

          <div className='buttons-container mt-50'>
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
