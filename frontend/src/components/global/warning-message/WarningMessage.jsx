import React from 'react'

export default function WarningMessage ({
  toggle = false,
  message = '',
  classes = ''
}) {
  return Boolean(toggle)
  ? (
      <p className={`warning-message ${classes}`}>
        <i className='icon-triangle-exclamation'></i>
        <span>{message}</span>
      </p>
    )
  : null
}
