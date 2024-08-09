import React, { useRef, useEffect } from "react"

// helpers
const typeMap = {
  'youtube-feedback': '유튜브 댓글',
  'visit-review': '방문 후기'
}

function CarouselReviewCard ({
  classes = '',
  type = 'visit-review',
  name = '', 
  date = '',
  content = '',
  index = 1000
}) {
  // local state
  const contentEl = useRef(null)

  // effects
  useEffect(() => {
    if (content && contentEl.current) {
      contentEl.current.innerHTML = content
    }
  }, [content])

  return (
    <div data-index={index} className={`carousel-review-card ${classes}`}>
      <div className='carousel-review-card__review-content'>
        <div className='review-content-wrapper' ref={contentEl}></div>

        <i className='icon-chat-bubbles deco-icon'></i>
      </div>

      <div className='carousel-review-card__review-metadata'>
        <div className='user-icon-container'>
          <i className='icon-user'></i>
        </div>

        <div className='reviewer-details'>
          <div className='reviewer-name'>{name}</div>
          <div className='review-date-and-tag'>
            <span className='date'>{date}</span>
            <span className={`review-tag is-${type}`}>{typeMap[type]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CarouselReviewCard)
