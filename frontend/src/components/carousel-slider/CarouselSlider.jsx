import React, { useState } from 'react'

// components
import CarouselSliderNav from './CarouselSliderNav.jsx'

import './CarouselSlider.scss'

function CarouselSlider ({
  classes = '',
  children = null,
  type = 'testimonial' // enum of ['testimonial', 'youtube'] etc.
}) {
  // local-state
  const [currentIndex, setCurrentIndex] = useState(1)

  return (
    <div className={`carousel-slider ${classes}`}>
      <div className='carousel-slider-content'>
        컨텐츠
      </div>

      <CarouselSliderNav current={currentIndex}
        onChange={setCurrentIndex}
        total={12} />
    </div>
  )
}

export default React.memo(CarouselSlider)
