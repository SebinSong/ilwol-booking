import React, { useRef, useEffect } from 'react'
import { classNames as cn } from '@utils'

import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

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

  useEffect(() => {
    if (occupiedSlots?.includes(value)) {
      onSelect('')
    }
  }, [occupiedSlots, value])

  return (
    <div ref={rootEl} className={cn('time-slot-wrapper', classes)}>
      <div className='time-slot-container'>
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

      <div className='time-slot-info mt-20'>
        해당 슬롯 이외의 시간에 상담을 원하시면, 선녀님께
        <CopyToClipboard classes='kakao-id-copy'
          textToCopy='dragonrex'
          toastOpt={{
            heading: '카카오 ID 복사',
            content: '선녀님 카카오 ID가 클립보드에 저장 되었습니다.'
          }}>
          카톡
        </CopyToClipboard>
        으로 문의 바랍니다.
      </div>
    </div>
  )
}
