import React, { useState, useEffect } from 'react'

/*
  $small-phone: 576px;
  $large-phone: 768px;
  $tablet: 992px;
  $desktop: 1200px;
 */

const smallphone = 576
const largephone = 768
const tablet = 992
const desktop = 1200

const queryMap = {
  'smallphone': `(max-width: ${smallphone - 1}px)`,
  'from-smallphone-until-largephone': `(min-width: ${smallphone}px) and (max-width: ${largephone - 1}px)`,
  'until-largephone': `(max-width: ${largephone - 1}px)`,
  'from-tablet': `(min-width: ${tablet}px)`,
  'desktop': `(min-width: ${desktop}px)`
}

function useMq (deviceOption = '', customQueryString) {
  const queryString = customQueryString || queryMap[deviceOption] || ''

  const [isMatched, setIsMatched] = useState(false)
  const checkIfMqMatches = () => {
    const check = window.matchMedia(queryString).matches

    setIsMatched(matches => matches !== check ? check : matches)
  }

  useEffect(() => {
    window.addEventListener('resize', checkIfMqMatches)
    checkIfMqMatches()

    return function cleanUp () {
      window.removeEventListener('resize', checkIfMqMatches)
    }
  }, [])

  return isMatched
}

export default useMq
