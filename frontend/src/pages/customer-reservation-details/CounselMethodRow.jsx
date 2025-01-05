import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

// components
import StateButton from '@components/state-button/StateButton'

// utils
import { getCounselMethodNameById } from '@utils'
import { COUNSEL_METHOD } from '@view-data/constants.js'

// hooks
import { useUpdateReservationDetailsByCustomer } from '@store/features/reservationApiSlice.js'
import { ToastContext } from '@hooks/useToast.js'

// helpers
const optionsList = COUNSEL_METHOD.filter(entry => entry.id !== 'voice-talk')

function CounselMethodRow ({
  method = '',
  disableUpdate = false,
  onUpdateSuccess = () => {}
}) {
  const { id: reservationId } = useParams()
  const { addToastItem } = useContext(ToastContext)

  // local-state
  const [isUpdateMode, setIsUpdateMode] = useState(false)
  const [updatedValue, setUpdatedValue] = useState(method)
  const [updateReservationMethod, {
    isLoading: isUpdatingReservationMethod
  }] = useUpdateReservationDetailsByCustomer()

  // methods
  const toggleUpdateMode = () => {
    setIsUpdateMode(v => !v)
    setUpdatedValue(method)
  }
  const updateHandler = async () => {
    if (!window.confirm('상담 방식을 수정하시겠습니까?')) { return }

    try {
      const result = await updateReservationMethod({
        id: reservationId,
        updates: { method: updatedValue },
        type: 'method'
      }).unwrap()

      addToastItem({
        type: 'success',
        heading: '수정 완료!',
        content: '상담방식이 성공적으로 수정되었습니다.'
      })

      setIsUpdateMode(false)
      onUpdateSuccess()
    } catch (err) {
      console.error('CounselMethodRow.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '수정 오류!',
        content: '요청 처리중 오류가 발생하였습니다.'
      })

      setUpdatedValue(method)
      setIsUpdateMode(false)
    }
  }

  // view
  if (!method) { return null }

  return (
    <div className='summary-list__item align-center'>
      <span className='summary-list__label'>
        <span>상담 방식</span>
        {
          !disableUpdate &&
          <button className='is-small is-secondary modify-btn'
            type='button'
            disabled={isUpdatingReservationMethod}
            onClick={toggleUpdateMode}>
            {isUpdateMode ? '뒤로' : '변경'}
          </button>
        }
      </span>

      {
        isUpdateMode
          ? <span className='summary-list__value is-inline-flex'>
              <span className='selectbox is-small counsel-method-select'>
                <select className='select'
                  tabIndex='0'
                  value={updatedValue}
                  data-vkey='optionId'
                  onChange={e => setUpdatedValue(e.target.value)}>
                  {
                    optionsList.map(entry => (
                      <option value={entry.id} key={entry.id}>{entry.name}</option>
                    ))
                  }
                </select>
              </span>

              <StateButton classes='is-small update-btn'
                type='button'
                disabled={method === updatedValue}
                onClick={updateHandler}
                displayLoader={isUpdatingReservationMethod}
              >수정</StateButton>
            </span>
          : <span className='summary-list__value'>
              {getCounselMethodNameById(method)}
            </span>
      }
    </div>
  )
}

export default React.memo(CounselMethodRow)
