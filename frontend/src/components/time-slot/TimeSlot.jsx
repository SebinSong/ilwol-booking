import React from 'react'
import { classNames as cn } from '@utils'

import './TimeSlot.scss'

export default function TimeSlot ({
  slotList = [], // [ '12:00', '13:00', ... ]
  value = '',
  onSelect = null,
  classes = ''
}) {
  return (
    <div className={cn('time-slot-container', classes)}>
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
