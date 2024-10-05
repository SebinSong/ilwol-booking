import React from 'react'

// helpers
import {
  genArrayFromNumber,
  classNames as cn
} from '@utils'

function CarouselSliderNav ({
  classes = '',
  total = 3,
  current = 1,
  onChange = () => {}
}) {
  // local-state
  const dotArr = genArrayFromNumber(total, true)

  // methods
  const onPrevClick = () => {
    if (current > 1) {
      onChange(current - 1)
    } else if (current === 1) {
      onChange(1)
    }
  }
  const onNextClick = () => {
    if (current === total) {
      onChange(total)
    } else if (current < total) {
      onChange(current + 1)
    }
  }

  return (
    <div className={`carousel-slider__nav ${classes}`}>
      <button className='is-primary is-extra-small icon-only carousel-slider__nav-btn is-prev-btn'
        onClick={onPrevClick}>
        <i className='icon-chevron-left'></i>
      </button>

      <div className='carousel-slider__nav-dots'>
        {
          dotArr.map(index => (
            <span key={index}
              className={cn('carousel-slider__index-dot', index === current && 'is-active')}
            ></span>
          ))
        }
      </div>

      <button className='is-primary is-extra-small icon-only carousel-slider__nav-btn is-next-btn'
        onClick={onNextClick}>
        <i className='icon-chevron-right'></i>
      </button>
    </div>
  )
}

export default React.memo(CarouselSliderNav)
