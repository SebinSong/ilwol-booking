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
  classes = '',
  isOverseasOption = false
}) {
  const rootEl = useRef(null)
  const ctcOptions = isOverseasOption
    ? {
        textToCopy: 'dragonrex',
        toastOpt: {
          heading: '카카오 ID 복사',
          content: '클립보드에 저장 되었습니다.'
        }
      }
    : {
        textToCopy: '01095398700',
        toastOpt: {
          heading: '연락처 복사',
          content: '클립보드에 저장 되었습니다.'
        }
      }

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
        제시된 시간 외의 상담 문의는, 선녀님께
        <CopyToClipboard classes='kakao-id-copy'
          {...ctcOptions}>
          { isOverseasOption ? '카톡' : '문자'}
        </CopyToClipboard>
         주세요.
      </div>
    </div>
  )
}
