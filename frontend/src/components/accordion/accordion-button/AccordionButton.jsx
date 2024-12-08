import React, { useState } from 'react'
import { classNames as cn } from '@utils'

import './AccordionButton.scss'

function AccordionButton ({
  classes = '',
  type = 'default', // enum of [ 'default', 'validation', 'purple 'success', 'warning' ]
  children = '',
  onToggle = null,
  initValue = false
}) {
  // local-state
  const [isOpen, setIsOpen] = useState(initValue)

  // methods
  const clickHandler = () => {
    const newVal = !isOpen

    setIsOpen(newVal)
    onToggle && onToggle(newVal)
  }

  return (
    <button className={cn(
        'accordion-button',
        classes,
        `is-type-${type}`,
        { 'is-open': isOpen }
      )}
      onClick={clickHandler}
    >
      <i className='icon-info-circle accordion-button__pre-icon'></i>
      <span className='accordion-button__text'>{children}</span>
      <i className='icon-chevron-down accordion-button__arrow'></i>
    </button>
  )
}

export default React.memo(AccordionButton)
