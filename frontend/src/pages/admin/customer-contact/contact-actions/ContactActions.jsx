import { memo } from 'react'

import './ContactActions.scss'

function ContactActions ({ classes, selectCount = 0 }) {
  if (selectCount = 0) { return null }

  // methods
  const onSendClick = () => {

  }

  return (
    <div className={`contact-actions-container ${classes}`}>
      <div className='select-count'>
        <span className='num'>{selectCount}</span>
        <span>개의 연락처 선택</span>
      </div>

      <button className='is-secondary is-extra-small'
        onClick={onSendClick}>
          <i className='icon-mail is-prefix'></i>
        <span>{ selectCount >= 2? '단체문자 보내기' : '문자 보내기' }</span>
      </button>
    </div>
  )
}

export default memo(ContactActions)