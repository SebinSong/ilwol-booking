import React, { useState, useMemo } from 'react'
import { classNames as cn } from '@utils'

const { LoaderSpinner } = React.Global

import './StateButton.scss'

function StateButton ({
  classes = '',
  type = 'button',
  onClick = null,
  disabled = false,
  children = null,
  displayLoader = false
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSmall = classes.includes('is-small')

  // computed state
  const renderLoaderAnimation = useMemo(
    () => displayLoader || isSubmitting,
    [displayLoader, isSubmitting]
  )

  // methods
  const submitHandler = async () => {
    setIsSubmitting(true)

    if (onClick) {
      await onClick()
    }

    setIsSubmitting(false)
  }

  return (
    <button className={cn('state-button', renderLoaderAnimation && 'is-submitting', classes)}
      disabled={disabled}
      type={type}
      onClick={submitHandler}>
      { renderLoaderAnimation && 
        <LoaderSpinner classes='state-button__loader'
          width={isSmall ? 12 : 14}
          border={isSmall ? 2: 3} />
      }
      <span className='state-button__content'>{children}</span>
    </button>
  )
}

export default React.memo(StateButton)