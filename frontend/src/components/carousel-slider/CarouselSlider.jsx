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
  children = null,
  type = 'testimonial' // enum of ['testimonial', 'youtube'] etc.
}) {
  // local-state
  const [currentIndex, setCurrentIndex] = useState(1)
  const [nextIndex, setNextIndex] = useState(1)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutId = useRef(null)
  const scrollContainerEl = useRef(null)

  // derived local-state
  const data = dataMap[type]
  const totalDataLen = Array.isArray(data) ? data.length: null

  // methods
  const scrollHandler = (e) => {
    if (!isScrolling) {
      setIsScrolling(true)
    }

    clearTimeout(scrollTimeoutId.current)
    scrollTimeoutId.current = setTimeout(() => {
      setIsScrolling(false)
    }, 40)
  }
  const onScrollEnd = () => {
    console.log('!@# scroll ended!')
    setCurrentIndex(nextIndex)
  }

  const navButtonClickHandler = (targetIndex) => {
    console.log('!@# navButtonClickHandler is called -  targetIndex: ', currentIndex, targetIndex)
    if (currentIndex !== targetIndex && scrollContainerEl.current) {
      console.log('!@# here !! aaaaa')
      const targetCard = scrollContainerEl.current.querySelector(`[data-index="${targetIndex}"]`)

      console.log('!@# targetCard: ', targetCard)
      if (targetCard) {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
        setNextIndex(targetIndex)
      }
    }
  }

  // effects
  useEffect(() => {
    if (!isScrolling) {
      onScrollEnd()
    }
  }, [isScrolling])

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
