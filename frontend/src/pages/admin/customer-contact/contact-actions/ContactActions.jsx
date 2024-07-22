import { memo } from 'react'

import './ContactActions.scss'

function ContactActions ({
  classes,
  selectCount = 0,
  onSend = () => {},
}) {
  if (selectCount === 0) { return null }

  // methods
  const onSendClick = (e) => {
    e.stopPropagation()

    onSend && onSend()
  }

  return (
    <div className={`contact-actions-container ${classes}`}>
      <div className='select-count'>
        <span className='num'>{selectCount}</span>
        <span>개의 연락처 선택</span>
      </div>

      <div className='btns-container'>
        <button className='is-primary is-extra-small'
         onClick={onSendClick}>
          <i className='icon-mail is-prefix'></i>
          <span>단체 문자 보내기</span>
        </button>
      </div>
    </div>
  )
}

export default memo(ContactActions)