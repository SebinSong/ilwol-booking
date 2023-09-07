import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'
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
  const [details, setDetails] = useImmer({
    name: '',
    gender: '',
    dob: {
      system: 'lunar',
      year: '',
      month: '',
      date: ''
    }
  })

  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })
    }
  }
  const updateDobFactory = key => {
    return e => {
      setDetails(draft => {
        draft.dob[key] = e.target.value
      })
    }
  }

  // effects
  useEffect(() => {
    checkStepStateAndGo('date-and-time')
  }, [])

  return (
    <div className='enter-personal-details page-form-constraints'>
      <h3 className='is-title-4 is-sans page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>개인 정보</span>
      </h3>

      <form className='personal-details-form mt-40'>
        <div className='form-field'>
          <label>
            <span className='label'>이름</span>
            <input type='text' className='input'
              value={details.name}
              onInput={updateFactory('name')}
              placeholder='이름을 입력하세요' />
          </label>

          <p className='helper info'>띄어쓰기 없이 성 이름 붙여서 입력하세요.</p>
        </div>

        <div className='form-field'>
          <span className='label'>성별</span>

          <label className='radio gender-radio-item'>
            <input type='radio'
              checked={details.gender === 'male'}
              value='male'
              name='gender'
              onChange={updateFactory('gender')} />
            <span className='radio__label'>남자</span>
          </label>

          <label className='radio gender-radio-item'>
            <input type='radio'
              checked={details.gender === 'female'}
              value='female'
              name='gender'
              onChange={updateFactory('gender')} />
            <span className='radio__label'>여자</span>
          </label>
        </div>

        <div className='form-field'>
          <span className='label'>생년월일</span>

          <div className='dob-system-selection'>
            <label className='radio dob-radio-item'>
              <input type='radio'
                checked={details.dob?.system === 'lunar'}
                value='lunar'
                name='dob-system'
                onChange={updateDobFactory('system')} />
              <span className='radio__label'>양력</span>
            </label>

            <label className='radio dob-radio-item'>
              <input type='radio'
                checked={details.dob?.system === 'solar'}
                value='solar'
                name='dob-system'
                onChange={updateDobFactory('system')} />
              <span className='radio__label'>음력</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  )
}
