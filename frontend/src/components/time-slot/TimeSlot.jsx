import React, { useRef, useEffect } from 'react'
import { classNames as cn } from '@utils'

import './TimeSlot.scss'

export default function TimeSlot ({
  slotList = [], // [ '12:00', '13:00', ... ]
  value = '',
  onSelect = null,
  classes = ''
}) {
  const rootEl = useRef(null)

  useEffect(() => {
    // make sure it's noticeable by user
    rootEl.current && rootEl.current.scrollIntoView(true)
  }, [])

  return (
    <div ref={rootEl} className={cn('time-slot-container', classes)}>
      {
        slotList.map(entry => (
          <div className={cn('time-slot-item', value === entry && 'is-active')}
            key={entry}
            tabIndex='0'
            onClick={() => { onSelect && onSelect(entry) }}>
            {entry}
          </div>
        ))
      }
    </div>
  )
}
