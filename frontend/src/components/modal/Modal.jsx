import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// utils
import { classNames as cn } from '@utils'

export default function Modal ({
  classes='',
  showModal = false,
  children = null,
  onCloseClick = () => {}
}) {
  // local-state
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [isHiding, setIsHiding] = useState(false)

  // effects
  useEffect(() => {
    if (showModal && !isDisplaying) { // conditions to display the modal
      setIsHiding(false)
      setIsDisplaying(true)
    } else if (!showModal && isDisplaying) { // conditions to hide the modal
      setIsHiding(true)
      setTimeout(() => setIsDisplaying(false), 350)
    }
  }, [showModal])

  return isDisplaying
    ? createPortal(
        <div className={cn('modal', classes, isHiding && 'is-leaving')}>
          <div className='modal__backdrop'></div>

          <div className='modal__wrapper'>
            <button className='modal-close-btn' onClick={onCloseClick}>
              <i className='icon-close'></i>
            </button>

            <section>
              {children}
            </section>
          </div>
        </div>,
        document.querySelector('#modal-container')
      )
    : null
}