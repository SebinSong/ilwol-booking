import React, { useState, useEffect } from 'react'

export function useValidation (targetState = {}, validationEntries = []) {
  const [formError, setFormError] = useState(null)

  const validateAll = () => {
    for (const { key, check, errMsg } of validationEntries) {
      if (!check(targetState[key], targetState)) {
        setFormError({ errKey: key, errMsg })

        return false
      }
    }

    return true
  }

  const clearFormError = () => {
    setFormError(null)
  }

  const isErrorActive = (key = '') => {
    return key
      ? formError?.errKey === key
      : Boolean(formError)
  }

  const focusOnError = (errKey = '') => {
    const fieldEl = document.querySelector(`[data-vkey="${errKey}"]`)
        
    if (fieldEl) {
      fieldEl.focus && fieldEl.focus()
      fieldEl.scrollIntoView({
        block: 'center',
        inline: "nearest"
      })
    }
  }

  useEffect(() => {
    if (formError) {
      focusOnError(formError.errKey)
    }
  }, [formError])

  return {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  }
}
