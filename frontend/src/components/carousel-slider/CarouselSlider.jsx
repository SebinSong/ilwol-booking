import React, { useState, useEffect, useRef } from 'react'

// components
import CarouselSliderNav from './CarouselSliderNav.jsx'
import CarouselReviewCard from './CarouselReviewCard.jsx'

// utils
import { classNames as cn } from '@utils'
import testimonials from '@view-data/testimonials.js'

import './CarouselSlider.scss'

// helpers
const dataMap = {
  'testimonial': testimonials
}

function CarouselSlider ({
  classes = '',
  type = 'testimonial' // enum of ['testimonial', 'youtube'] etc.
}) {
  // local-state
  const [currentIndex, setCurrentIndex] = useState(1)
  const scrollTimeoutId = useRef(null)
  const scrollContainerEl = useRef(null)

  // derived local-state
  const data = dataMap[type]
  const totalDataLen = Array.isArray(data) ? data.length: null

  // methods
  const scrollHandler = (e) => {
    clearTimeout(scrollTimeoutId.current)
    scrollTimeoutId.current = setTimeout(() => {
      onScrollEnd()
    }, 60)
  }
  const onScrollEnd = () => {
    const containerEl = scrollContainerEl.current
    const scrollLeft = containerEl.scrollLeft
    const allChildren = Array.from(containerEl.querySelectorAll('[data-index]'))
      .map(childEl => ({ index: parseInt(childEl.dataset.index), left: childEl.offsetLeft }))
    const closestChild = allChildren.find(x => x.left > scrollLeft)

    if (closestChild && closestChild.index !== currentIndex) {
      setCurrentIndex(closestChild.index)
    }
  }

  const navButtonClickHandler = (targetIndex) => {
    if (currentIndex !== targetIndex && scrollContainerEl.current) {
      const targetCard = scrollContainerEl.current.querySelector(`[data-index="${targetIndex}"]`)

      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: (targetIndex === 1 || targetIndex === totalDataLen) ? 'nearest' : 'center'
        })
        setCurrentIndex(targetIndex)
      }
    }
  }

  return (
    <div className={cn('carousel-slider', `is-type-${type}`, classes)}>
      <div className='carousel-slider-content' ref={scrollContainerEl}
        onScroll={scrollHandler}>
        {
          data.map(
            (entry, index) => <CarouselReviewCard key={entry.id} index={index+1} {...entry} />
          )
        }
      </div>

      <CarouselSliderNav current={currentIndex}
        onChange={navButtonClickHandler}
        total={totalDataLen} />
    </div>
  )
}

export default React.memo(CarouselSlider)
