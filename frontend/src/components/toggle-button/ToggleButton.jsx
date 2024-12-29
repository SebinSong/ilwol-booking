import React from 'react'
import './ToggleButton.scss'

export default function ToggleButton ({
  value = false,
  onChange = () => {}
}) {
  return (
    <div className='toggle-button-container'>
      <input type='checkbox' checked={value} onChange={onChange} />
    </div>
  ) 
}
