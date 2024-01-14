import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

// child components
import CirculationIcon from '@components/svg-icons/CirculationIcon'

// utils
import { classNames as cn } from '@utils'

function LoaderModal ({
  showModal = false,
  loadingText = '로딩중..'
}) {
  // local-state
  const [displaying, setDisplaying] = useState(showModal)
  const [isHiding, setIsHiding] = useState(false) 

  // effects
  useEffect(() => {
    if (displaying && !showModal) {
      // when it's time to hide the modal, tigger the modal-leaving animation first
      setIsHiding(true)
      setTimeout(() => { setDisplaying(false) }, 450)
    }

    if (!displaying && showModal) {
      setIsHiding(false)
      setDisplaying(true)
    }
  }, [showModal])

  return (
    displaying && (
      createPortal(
        <div className={cn('modal loader-modal', isHiding && 'is-leaving')}>
          <div className='modal__backdrop'></div>

          <div className='modal__content'>
            <CirculationIcon classes='loading-icon' width={56} />

            <p className='loading-text mt-10'>{loadingText}</p>
          </div>
        </div>,
        document.querySelector('#modal-container')
      )
    )
  )
}

export default React.memo(LoaderModal)
