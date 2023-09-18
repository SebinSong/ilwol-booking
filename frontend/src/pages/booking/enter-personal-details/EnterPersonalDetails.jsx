import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useImmer } from 'use-immer'
import useCounselOptionSteps from '@hooks/useCounselOptionSteps'
import {
  isStringNumberOnly,
  validateEmail,
  isObject,
  classNames as cn
} from '@utils'
import { addPersonalDetails } from '@store/features/counselDetailsSlice.js'
import { MOBILE_PREFIXES, COUNSEL_METHOD } from '@view-data/constants.js'
import { useValidation } from '@hooks/useValidation'

import './EnterPersonalDetails.scss'

const { WarningMessage } = React.Global

// helper
const isNumberLessThan = (val, num) => Boolean(val.length) && parseInt(val) > 0 && parseInt(val) < num

export default function EnterPersonalDetails () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // local-state
  const {
    checkStepStateAndGo,
    counselOptionInstore,
    counselPersonalDetailsInStore: detailsInStore = {}
  } = useCounselOptionSteps()

  // computed state
  const { id: optionId = '', type: optionType = '' } = counselOptionInstore || {}
  const isOverseasCounsel = optionId === 'overseas-counsel'
  const isGroupOption = optionType === 'group'

  const [details, setDetails] = useImmer({
    name: detailsInStore?.name || '',
    gender: detailsInStore?.gender || '',
    dob: detailsInStore?.dob || {
      system: 'lunar',
      year: '',
      month: '',
      date: ''
    },
    numAttendee: isGroupOption ? 2 : 1,
    mobile: detailsInStore?.mobile || {
      prefix: '010',
      number: ''
    },
    kakaoId: detailsInStore?.kakaoId || '',
    method: detailsInStore?.method
      ? detailsInStore?.method
      : isOverseasCounsel
        ? 'voice-talk'
        : '',
    email: detailsInStore?.email || '',
    memo: detailsInStore?.memo || ''
  })
  const methodList = isOverseasCounsel
    ? COUNSEL_METHOD.filter(entry => 'voice-talk' === entry.id)
    : COUNSEL_METHOD.filter(entry => 'voice-talk' !== entry.id)

  // computed state
  const enableContinueBtn = [
    'name',
    'gender',
    'dob',
    isOverseasCounsel ? 'kakaoId' : 'mobile',
    'method'
  ].every(key => {
    const targetField = details[key]

    return isObject(targetField)
      ? Object.keys(targetField).every(innerKey => Boolean(targetField[innerKey]))
      : Boolean(targetField)
  })

  // validation
  const {
    formError,
    validateAll,
    clearFormError,
    isErrorActive
  } = useValidation(details, [
    {
      key: 'name',
      check: val => val.length >= 2,
      errMsg: '이름은 2글자 이상 입력해야 합니다.'
    },
    {
      key: 'email',
      check: val => !val || validateEmail(val),
      errMsg: '올바른 포맷의 이메일을 입력하세요.'
    },
    {
      key: 'dob',
      check: ({ year, month, date }) => year.length === 4 &&
        isNumberLessThan(month, 13) &&
        isNumberLessThan(date, 32),
      errMsg: '생년월일을 바로 입력하세요. (연도 4자, 월/일 2자 이내)'
    }
  ])

  // methods
  const updateFactory = key => {
    return e => {
      setDetails(draft => {
        draft[key] = e.target.value
      })

      if (formError?.errKey === key) { clearFormError() }
    }
  }

  const updateDobFactory = (key, numberOnly = false) => {
    return e => {
      const val = e.target.value

      if (numberOnly && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft.dob[key] = val
      })

      if (formError?.errKey === 'dob') { clearFormError() }
    }
  }

  const updateMobileFactory = key => {
    return e => {
      const val = e.target.value

      if (key === 'number' && !isStringNumberOnly(val)) { return }

      setDetails(draft => {
        draft.mobile[key] = val
      })

      if (formError?.errKey === 'mobile') { clearFormError() }
    }
  }

  const backToPreviousStep = () => {
    navigate('/booking/date-and-time')
  }

  const onContinueClick = () => {
    if (validateAll()) {
      try {
        dispatch(addPersonalDetails(details))
        navigate('/booking/reserve')
      } catch (err) {
        alert(`error while storing data to the store! : ${JSON.stringify(err)}`)
      }
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

      <div className='personal-details-form mt-40'>
        <div className='form-field'>
          <label>
            <span className='label'>
              이름
              <span className='mandatory'>{'(필수)'}</span>
            </span>

            <input type='text'
              className={cn('input', isErrorActive('name') && 'is-error')}
              data-vkey='name'
              value={details.name}
              onInput={updateFactory('name')}
              placeholder='이름을 입력하세요' />
          </label>

          {
            isErrorActive('name')
              ? <WarningMessage toggle={true} message={formError?.errMsg} />
              : <p className='helper info'>띄어쓰기 없이 성 이름 붙여서 입력하세요.</p>
          }
        </div>

        <div className='form-field' data-vkey='gender'>
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
                  tabIndex='0'
                  value={details.dob.system}
                  onChange={updateDobFactory('system')}>
                  <option value='lunar'>양력</option>
                  <option value='solar'>음력</option>
                </select>
              </div>

              <input type='text' className='input'
                data-vkey='dob'
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

        <WarningMessage toggle={isErrorActive('dob')} message={formError?.errMsg} />

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

                    <p className='helper info'>띄어쓰기 또는 "-" 없이 숫자만 입력해 주세요.</p>
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
              <label className='radio method-radio-item' key={entry.id}>
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

        { optionId === 'family-counsel' &&
          <div className='form-field'>
            <span className='label'>
              총 인원 (본인 포함)
              <span className='mandatory'>{'(필수)'}</span>
            </span>

            <div className='selectbox num-attendee-select'>
              <select className='select'
                value={details.numAttendee}
                onChange={updateFactory('numAttendee')}>
                {
                  [2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)
                }
              </select>
            </div>
          </div>
        }

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

        <WarningMessage toggle={isErrorActive('email')} message={formError?.errMsg} />

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
      </div>

      <div className='buttons-container is-row mt-60'>
        <button type='button'
          className='is-secondary back-btn'
          onClick={backToPreviousStep}>
          뒤로 가기
        </button>

        <button type='button'
          className='is-primary continue-btn'
          disabled={!enableContinueBtn}
          onClick={onContinueClick}>
          다음
        </button>
      </div>
    </div>
  )
}
