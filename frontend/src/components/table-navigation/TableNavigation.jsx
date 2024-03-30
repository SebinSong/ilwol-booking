import React, { useState, useMemo, useEffect } from 'react'

// utils
import { classNames as cn } from '@utils'

import './TableNavigation.scss'

// helpers
const pageUnitList = [
  { id: 'ten', value: 10, name: '10개' },
  { id: 'twenty', value: 20, name: '20개' },
  { id: 'thirty', value: 30, name: '30개' },
  { id: 'fifty', value: 50, name: '50개' },
  { id: 'hundred', value: 100, name: '100개' }
]

function TableNavigation ({
  classes = '',
  value = 0, // index
  unit = 20,
  total = 20,
  onUnitChange = () => {},
  onChange = () => {}
}) {
  // computed state
  const currentNavStatus = useMemo(
    () => {
      const totalIsZero = total === 0
      const start = totalIsZero ? 0 : value * unit
      const end = totalIsZero
        ? 0
        : start + unit >= total
          ? total
          : start + unit

      return (
        <span className='current-nav-status'>
          <span className='curr-start'>{start}</span>
          <span className='delimeter'>-</span>
          <span className='curr-end'>{end}</span>
          <span className='of'>of</span>
          <span className='total-val'>{total}</span>
        </span>
      )
    }, [value, total, unit]
  )

  // methods
  const onPrevClick = () => {
    if (value > 0) {
      onChange(value - 1)
    }
  }

  const onNextClick = () => {
    const maxIndex = Math.ceil(total / unit) - 1

    if (value < maxIndex) {
      onChange(value + 1)
    }
  }

  const unitChangeHandler = (e) => {
    const val = parseInt(e.target.value)
    
    onUnitChange(val)
    onChange(0)
  }

  // effects
  useEffect(() => {
    // reset the index if the filtered/sorted data list has changed.
    onChange(0)
  }, [total])

  return (
    <div className={cn('table-navigation-container', classes)}>
      <span className='selectbox is-small unit-select'>
        <select className='select'
          tabIndex='0'
          value={unit}
          data-vkey='table-sort'
          onChange={unitChangeHandler}>
          {
            pageUnitList.map(entry => (
              <option value={entry.value} key={entry.id}>{entry.name}</option>
            ))
          }
        </select>
      </span>

      <div className='table-navigation-cta-container'>
        {currentNavStatus}

        <span className='nav-buttons'>
          <button className='is-secondary is-icon-btn nav-btn'
            onClick={onPrevClick}>
            <i className='icon-chevron-left'></i>
          </button>
          <button className='is-secondary is-icon-btn nav-btn'
            onClick={onNextClick}>
            <i className='icon-chevron-right'></i>
          </button>
        </span>
      </div>
    </div>
  )
}

export default React.memo(TableNavigation)
