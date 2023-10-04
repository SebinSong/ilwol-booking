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

// hooks
import { useValidation } from '@hooks/useValidation'

import './Login.scss'

export default function Login () {
  const navigate = useNavigate()

  // state
  const [details, setDetails] = useImmer({
    email: '',
    password: ''
  })
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
      }
    ]
  )

  // computed state
  const enableLoginBtn = useMemo(
    () => details.email.length > 3 && details.password.length >= 6,
    [details]
  )

  // methods
  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })

      if (formError?.errKey === key) { clearFormError() }
    }
  }

  const submitHandler = e => {
    e.preventDefault()

    if (validateAll()) {
      // TODO!
    }
  }

  return (
    <PageTemplate classes='page-login'>
      <div className='page-form-constraints'>
        <div className='login-header mt-40'>
          <ShieldIcon classes='shield-icon' />
          <h2 className='is-title-2 is-sans page-title'>관리자 로그인</h2>
        </div>

        <form className='login-form mt-50' onSubmit={submitHandler}>
          <label className='form-field'>
            <span className='label'>이메일</span>

            <input type='text'
              className={cn('input', isErrorActive('email') && 'is-error')}
              data-vkey='email'
              value={details.email}
              onInput={updateFactory('email')}
              placeholder='이메일을 입력하세요' />
          </label>

          <WarningMessage toggle={isErrorActive('email')} message={formError?.errMsg} />

          <PasswordInput value={details.password}
            onInput={updateFactory('password')}
            vKey='password'
            classes='page-login__password'
            placeholder='비밀번호를 입력하세요' />

          <div className='buttons-container mt-40'>
            <button type='submit'
              className='is-primary'
              disabled={!enableLoginBtn}>
              로그인
            </button>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
