import React, { useMemo, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import { useNavigate } from 'react-router-dom'

// components
import PageTemplate from '@pages/PageTemplate'
import ShieldIcon from '@components/svg-icons/ShieldIcon'
import { useAdminSignup } from '@store/features/authApiSlice'
import PasswordInput from '@components/password-input/PasswordInput'
import StateButton from '@components/state-button/StateButton'
import RocketIcon from '@components/svg-icons/RocketIcon'

import {
  validateEmail,
  classNames as cn
} from '@utils'
import { CLIENT_ERROR_TYPES } from '@view-data/constants.js'

const { WarningMessage } = React.Global
const ANSWER = 'sunmoonstar'

// hooks
import { useValidation } from '@hooks/useValidation'
import { ToastContext } from '@hooks/useToast.js'
import { setCredentials } from '@store/features/authDetailsSlice'

import './AuthPageCommon.scss'

export default function Signup () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToastItem } = useContext(ToastContext)

  // local state
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [adminSignup, { isLoading }] = useAdminSignup()
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

  const signupHandler = async e => {
    e.preventDefault()

    if (validateAll()) {
      try {
        const res = await adminSignup({
          email: details.email,
          password: details.password
        }).unwrap()

        if (res.isPermitted) {
          addToastItem({
            type: 'success',
            heading: '관리자 계정 생성!',
            content: '주인장님, 관리자 페이지 첫 접속을 환영합니다!',
            delay: 6000
          })

          dispatch(setCredentials(res))
          navigate('/admin/manage-reservation')
        } else {
          setRequestSubmitted(true)
        }
      } catch (err) {
        console.error('Signup.jsx caught: ', err)

        const errType = err.data.errType || ''
        const msgMap = {
          [CLIENT_ERROR_TYPES.EXISTING_USER]: '해당 이메일은 이미 사용중입니다. 다른 이메일을 골라주세요.'
        }

        addToastItem({
          type: 'warning',
          heading: '제출 오류!',
          content: msgMap[errType] || '계정 생성 중 문제가 발생하였습니다. 입력 값들을 확인 후, 다시 시도해 주세요.',
          delay: 6000
        })
      }
    }
  }

  return (
    <PageTemplate classes='page-auth'>
      <div className='page-form-constraints'>
        {
          requestSubmitted
            ? <div className='signup-submitted-content mt-50'>
                <RocketIcon classes='rocket-icon mb-30' width='92' />

                <h3 className='is-title-3 is-sans'>
                  관리자 계정 생성 요청이 접수 되었습니다.
                </h3>

                <p className='account-process-explanation'>
                  요청된 계정은 오너의 검토 후에
                  <span className='text-bg-success inline-small-padding emphasis'>승인</span>
                  이 이뤄집니다.
                </p>

                <div className='buttons-container mt-40'>
                  <button className='is-secondary' type='button'
                    onClick={() => navigate('/')}>
                    홈으로
                  </button>
                </div>
              </div>
            : <>
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
                    <span className='label'>Q. 비밀코드를 입력하세요.</span>

                    <input type='text'
                      className={cn('input', isErrorActive('quiz') && 'is-error')}
                      data-vkey='quiz'
                      value={details.quiz}
                      onInput={updateFactory('quiz')}
                      placeholder='답변 입력' />
                  </label>

                  <WarningMessage toggle={isErrorActive('quiz')} message={formError?.errMsg} />

                  <div className='buttons-container mt-40'>
                    <StateButton classes='is-primary'
                      type='submit'
                      disabled={!enableSubmitBtn}
                      displayLoader={isLoading}>
                      제출
                    </StateButton>


                    <span className='link login-link'
                      onClick={() => navigate('/admin-login')}>로그인 화면으로</span>
                  </div>
                </form>
              </>
        }
      </div>
    </PageTemplate>
  )
}
