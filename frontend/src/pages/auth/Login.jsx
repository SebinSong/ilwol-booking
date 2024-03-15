import React, { useMemo, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'
import { useAdminLogin } from '@store/features/authApiSlice'
import { setCredentials } from '@store/features/authDetailsSlice'
import {
  validateEmail,
  classNames as cn
} from '@utils'
// components
import PageTemplate from '@pages/PageTemplate'
import ShieldIcon from '@components/svg-icons/ShieldIcon'
import PasswordInput from '@components/password-input/PasswordInput'
import StateButton from '@components/state-button/StateButton'
import { CLIENT_ERROR_TYPES } from '@view-data/constants.js'

// hooks
import { useValidation } from '@hooks/useValidation'
import { ToastContext } from '@hooks/useToast.js'

import './AuthPageCommon.scss'

const { WarningMessage } = React.Global

export default function Login () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToastItem } = useContext(ToastContext) 

  // local-state
  const [adminLogin, { isLoading }] = useAdminLogin()
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
  const hideSignupLink = true

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

  const loginHandler = async e => {
    e.preventDefault()

    if (validateAll()) {
      try {
        const res = await adminLogin({
          email: details.email,
          password: details.password
        }).unwrap()

        dispatch(setCredentials(res))
        navigate('/admin/manage-reservation')
      } catch (err) {
        console.error('Login.jsx caught: ', err)
        const errType = err.data.errType || ''

        const typeMap = {
          [CLIENT_ERROR_TYPES.INVALID_FIELD]: 'warning',
          [CLIENT_ERROR_TYPES.PENDING_USER]: 'info'
        }
        const headingMap = {
          [CLIENT_ERROR_TYPES.PENDING_USER]: '승인 대기중!'
        }
        const msgMap = {
          [CLIENT_ERROR_TYPES.INVALID_FIELD]: '올바른 이메일/패스워드를 입력해 주세요.',
          [CLIENT_ERROR_TYPES.PENDING_USER]: '해당 계정은 승인 대기중입니다. 오너에게 문의하세요.'
        }

        addToastItem({
          type: typeMap[errType],
          heading: headingMap[errType] || '로그인 오류!',
          content: msgMap[errType] || '로그인 처리 중 문제가 발생하였습니다. 확인 후 다시 시도해 주세요.',
          delay: 5000
        }, true)
      }
    }
  }

  return (
    <PageTemplate classes='page-auth'>
      <div className='page-form-constraints'>
        <div className='login-header mt-40'>
          <ShieldIcon classes='shield-icon' />
          <h2 className='is-title-2 is-sans page-title'>관리자 로그인</h2>
        </div>

        <form className='login-form mt-50' onSubmit={loginHandler}>
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
            <StateButton classes='is-primary'
              type='submit'
              displayLoader={isLoading}
              disabled={!enableLoginBtn}>로그인</StateButton>
            {
              !hideSignupLink &&
              <span className='link signup-link'
                onClick={() => navigate('/admin-signup')}>계정 새로 만들기</span>
            }
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
