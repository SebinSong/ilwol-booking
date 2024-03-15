import React, { useState, useMemo, useContext } from 'react'

// hooks
import { ToastContext } from '@hooks/useToast.js'
import {
  useClearCalendar,
  useRegenerateCalendar
} from '@store/features/adminApiSlice.js'
import { useGetAdminReservations } from '@store/features/adminApiSlice.js'

// child components
import StateButton from '@components/state-button/StateButton'
import LoaderModal from '@components/loader-modal/LoaderModal'

function GoogleCalendarSection ({
  classes = ''
}) {
  const { addToastItem } = useContext(ToastContext)

  // local state
  const [updateStatus, setUpdateStatus] = useState('idle')
  const [clearCalendar, {
    isLoading: isClearingCalendar
  }] = useClearCalendar()
  const [regenerateCalendar, {
    isLoading: isRegeneratingCalendar
  }] = useRegenerateCalendar()
  const [getReservations, {
    data,
    isLoading: isLoadingReservations,
    isError: isReservationError
  }] = useGetAdminReservations()

  // computed state
  const loaderModalOpts = useMemo(() => {
    switch (updateStatus) {
      case 'deleting':
        return {
          showModal: true,
          content: <><span>아이템 삭제 및 초기화 중..</span><br/><span>(오랜 시간이 소요될 수 있습니다)</span></>
        }
      case 'generating':
        return {
          showModal: true,
          content: <><span>모든 예약 아이템 재생성 중..</span><br/><span>(오랜 시간이 소요될 수 있습니다)</span></>
        }
      default:
        return { showModal: false } 
    }
  }, [updateStatus])

  const onSyncButtonClick = async () => {
    if (!window.confirm('캘린더를 리셋하시겠습니까? 캘린더의 모든 현재 데이터가 재생성 됩니다.')) { return }

    try {
      setUpdateStatus('deleting')
      const res = await clearCalendar()

      setUpdateStatus('generating')
      const resRegen = await regenerateCalendar()

      setUpdateStatus('idle')
      addToastItem({
        type: 'success',
        heading: '캘린더 업데이트',
        content: '구글 캘린더가 성공적으로 리셋 되었습니다. 확인해보세요.'
      })
    } catch (err) {
      console.error('ManageGoogleCalendar.jsx caught: ', err)
      addToastItem({
        type: 'warning',
        heading: '업데이트 오류!',
        content: '구글 캘린더 업데이트 중 오류가 발생하였습니다. 다시 시도해 주세요.'
      })
    }

    setUpdateStatus('idle')
  }
  return (
    <section className={`admin-page-section ${classes}`}>
      <h3 className='admin-page-section-title'>
        <i className='icon-chevron-right-circle is-prefix'></i>
        <span>Google Calendar</span>
      </h3>

      <div className='form-field'>
        <span className='label'>캘린더 리셋:</span>
        <p className='helper info'>구글 캘린더의 예약 아이템들을 모두 지운 후, 다시 새로 재생성 합니다.</p>

        <StateButton classes='is-primary mt-20'
          type='button'
          disabled={updateStatus !== 'idle'}
          onClick={onSyncButtonClick}
        >
          <i className='icon-gear is-prefix'></i>
          <span>리셋하기</span>
        </StateButton>
      </div>

      <LoaderModal showModal={loaderModalOpts.showModal}>
        {loaderModalOpts.content}
      </LoaderModal>
    </section>
  )
}

export default React.memo(GoogleCalendarSection)
