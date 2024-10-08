import React, { useState } from 'react'

// components
import ExternalLinkIcon from '@components/svg-icons/ExternalLinkIcon'

// utils
import { classNames as cn } from '@utils'

const videoURL = 'https://youtu.be/aGHIsmhuPn8'
const imgSrc = 'https://img.youtube.com/vi/aGHIsmhuPn8/0.jpg'

export default function NewsVideoBanner ({
  classes = ''
}) {
  // local-state
  const [imageLoaded, setImageLoaded] = useState(false)

  // methods
  const onLoadHandler = () => { setImageLoaded(true) }
  const clickHandler = () => { window.open(videoURL, '_blank') }

  return (
    <div className={cn('jtbc-banner', classes)} tabIndex='0'
      onClick={clickHandler}>
      <div className={cn('img-container', imageLoaded && 'is-loaded')}>
        <div className='img-aspect-ratio-box'>
          <img src={imgSrc} onLoad={onLoadHandler} />
          <i className='icon-video'></i>
        </div> 
      </div>

      <div className='video-details'>
        <span className='details-title'>
          2022년 'JTBC 사건반장' 출연!
          <ExternalLinkIcon classes='title-link-icon' />
        </span>
        <span className='details-desc'>
          2022년 월드컵 조별예선 결과 족집게 예측이 인터넷 상에 큰 이슈가 되어 뉴스에 소개됨.
        </span>
      </div>
    </div>
  )
}