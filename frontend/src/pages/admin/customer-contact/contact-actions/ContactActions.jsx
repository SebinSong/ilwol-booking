import { memo } from 'react'

import './ContactActions.scss'

function ContactActions ({
  classes,
  selectCount = 0,
  onSend = () => {},
  onClear = () => {}
}) {
  if (selectCount === 0) { return null }

  // methods
  const onCtaClick = (e, action) => {
    e.stopPropagation()

    switch (action) {
      case 'cancel': {
        onClear && onClear()
        break
      }
      case 'send': {
        onSend && onSend()
        break
      }
    }
  }
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
        <button className='is-secondary is-extra-small'
          onClick={e => onCtaClick(e, 'cancel')}>
          <i className='icon-trash is-prefix'></i>
          <span>전체 취소</span>
        </button>

        <button className='is-primary is-extra-small'
         onClick={e => onCtaClick(e, 'send')}>
          <i className='icon-mail is-prefix'></i>
          <span>단체 문자</span>
        </button>
      </div>
    </div>
  )
}

export default memo(ContactActions)