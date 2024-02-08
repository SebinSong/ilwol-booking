import React, { useState, useEffect } from 'react'
import { useImmer } from 'use-immer'

// components
const { WarningMessage } = React.Global

// utils
import {
  classNames as cn,
  isStringNumberOnly
} from '@utils'
import { MOBILE_PREFIXES } from '@view-data/constants.js'

function MobileNumberField ({
  classes = '',
  onUpdate = null,
  getAsString = false,
  isSmall = false,
  initValueStr = ''
}) {
  const [prefix, setPrefix] = useState('010')
  const [firstSlot, setFirstSlot] = useState('')
  const [secondSlot, setSecondSlot] = useState('')

  // method
  const updateSlot = (val, isSecond = false) => {
    const updateFunc = isSecond ? setSecondSlot : setFirstSlot

    if (!isStringNumberOnly(val)) { return }
    updateFunc(val)
  }

  // effects
  useEffect(() => {
    if (onUpdate) {
      const combined = getAsString
      ? `${prefix} ${firstSlot}${secondSlot}`
      : { prefix, number: `${firstSlot}${secondSlot}` }

      onUpdate(combined)
    }
  }, [prefix, firstSlot, secondSlot])

  useEffect(() => {
    if (initValueStr) {
      const [prefixInit, numberInit] = initValueStr.split(' ')

      if (MOBILE_PREFIXES.includes(prefixInit)) {
        setPrefix(prefixInit)
      }

      if (numberInit) {
        setFirstSlot(numberInit.slice(0, 4))
        setSecondSlot(numberInit.slice(4))
      }
    }
  }, [initValueStr])

  return (
    <div className={cn('mobile-number-field', classes)}>
      <div className='selectbox'>
        <select className={cn('select', isSmall && 'is-small')}
          value={prefix}
          onChange={setPrefix}>
          {
            MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
          }
        </select>
      </div>

      <div className='mobile-number-wrapper'>
        <input type='text' className={cn('input', isSmall && 'is-small')}
          value={firstSlot}
          onInput={e => updateSlot(e.target.value)}
          maxLength={4}
          inputMode='numeric'
          placeholder='예) 1234' />

        <span className='dash-sign'>-</span>

        <input type='text' className={cn('input', isSmall && 'is-small')}
          value={secondSlot}
          onInput={e => updateSlot(e.target.value, true)}
          maxLength={4}
          inputMode='numeric'
          placeholder='예) 1234' />
      </div>
    </div>
  )
}

export default React.memo(MobileNumberField)
