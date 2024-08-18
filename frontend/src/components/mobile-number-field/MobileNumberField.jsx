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
  initValueStr = '',
  isError = false
}) {
  const [prefix, setPrefix] = useState('010')
  const [mobNum, setMobNum] = useState('')

  // method
  const updateNumber = (val) => {
    const sanitized = val.replace(/\D/g, '') // strip out non-number characters.

    setMobNum(sanitized)
  }

  // effects
  useEffect(() => {
    if (onUpdate) {
      const combined = getAsString
      ? `${prefix} ${mobNum}`
      : { prefix, number: mobNum }

      onUpdate(combined)
    }
  }, [prefix, mobNum])

  useEffect(() => {
    if (initValueStr) {
      const [prefixInit, numberInit] = initValueStr.split(' ')

      if (MOBILE_PREFIXES.includes(prefixInit)) {
        setPrefix(prefixInit)
      }

      if (numberInit) {
        setMobNum(numberInit.trim())
      }
    }
  }, [initValueStr])

  return (
    <div className={cn('mobile-number-field', classes)}>
      <div className='selectbox'>
        <select className={cn('select', isSmall && 'is-small', isError && 'is-error')}
          value={prefix}
          onChange={setPrefix}>
          {
            MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
          }
        </select>
      </div>

      <div className='mobile-number-wrapper'>
        <input type='text' className={cn('input', isSmall && 'is-small', isError && 'is-error')}
          value={mobNum}
          onInput={e => updateNumber(e.target.value)}
          inputMode='numeric'
          placeholder='예) 12341234' />
      </div>
    </div>
  )
}

export default React.memo(MobileNumberField)
