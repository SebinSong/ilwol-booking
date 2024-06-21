import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// utils
import { classNames as cn } from '@utils'

export default function Modal ({
  classes='',
  showModal = false,
  children = null,
  hideCloseBtn = false,
  icon = 'info-circle',
  title = '',
  onCloseClick = () => {},
  onBackDropClick = () => {}
}) {
  // local-state
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [isHiding, setIsHiding] = useState(false)

  // methods
  const onBackDropClickHandler = () => {
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
            <header className='modal__header'>
              <i className={cn(`icon-${icon}`, 'modal__icon')}></i>
              {Boolean(title) && <h3 className='modal__title is-title-5'>{title}</h3>}

              <button className='modal-close-btn' onClick={onCloseClick}>
                <i className='icon-close'></i>
              </button>
            </header>

            <section className={cn('modal__content', classes)}>
              {children}
            </section>
          </div>
        </div>,
        document.querySelector('#modal-container')
      )
    : null
}