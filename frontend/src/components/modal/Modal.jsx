import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// utils
import { classNames as cn } from '@utils'

export default function Modal ({
  classes='',
  showModal = false,
  children = null,
  onCloseClick = () => {},
  onBackDropClick = () => {}
}) {
  // local-state
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [isHiding, setIsHiding] = useState(false)

  // methods
  const onBackDropClickHandler = () => {
    console.log('Backdrop click!!')
    onBackDropClick()
  }

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
        <div className={cn('modal', isHiding && 'is-leaving')}>
          <div className='modal__backdrop' onClick={onBackDropClickHandler}></div>

          <div className='modal__wrapper'>
            <button className='modal-close-btn' onClick={onCloseClick}>
              <i className='icon-close'></i>
            </button>

            <section className={cn('modal__content', classes)}>
              {children}
            </section>
          </div>
        </div>,
        document.querySelector('#modal-container')
      )
    : null
}