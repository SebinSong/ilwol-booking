import React, { useRef, useEffect } from 'react'
import { classNames as cn } from '@utils'

import './TimeSlot.scss'

export default function TimeSlot ({
  slotList = [], // [ '12:00', '13:00', ... ]
  occupiedSlots = [],
  disabledSlots = [],
  value = '',
  onSelect = null,
  classes = ''
}) {
  const rootEl = useRef(null)

  // methods
  const genEntryClass = target => {
    return disabledSlots.includes(target)
      ? 'is-disabled'
      : occupiedSlots.includes(target)
        ? 'is-occupied'
        : target === value
          ? 'is-active'
          : ''
  }

  useEffect(() => {
    // make sure it's noticeable by user
    rootEl.current && rootEl.current.scrollIntoView(true)
  }, [])

  return (
    <div ref={rootEl} className={cn('time-slot-container', classes)}>
      {
        slotList.map(entry => (
          <div className={`time-slot-item ${genEntryClass(entry)}`}
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
