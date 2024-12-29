import React from 'react'

// utils
import { classNames as cn } from '@utils'

import './ToggleButton.scss'

export default function ToggleButton ({
  value = false,
  disabled = false,
  onChange = () => {}
}) {
  const clickHandler = (e) => {
    e.preventDefault()
    onChange(!value)
  }

  return (
    <div className={cn('toggle-button-container', { 'is-on': value, 'is-disabled': disabled })}>
      <input className='toggle-input' type='checkbox' checked={value} onClick={clickHandler} />
      <div className='toggle-track'>
        <span className='toggle-thumb'></span>
      </div>
    </div>
  ) 
}
