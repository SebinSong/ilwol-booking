import React, { useState } from 'react'
import { classNames as cn } from '@utils'

const { WarningMessage } = React.Global

import './PasswordInput.scss'

function PasswordInput ({
  onInput = () => {},
  value = '',
  classes = '',
  errorMsg = '',
  vKey = 'password',
  label = '비밀번호',
  placeholder = '비밀번호',
  hideHelper = false
}) {
  const [revealed, setRevealed] = useState(false)

  // computed state
  const eyeIcon = revealed ? 'icon-eye' : 'icon-eye-off'
  const inputType = revealed ? 'text' : 'password'

  // methods
  const toggleReveal = () => setRevealed(v => !v)

  return (
    <>
      <label className={cn('form-field', 'password-input-master', Boolean(errorMsg) && 'is-error', classes)}>
        <span className='label'>{label}</span>

        <div className='selectgroup'>
          <button className='is-secondary is-icon-btn password-input__toggle-btn'
            type='button'
            onClick={toggleReveal}>
            <i className={eyeIcon}></i>
          </button>

          <input type={inputType}
            className={cn('input', { 'is-error': errorMsg })}
            data-vkey={vKey}
            value={value}
            onInput={onInput}
            placeholder={placeholder} />
        </div>

        {
          errorMsg
            ? <WarningMessage toggle={true} message={errorMsg} />
            : !hideHelper
              ? <p className='helper info'>최소 6자 입력</p>
              : null
        }
      </label>
    </>
  )
}

export default React.memo(PasswordInput)