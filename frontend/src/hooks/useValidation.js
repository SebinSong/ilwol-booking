import React, { useState } from 'react'

export function useValidation (targetState = {}, validationEntries = []) {
  const [formError, setFormError] = useState(null)

  const validateAll = () => {
    for (const { key, check, errMsg } of validationEntries) {
      if (!check(targetState[key], targetState)) {
        setFormError({ errKey: key, errMsg })

        const fieldEl = document.querySelector(`[data-vkey="${key}"]`)
        fieldEl && fieldEl?.focus()

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

  return {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  }
}
