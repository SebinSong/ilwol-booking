import React from 'react'
import { classNames as cn } from '@utils'

import './Toast.scss'

const TYPE_TO_ICON_MAP = {
  'info': 'info-circle',
  'success': 'check-circle',
  'warning': 'triangle-exclamation'
}

export default function Toast ({
  type = 'info',
  id = '',
  heading = '',
  content = '',
  hideClose = false,
  removeItem = () => {}
}) {
  const iconClasses = cn(
    `icon-${TYPE_TO_ICON_MAP[type] || 'gear'}`,
    'toast__icon'
  )

  return (
    <div className={cn('toast', `is-type-${type}`, hideClose && 'is-close-hidden')}>
      <i className={iconClasses} />

    <div className='toast__details'>
      { heading && <h4 className='toast__heading is-title-4'>{heading}</h4> }
      { content && <div className='toast__content'>{ content }</div> }
    </div>

    {
      !hideClose &&
      <button className='is-unstyled icon toast__close-btn'
        onClick={() => { id && removeItem(id) }}
        aria-label='Toast close'>
        <i className='icon-close-circle'></i>
      </button>
    }
    </div>
  )
}
