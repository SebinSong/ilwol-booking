import React, { useState } from 'react'

// utils
import { classNames as cn } from '@utils'

function CarouselYoutubeCard ({
  classes = '',
  title,
  imgSrc = '',
  url = '',
  description = '',
  index = 1000
}) {
  // local-state
  const [imageLoaded, setImageLoaded] = useState(false)

  // methods
  const onLoadHandler = () => { setImageLoaded(true) }
  const clickHandler = () => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <div tabIndex={0}
      data-index={index}
      className={cn('carousel-youtube-card', classes)}
      onClick={clickHandler}
    >
      <div className={cn('youtube-img-container', imageLoaded && 'is-loaded')}>
        <img src={imgSrc} onLoad={onLoadHandler} />
      </div>

      <div className='youtube-details'>
        <span className='details-title'>{title}</span>
        <span className='details-desc'>{description}</span>
      </div>
    </div>
  )
}

export default React.memo(CarouselYoutubeCard)
