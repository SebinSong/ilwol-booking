import React, { useEffect } from 'react'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'

import './EnterPersonalDetails.scss'

export default function EnterPersonalDetails () {
  // local-state
  const {
    checkStepStateAndGo,
    counselOptionInstore
  } = useCounselOptionSteps()
  const isOverseasCounsel = counselOptionInstore &&
    counselOptionInstore.id === 'overseas-counsel'

  // effects
  useEffect(() => {
    checkStepStateAndGo('date-and-time')
  }, [])

  return (
    <div className='enter-personal-details'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>개인 정보</span>
      </h3>

      <form className='page-form-constraints'>
        테스트 해보기.
      </form>
    </div>
  )
}
