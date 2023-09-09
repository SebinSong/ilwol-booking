import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'
import { isStringNumberOnly } from '@utils'
import { MOBILE_PREFIXES, COUNSEL_METHOD } from '@view-data/constants.js'

import './EnterPersonalDetails.scss'

export default function EnterPersonalDetails () {
  const navigate = useNavigate()
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
    },
    mobile: {
      prefix: '',
      number: ''
    },
    kakaoId: '',
    method: isOverseasCounsel ? 'voice-talk' : '',
    email: '',
    memo: ''
  })
  const methodList = isOverseasCounsel
    ? COUNSEL_METHOD.filter(entry => 'voice-talk' === entry.id)
    : COUNSEL_METHOD.filter(entry => 'voice-talk' !== entry.id)

  // methods
  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })
    }
  }

  const updateDobFactory = (key, numberOnly = false) => {
    return e => {
      const val = e.target.value

      if (numberOnly && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft.dob[key] = val
      })
    }
  }

  const updateMobileFactory = key => {
    return e => {
      const val = e.target.value

      if (key === 'number' && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft.mobile[key] = val
      }) 
    }
  }

  const backToPreviousStep = () => {
    navigate('/booking/counsel-option')
  }

  const onContinueClick = () => {
    alert('TODO: Implement!')
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
            <span className='label'>
              이름
              <span className='mandatory'>{'(필수)'}</span>
            </span>

            <input type='text' className='input'
              value={details.name}
              onInput={updateFactory('name')}
              placeholder='이름을 입력하세요' />
          </label>

          <p className='helper info'>띄어쓰기 없이 성 이름 붙여서 입력하세요.</p>
        </div>

        <div className='form-field'>
          <span className='label'>
            성별
            <span className='mandatory'>{'(필수)'}</span>
          </span>

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
          <span className='label'>
            생년월일
            <span className='mandatory'>{'(필수)'}</span>
          </span>

          <div className='dob-group'>
            <div className='selectgroup dob-group__year'>
              <div className='selectbox'>
                <select className='select'
                  value={details.dob.system}
                  onChange={updateDobFactory('system')}>
                  <option value='lunar'>양력</option>
                  <option value='solar'>음력</option>
                </select>
              </div>

              <input type='text' className='input'
                value={details.dob.year}
                onInput={updateDobFactory('year', true)}
                maxLength={4}
                placeholder='년도' />
            </div>

            <div className='dob-group__month'>
              <input type='text' className='input'
                value={details.dob.month}
                onInput={updateDobFactory('month', true)}
                maxLength={2}
                placeholder='월' />
            </div>

            <div className='dob-group__date'>
              <input type='text' className='input'
                value={details.dob.date}
                onInput={updateDobFactory('date', true)}
                maxLength={2}
                placeholder='일' />
            </div>
          </div>
        </div>

        <div className='form-field'>
          <span className='label'>
            연락처
            <span className='mandatory'>{'(필수)'}</span>
          </span>

          {
            isOverseasCounsel
              ? <>
                  <div className='contact-field'>
                    <span className='contact-field__label'>카카오 ID</span>

                    <input type='text' className='input'
                      value={details.kakaoId}
                      onInput={updateFactory('kakaoId')}
                      placeholder='카카오톡 ID를 입력하세요' />
                  </div>

                  <p className='helper info'>'해외 상담'의 경우, 카카오톡 ID가 정확하지 않아 상담이 취소된 사례가 있으니, 오타가 없는지 확인 꼭 부탁드립니다.</p>
                </>
              : <>
                  <div className='contact-field'>
                    <span className='contact-field__label'>핸드폰</span>

                    <div className='selectgroup'>
                      <div className='selectbox'>
                        <select className='select'
                          value={details.mobile?.prefix}
                          onChange={updateMobileFactory('prefix')}>
                          {
                            MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
                          }
                        </select>
                      </div>

                      <input type='text' className='input'
                        value={details.mobile.number}
                        onInput={updateMobileFactory('number')}
                        maxLength={10}
                        placeholder='번호를 입력하세요' />
                    </div>
                  </div>
                </>
          }
        </div>

        <div className='form-field'>
          <span className='label'>
            상담 방식
            { !isOverseasCounsel && <span className='mandatory'>{'(필수)'}</span> }
          </span>

          {
            methodList.map(entry => (
              <label className='radio method-radio-item'>
                <input type='radio'
                  checked={details.method === entry.value}
                  value={entry.value}
                  name='counsel-method'
                  onChange={updateFactory('method')} />
                <span className='radio__label'>{entry.name}</span>
              </label>
            ))
          }
        </div>

        <div className='form-field'>
          <label>
            <span className='label'>
              이메일
              <span className='optional'>{'(선택사항)'}</span>
            </span>

            <input type='text' className='input'
              value={details.email}
              onInput={updateFactory('email')}
              placeholder='이메일' />
          </label>
        </div>

        <div className='form-field'>
          <label>
            <span className='label'>
              본인 소개 및 메모
              <span className='optional'>{'(선택사항)'}</span>
            </span>

            <textarea type='text' className='textarea'
              value={details.memo}
              onInput={updateFactory('memo')}
              placeholder='메모를 적어주세요'
              maxLength={200} />
          </label>

          <p className='helper info'>
            본인 소개 및 상담 이유, 혹은 선녀님께 드리고 싶은 말씀을 간단히 적어주세요.
            <span className='has-text-bold'>{'(200자 이내)'}</span>
          </p>
        </div>
      </form>

      <div className='buttons-container is-row mt-60'>
        <button type='button'
          className='is-secondary back-btn'
          onClick={backToPreviousStep}>
          뒤로 가기
        </button>

        <button type='button'
          className='is-primary continue-btn'
          onClick={onContinueClick}>
          다음
        </button>
      </div>
    </div>
  )
}
