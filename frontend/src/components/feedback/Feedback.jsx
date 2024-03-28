import React, { useEffect, useRef, useState } from 'react'
import { classNames as cn } from '@utils'

import './Feedback.scss'

const iconMap = {
  // type: icon-name
  info: 'icon-info-circle',
  error: 'icon-triangle-exclamation',
  success: 'icon-check-circle'
}

export default function Feedback ({
  type = 'info', // enum of ['info', 'success', 'error']
  message = '',
  onClose = null,
  showError = false,
  hideCloseBtn = false,
  scrollOnDisplay = true,
  children = null,
  classes = ''
}) {
  // local state
  const rootEl = useRef(null)
  const [closed, setClosed] = useState(false)

  // methods
  const closeHandler = () => {
    setClosed(true)
    onClose && onClose()
  }

  useEffect(() => {
    if (showError && scrollOnDisplay) {
      setClosed(false)

      setTimeout(() => {
        rootEl.current && rootEl.current.scrollIntoView({
          block: 'center',
          inline: "nearest"
        })
      }, 50)
    }
  }, [showError])

  if (closed || !showError) { return null }

  return (
    <div ref={rootEl}
      className={cn('feeback-container', `is-type-${type}`, classes)}>
      <i className={cn(iconMap[type], 'feedback-icon')}></i>

      <div className='feedback-message'>{children || message}</div>

      {
        !hideCloseBtn &&
        <button className='is-unstyled feedback-close-btn'
          type='button'
          onClick={closeHandler}>
          <i className='icon-close-circle'></i>
        </button>
      }
    </div>
  )
}
