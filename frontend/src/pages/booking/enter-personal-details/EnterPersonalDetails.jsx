import React, { useState, useEffect, useContext } from 'react'
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
import { ToastContext } from '@hooks/useToast.js'
import { addPersonalDetails } from '@store/features/counselDetailsSlice.js'
import { MOBILE_PREFIXES, COUNSEL_METHOD } from '@view-data/constants.js'
import { useValidation } from '@hooks/useValidation'
import CopyToClipboard from '@components/copy-to-clipboard/CopyToClipboard'

import './EnterPersonalDetails.scss'

const { WarningMessage } = React.Global

// helper
const thisYear = (new Date()).getFullYear()
const yearOptions = Array.from(new Array(90), (v, index) => (thisYear - 10 - index) + '') // Age limit: MIN - 10 yrs old , MAX - 100 yrs old

const isNumberLessThan = (val, num) => Boolean(val.length) && parseInt(val) > 0 && parseInt(val) < num
const splitMobileNumber = (val = '', key = 'first') => {
  if (!val) { return '' }

  val = new String(val)
  const middle = val.length < 8 ? 3 : 4
  const first = val.slice(0, middle)
  const second = val.slice(middle, val.length)

  return key === 'second' ? second : first
}

export default function EnterPersonalDetails () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToastItem } = useContext(ToastContext)

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
  const numAttendeeOptions = isGroupOption ? [2, 3, 4, 5] : [1, 2, 3, 4, 5]

  const [mobileFirst, setMobileFirst] = useState(
    detailsInStore?.mobile?.number ? splitMobileNumber(detailsInStore.mobile.number, 'first') : ''
  )
  const [mobileSecond, setMobileSecond] = useState(
    detailsInStore?.mobile?.number ? splitMobileNumber(detailsInStore.mobile.number, 'second') : ''
  )
  const [details, setDetails] = useImmer({
    name: detailsInStore?.name || '',
    gender: detailsInStore?.gender || '',
    dob: detailsInStore?.dob || {
      system: 'lunar',
      year: 'year-str',
      month: '',
      date: ''
    },
    numAttendee: isGroupOption ? 2 : 1,
    mobile: detailsInStore?.mobile || {
      prefix: '010',
      number: ''
    },
    kakaoId: detailsInStore?.kakaoId || '',
    method: isOverseasCounsel
      ? 'voice-talk'
      : detailsInStore?.method !== 'voice-talk'
        ? detailsInStore?.method || ''
        : '',
    email: detailsInStore?.email || '',
    memo: detailsInStore?.memo || ''
  })
  const methodList = isOverseasCounsel
    ? COUNSEL_METHOD.filter(entry => 'voice-talk' === entry.id)
    : COUNSEL_METHOD.filter(entry => 'voice-talk' !== entry.id)
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
      check: ({ year, month, date }) => year !== 'year-str' &&
        isNumberLessThan(month, 13) &&
        isNumberLessThan(date, 32),
      errMsg: '생년월일을 바로 입력하세요. (연도 선택 및, 월/일 2자 이내)'
    },
    {
      key: 'mobile',
      check: () => mobileFirst.length >=3 && mobileSecond.length >= 3,
      errMsg: '핸드폰 번호를 바로 입력해 주세요. (각각 3자리 숫자 이상)'
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

      if (['number-first', 'number-second'].includes(key) &&
        !isStringNumberOnly(val)) { return }

      switch (key) {
        case 'prefix': {
          setDetails(draft => {
            draft.mobile.prefix = val
          })
          break
        }
        case 'number-first': {
          setMobileFirst(val)
          break
        }
        case 'number-second': {
          setMobileSecond(val)
          break
        }
      }

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
        console.error('error: ', err)
        addToastItem({
          type: 'warning',
          heading: '에러 발생!',
          content: err?.message || '예기치 못한 이슈가 발생하였습니다. 잠시 후 다시 시도해 주세요.'
        })
      }
    }
  }

  // effects
  useEffect(() => {
    checkStepStateAndGo('date-and-time')
  }, [])

  useEffect(() => {
    setDetails(draft => {
      draft.mobile.number = mobileFirst + mobileSecond
    })
  }, [mobileFirst, mobileSecond])

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

          <div className='dob-group' tabIndex='0'>
            <div className='selectgroup dob-group__year'>
              <div className='selectbox'>
                <select className='select'
                  data-vkey='dob'
                  tabIndex='0'
                  value={details.dob.system}
                  onChange={updateDobFactory('system')}>
                  <option value='lunar'>양력</option>
                  <option value='solar'>음력</option>
                </select>
              </div>

              <div className='selectbox'>
                <select className='select select--second year-select'
                  tabIndex='0'
                  value={details.dob.year}
                  onChange={updateDobFactory('year', false)}>
                  <option value='year-str'>년도</option>
                  {
                    yearOptions.map(
                      yearVal => <option key={yearVal} value={yearVal}>{yearVal}</option>
                    )
                  }
                </select>
              </div>
            </div>

            <div className='dob-group__month'>
              <input type='text' className='input'
                inputMode='numeric'
                value={details.dob.month}
                onInput={updateDobFactory('month', true)}
                maxLength={2}
                placeholder='월' />
            </div>

            <div className='dob-group__date'>
              <input type='text' className='input'
                inputMode='numeric'
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

                    <div className='contact-field__mobile-container'>
                      <div className='selectbox'>
                        <select className='select'
                          value={details.mobile?.prefix}
                          onChange={updateMobileFactory('prefix')}>
                          {
                            MOBILE_PREFIXES.map(entry => <option key={entry} value={entry}>{entry}</option>)
                          }
                        </select>
                      </div>

                      <div className='mobile-number-wrapper'>
                        <input type='text' className='input'
                          value={mobileFirst}
                          onInput={updateMobileFactory('number-first')}
                          maxLength={4}
                          inputMode='numeric'
                          placeholder='예) 123, 1234' />

                        <span className='dash-sign'>-</span>

                        <input type='text' className='input'
                          value={mobileSecond}
                          onInput={updateMobileFactory('number-second')}
                          maxLength={4}
                          inputMode='numeric'
                          placeholder='예) 1234' />
                      </div>
                    </div>
                  </div>

                  <WarningMessage toggle={isErrorActive('mobile')} message={formError?.errMsg} />
                </>
          }

          {
            isOverseasCounsel &&
            <div className='owner-kakao-id'>
              <label>선녀님 카카오 ID <span className='text-color-magenta'>(미리 친구추가 해주시면, 원활한 진행에 도움이 됩니다)</span>
              </label>

              <CopyToClipboard classes='copy-kakao-id-el'
                textToCopy='dragonrex'
                toastOpt={{
                  heading: 'ID 복사',
                  content: '카카오 ID가 클립보드에 저장 되었습니다.'
                }}>
                <span className='id-value'>dragonrex</span>
              </CopyToClipboard>
            </div>
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

        { ['family-counsel', 'overseas-counsel'].includes(optionId) &&
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
                  numAttendeeOptions.map(num => <option key={num} value={num}>{num}</option>)
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
