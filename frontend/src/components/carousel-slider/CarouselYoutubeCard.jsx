import React, { useState, useRef } from 'react'

// components
import ExternalLinkIcon from '@components/svg-icons/ExternalLinkIcon'

// utils
import { classNames as cn } from '@utils'

function CarouselYoutubeCard ({
  classes = '',
  title,
  videoId = '',
  date = '',
  index = 1000
}) {
  // local-state
  const videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}`
  const [loaded, setLoaded] = useState(false)
  const iframeEl = useRef(null)

  // methods
  const loadHandler = () => { setLoaded(true) }

  return (
    <div tabIndex={0}
      data-index={index}
      className={cn('carousel-youtube-card', classes, loaded && 'is-loaded')}>
      <div className='video-container'>
        <iframe width='100%' height='100%'
          ref={iframeEl}
          title='Youtube video player'
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          src={videoUrl}
          allowFullScreen
          onLoad={loadHandler}>
        </iframe>
      </div>

      <p className='video-title'>
        <span className='title-block'>
          <i className='icon-video'></i>
          <span className='text'>{title}</span>
        </span>
        
        <span className='video-date'>{date}</span>
      </p>
    </div>
  )
}

export default React.memo(CarouselYoutubeCard)
