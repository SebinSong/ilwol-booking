import React, { useMemo } from 'react'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'
import PageTemplate from '@pages/PageTemplate'
import ShieldIcon from '@components/svg-icons/ShieldIcon'
import PasswordInput from '@components/password-input/PasswordInput'
import {
  validateEmail,
  classNames as cn
} from '@utils'

const { WarningMessage } = React.Global
const ANSWER = '창원'

// hooks
import { useValidation } from '@hooks/useValidation'

import './AuthPageCommon.scss'

export default function Signup () {
  const navigate = useNavigate()

  // local state
  const [details, setDetails] = useImmer({
    email: '',
    password: '',
    passwordConfirm: '',
    quiz: ''
  })

  // validation
  const {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  } = useValidation(
    details,
    [
      {
        key: 'email',
        check: validateEmail,
        errMsg: '올바른 포맷의 이메일을 입력하세요.'
      },
      {
        key: 'passwordConfirm',
        check: (val, details) => val === details.password,
        errMsg: '재입력 비밀번호가 일치하지 않습니다.'
      },
      {
        key: 'quiz',
        check: (val) => val === ANSWER,
        errMsg: '답변이 올바르지 않습니다.'
      }
    ]
  )

  // computed state
  const enableSubmitBtn = useMemo(
    () => Object.values(details).every(Boolean),
    [details]
  )

  // methods
  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })

      if (isErrorActive(key)) {
        clearFormError()
      }
    }
  }

  const signupHandler = e => {
    e.preventDefault()

    if (validateAll()) {
      alert('coming soon!')
    }
  }

  return (
    <PageTemplate classes='page-auth'>
      <div className='page-form-constraints'>
        <div className='signup-header mt-40'>
          <ShieldIcon classes='shield-icon' />
          <h2 className='is-title-2 is-sans page-title'>관리자 계정 생성</h2>
        </div>

        <form className='signup-form mt-50' onSubmit={signupHandler}>
          <label className='form-field'>
            <span className='label'>이메일</span>

            <input type='text'
              className={cn('input', isErrorActive('email') && 'is-error')}
              data-vkey='email'
              value={details.email}
              onInput={updateFactory('email')}
              placeholder='이메일' />
          </label>

          <WarningMessage toggle={isErrorActive('email')} message={formError?.errMsg} />

          <PasswordInput value={details.password}
            onInput={updateFactory('password')}
            vKey='password'
            classes='signup__password'
            placeholder='비밀번호' />
        
          <PasswordInput value={details.passwordConfirm}
            onInput={updateFactory('passwordConfirm')}
            vKey='passwordConfirm'
            classes='signup__password-confirm'
            errorMsg={isErrorActive('passwordConfirm') ? formError?.errMsg : ''}
            placeholder='비밀번호 확인'
            label='비밀번호 확인'
            hideHelper={true} />

          <label className='form-field'>
            <span className='label'>Q. 일월선녀님의 고향은?</span>

            <input type='text'
              className={cn('input', isErrorActive('quiz') && 'is-error')}
              data-vkey='quiz'
              value={details.quiz}
              onInput={updateFactory('quiz')}
              placeholder='답변 입력' />
          </label>

          <WarningMessage toggle={isErrorActive('quiz')} message={formError?.errMsg} />

          <div className='buttons-container mt-40'>
            <button type='submit'
              className='is-primary'
              disabled={!enableSubmitBtn}>
              제출
            </button>

            <span className='link login-link'
              onClick={() => navigate('/admin-login')}>로그인 화면으로</span>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
