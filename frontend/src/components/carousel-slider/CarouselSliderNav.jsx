import React, { useMemo } from 'react'

// helpers
import {
  genArrayFromNumber,
  classNames as cn
} from '@utils'

function CarouselSliderNav ({
  classes = '',
  total = 3,
  current = 1,
  type = 'dots', // enum of ['dots', 'numbers']
  onChange = () => {}
}) {
  // local-state
  const dotArr = useMemo(() => {
    return type === 'dots' ? genArrayFromNumber(total, true) : null
  }, [type])

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

      {
        type === 'numbers' && (
          <div className='carousel-slider__nav-numbers'>
            <span>{current}</span>
            <span>/</span>
            <span>{total}</span>
          </div>
        )
      }
      {
        dotArr && (
          <div className='carousel-slider__nav-dots'>
            {
              dotArr.map(index => (
                <span key={index}
                  className={cn('carousel-slider__index-dot', index === current && 'is-active')}
                ></span>
              ))
            }
          </div>
        )
      }

      <button className='is-primary is-extra-small icon-only carousel-slider__nav-btn is-next-btn'
        onClick={onNextClick}>
        <i className='icon-chevron-right'></i>
      </button>
    </div>
  )
}

export default React.memo(CarouselSliderNav)
