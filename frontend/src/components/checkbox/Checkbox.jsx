import React from 'react'
import { classNames as cn } from '@utils'

function Checkbox ({
  classes = '',
  value = false,
  onChange = () => {},
  text = '',
  children = null
}) {
  return (
    <label className={cn('checkbox-container', classes, Boolean(value) && 'is-active')}>
      <span className='checkbox-custom-wrapper'>
        <input type='checkbox' checked={value}
          onChange={e => onChange(e.target.value)} />
        
        <span className='checkbox-custom'></span>
      </span>

      <span className='checkbox-text'>
        { children || text }
      </span>
    </label>
  )
}

export default React.memo(Checkbox)
